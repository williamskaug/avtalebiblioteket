import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CLAUSES_DIR = path.resolve("clauses");
const VALID_CATEGORIES = [
  "employment",
  "confidentiality",
  "commercial",
  "corporate",
  "data-privacy",
  "general",
];
const VALID_SOURCES = ["original", "altinn", "ssa"];
const REQUIRED_SECTIONS = [
  "Klausultekst",
  "Hva betyr dette?",
  "Når brukes den?",
  "Vanlige variasjoner",
  "Pass på",
  "Juridisk grunnlag",
];

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

function validateClause(filePath: string): string[] {
  const errors: string[] = [];
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const rel = path.relative(CLAUSES_DIR, filePath);

  // Required frontmatter fields
  if (!data.id) errors.push(`${rel}: missing 'id'`);
  if (!data.title) errors.push(`${rel}: missing 'title'`);
  if (!data.category) {
    errors.push(`${rel}: missing 'category'`);
  } else if (!VALID_CATEGORIES.includes(data.category)) {
    errors.push(`${rel}: invalid category '${data.category}'`);
  }
  if (!data.tags || !Array.isArray(data.tags) || data.tags.length === 0) {
    errors.push(`${rel}: missing or empty 'tags'`);
  }
  if (!data.legal_basis || !Array.isArray(data.legal_basis) || data.legal_basis.length === 0) {
    errors.push(`${rel}: missing or empty 'legal_basis'`);
  } else {
    for (const basis of data.legal_basis) {
      if (!basis.law) errors.push(`${rel}: legal_basis entry missing 'law'`);
      if (!basis.section) errors.push(`${rel}: legal_basis entry missing 'section'`);
      if (!basis.url) errors.push(`${rel}: legal_basis entry missing 'url'`);
      if (basis.url && !basis.url.startsWith("https://lovdata.no")) {
        errors.push(`${rel}: legal_basis url should link to lovdata.no`);
      }
    }
  }
  if (!data.source) {
    errors.push(`${rel}: missing 'source'`);
  } else if (!VALID_SOURCES.includes(data.source)) {
    errors.push(`${rel}: invalid source '${data.source}'`);
  }
  if (!data.language) errors.push(`${rel}: missing 'language'`);
  if (!data.last_updated) errors.push(`${rel}: missing 'last_updated'`);

  // Check that id matches file path
  const expectedId = rel.replace(/\.md$/, "").replace(/\\/g, "/");
  if (data.id && data.id !== expectedId) {
    errors.push(`${rel}: id '${data.id}' doesn't match path '${expectedId}'`);
  }

  // Required content sections
  for (const section of REQUIRED_SECTIONS) {
    if (!content.includes(`## ${section}`)) {
      errors.push(`${rel}: missing section '## ${section}'`);
    }
  }

  return errors;
}

// Run
const files = getAllClauseFiles(CLAUSES_DIR);

if (files.length === 0) {
  console.log("No clause files found.");
  process.exit(0);
}

let allErrors: string[] = [];
for (const file of files) {
  allErrors.push(...validateClause(file));
}

if (allErrors.length > 0) {
  console.error(`\n❌ ${allErrors.length} validation error(s):\n`);
  for (const err of allErrors) {
    console.error(`  • ${err}`);
  }
  process.exit(1);
} else {
  console.log(`✅ ${files.length} clause(s) validated successfully.`);
}
