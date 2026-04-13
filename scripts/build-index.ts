import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CLAUSES_DIR = path.resolve("clauses");
const OUTPUT = path.resolve("index.json");

interface ClauseEntry {
  id: string;
  title: string;
  category: string;
  tags: string[];
  summary: string;
  legal_basis: string[];
  source: string;
  reviewed_by: string | null;
  last_updated: string;
  path: string;
}

function getAllClauseFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllClauseFiles(fullPath));
    } else if (entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractSummary(content: string): string {
  // Extract the first paragraph after "## Hva betyr dette?"
  const match = content.match(/## Hva betyr dette\?\s*\n\s*\n(.+?)(?:\n\s*\n|$)/s);
  if (match) {
    return match[1].trim().replace(/\n/g, " ").slice(0, 200);
  }
  return "";
}

const files = getAllClauseFiles(CLAUSES_DIR);
const clauses: ClauseEntry[] = [];

for (const file of files) {
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  const rel = path.relative(path.resolve("."), file);

  clauses.push({
    id: data.id,
    title: data.title,
    category: data.category,
    tags: data.tags || [],
    summary: extractSummary(content),
    legal_basis: (data.legal_basis || []).map(
      (b: { law: string; section: string }) => `${b.law} ${b.section}`
    ),
    source: data.source,
    reviewed_by: data.reviewed_by || null,
    last_updated: data.last_updated,
    path: rel,
  });
}

clauses.sort((a, b) => a.id.localeCompare(b.id));

const index = {
  generated: new Date().toISOString(),
  count: clauses.length,
  clauses,
};

fs.writeFileSync(OUTPUT, JSON.stringify(index, null, 2));
console.log(`📚 Built index with ${clauses.length} clause(s) → ${OUTPUT}`);
