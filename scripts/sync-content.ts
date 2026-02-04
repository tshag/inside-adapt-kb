#!/usr/bin/env tsx
/**
 * Content Sync Script
 * 
 * This script syncs content from Notion to the local content directory.
 * It requires a Notion integration token and root page ID.
 * 
 * Usage:
 *   export NOTION_TOKEN=secret_xxx
 *   export NOTION_ROOT_PAGE_ID=xxx
 *   npm run content:sync
 */

import { Client } from "@notionhq/client";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_ROOT_PAGE_ID = process.env.NOTION_ROOT_PAGE_ID;

if (!NOTION_TOKEN || !NOTION_ROOT_PAGE_ID) {
  console.error("Error: NOTION_TOKEN and NOTION_ROOT_PAGE_ID must be set");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });
const CONTENT_DIR = path.join(process.cwd(), "content");

interface PageInfo {
  id: string;
  title: string;
  lastEdited: string;
}

async function getPageTitle(pageId: string): Promise<string> {
  const page = await notion.pages.retrieve({ page_id: pageId });
  
  if ("properties" in page) {
    const titleProp = Object.values(page.properties).find(
      (p) => p.type === "title"
    );
    
    if (titleProp && titleProp.type === "title") {
      return titleProp.title.map((t) => t.plain_text).join("");
    }
  }
  
  return "Untitled";
}

async function getChildPages(pageId: string): Promise<PageInfo[]> {
  const blocks = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  });
  
  const pages: PageInfo[] = [];
  
  for (const block of blocks.results) {
    if (block.type === "child_page") {
      pages.push({
        id: block.id,
        title: block.child_page.title,
        lastEdited: block.last_edited_time,
      });
    }
    
    // Also check for link_to_page blocks
    if (block.type === "link_to_page" && "page_id" in block.link_to_page) {
      const linkedPageId = block.link_to_page.page_id;
      const title = await getPageTitle(linkedPageId);
      const page = await notion.pages.retrieve({ page_id: linkedPageId });
      pages.push({
        id: linkedPageId,
        title,
        lastEdited: page.last_edited_time,
      });
    }
  }
  
  return pages;
}

async function convertBlockToMarkdown(block: any): Promise<string> {
  switch (block.type) {
    case "paragraph":
      const text = block.paragraph.rich_text
        .map((t: any) => t.plain_text)
        .join("");
      return text ? `${text}\n\n` : "\n";
    
    case "heading_1":
      const h1 = block.heading_1.rich_text
        .map((t: any) => t.plain_text)
        .join("");
      return `# ${h1}\n\n`;
    
    case "heading_2":
      const h2 = block.heading_2.rich_text
        .map((t: any) => t.plain_text)
        .join("");
      return `## ${h2}\n\n`;
    
    case "heading_3":
      const h3 = block.heading_3.rich_text
        .map((t: any) => t.plain_text)
        .join("");
      return `### ${h3}\n\n`;
    
    case "bulleted_list_item":
      const bullet = block.bulleted_list_item.rich_text
        .map((t: any) => t.plain_text)
        .join("");
      return `- ${bullet}\n`;
    
    case "numbered_list_item":
      const num = block.numbered_list_item.rich_text
        .map((t: any) => t.plain_text)
        .join("");
      return `1. ${num}\n`;
    
    case "code":
      const code = block.code.rich_text
        .map((t: any) => t.plain_text)
        .join("");
      const lang = block.code.language || "";
      return "```" + lang + "\n" + code + "\n```\n\n";
    
    case "quote":
      const quote = block.quote.rich_text
        .map((t: any) => t.plain_text)
        .join("");
      return `> ${quote}\n\n`;
    
    case "divider":
      return "---\n\n";
    
    default:
      return "";
  }
}

async function exportPageToMarkdown(pageId: string): Promise<string> {
  const blocks = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  });
  
  let markdown = "";
  
  for (const block of blocks.results) {
    markdown += await convertBlockToMarkdown(block);
  }
  
  return markdown;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function determineAccessLevel(title: string, parentPath: string): "all" | "billing" {
  const lowerTitle = title.toLowerCase();
  const lowerPath = parentPath.toLowerCase();
  
  // Check if in billing section
  if (lowerPath.includes("billing")) {
    return "billing";
  }
  
  // Check for billing keywords
  const billingKeywords = ["billing", "claims", "reimbursement", "insurance", "payment"];
  if (billingKeywords.some(kw => lowerTitle.includes(kw))) {
    return "billing";
  }
  
  return "all";
}

async function syncSection(
  sectionName: string,
  sectionId: string,
  outputPath: string
): Promise<void> {
  console.log(`\nSyncing section: ${sectionName}`);
  
  // Create section directory
  await fs.mkdir(outputPath, { recursive: true });
  
  // Get child pages
  const pages = await getChildPages(sectionId);
  console.log(`  Found ${pages.length} pages`);
  
  // Create section index
  const sectionIndex = `---
title: "${sectionName}"
description: "Auto-synced from Notion"
order: 1
access: ${determineAccessLevel(sectionName, outputPath)}
---

# ${sectionName}

This section contains documents synced from Notion.
`;
  
  await fs.writeFile(
    path.join(outputPath, "_index.md"),
    sectionIndex
  );
  
  // Export each page
  for (const page of pages) {
    console.log(`  Exporting: ${page.title}`);
    
    try {
      const content = await exportPageToMarkdown(page.id);
      const slug = slugify(page.title);
      const access = determineAccessLevel(page.title, outputPath);
      
      const frontmatter = `---
title: "${page.title}"
lastUpdated: "${page.lastEdited.split("T")[0]}"
access: ${access}
order: 1
---

`;
      
      await fs.writeFile(
        path.join(outputPath, `${slug}.md`),
        frontmatter + content
      );
    } catch (error) {
      console.error(`    Error exporting ${page.title}:`, error);
    }
  }
}

async function main(): Promise<void> {
  console.log("Starting Notion content sync...");
  console.log(`Root page ID: ${NOTION_ROOT_PAGE_ID}`);
  
  try {
    // Get root page info
    const rootTitle = await getPageTitle(NOTION_ROOT_PAGE_ID);
    console.log(`\nRoot page: ${rootTitle}`);
    
    // Get sections (child pages of root)
    const sections = await getChildPages(NOTION_ROOT_PAGE_ID);
    console.log(`\nFound ${sections.length} sections`);
    
    // Sync each section
    for (const section of sections) {
      const sectionSlug = slugify(section.title);
      const sectionPath = path.join(CONTENT_DIR, "docs", sectionSlug);
      
      await syncSection(section.title, section.id, sectionPath);
    }
    
    console.log("\n✅ Sync completed successfully!");
    console.log("\nNext steps:");
    console.log("  1. Review the synced content");
    console.log("  2. Update frontmatter as needed");
    console.log("  3. Commit changes: git add content/ && git commit");
    console.log("  4. Deploy: git push");
    
  } catch (error) {
    console.error("\n❌ Sync failed:", error);
    process.exit(1);
  }
}

main();
