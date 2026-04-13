import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLAUSES_DIR = path.resolve(__dirname, "../clauses");

export interface Clause {
  id: string;
  title: string;
  category: string;
  tags: string[];
  legal_basis: { law: string; section: string; url: string }[];
  source: string;
  reviewed_by: string | null;
  last_updated: string;
  content: string;
  summary: string;
}

function getAllClauseFiles(dir: string): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;
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
  const match = content.match(
    /## Hva betyr dette\?\s*\n\s*\n(.+?)(?:\n\s*\n|$)/s
  );
  if (match) {
    return match[1].trim().replace(/\n/g, " ").slice(0, 300);
  }
  return "";
}

export function loadClauses(): Clause[] {
  const files = getAllClauseFiles(CLAUSES_DIR);
  const clauses: Clause[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf-8");
    const { data, content } = matter(raw);

    clauses.push({
      id: data.id,
      title: data.title,
      category: data.category,
      tags: data.tags || [],
      legal_basis: data.legal_basis || [],
      source: data.source,
      reviewed_by: data.reviewed_by || null,
      last_updated: data.last_updated,
      content,
      summary: extractSummary(content),
    });
  }

  return clauses.sort((a, b) => a.id.localeCompare(b.id));
}

export function searchClauses(clauses: Clause[], query: string): Clause[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);

  const scored = clauses.map((clause) => {
    const searchable = [
      clause.title,
      clause.id,
      clause.summary,
      clause.tags.join(" "),
      clause.legal_basis.map((b) => `${b.law} ${b.section}`).join(" "),
      clause.content,
    ]
      .join(" ")
      .toLowerCase();

    let score = 0;
    for (const term of terms) {
      if (clause.title.toLowerCase().includes(term)) score += 10;
      if (clause.tags.some((t) => t.toLowerCase().includes(term))) score += 5;
      if (clause.summary.toLowerCase().includes(term)) score += 3;
      if (searchable.includes(term)) score += 1;
    }

    return { clause, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.clause);
}
