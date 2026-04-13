#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadClauses, searchClauses } from "./clauses.js";

const clauses = loadClauses();

const server = new McpServer({
  name: "avtalebiblioteket",
  version: "0.1.0",
});

// Tool: Search clauses by natural language query
server.tool(
  "search_clauses",
  "Søk i norske kontraktsklausuler med naturlig språk. Returnerer relevante klausuler med sammendrag.",
  {
    query: z.string().describe("Søkeord eller spørsmål, f.eks. 'konkurranseforbud etter oppsigelse' eller 'hva skjer hvis kontrakten ikke sier noe om ansvar?'"),
  },
  async ({ query }) => {
    const results = searchClauses(clauses, query).slice(0, 5);

    if (results.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Ingen klausuler funnet for: "${query}"`,
          },
        ],
      };
    }

    const text = results
      .map(
        (c) =>
          `### ${c.title}\n**ID:** ${c.id}\n**Kategori:** ${c.category}\n**Juridisk grunnlag:** ${c.legal_basis.map((b) => `${b.law} ${b.section}`).join(", ")}\n\n${c.summary}${c.reviewed_by ? "" : "\n\n⚠️ *Ikke gjennomgått av jurist*"}`
      )
      .join("\n\n---\n\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `Fant ${results.length} klausul(er) for "${query}":\n\n${text}`,
        },
      ],
    };
  }
);

// Tool: Get full clause content by ID
server.tool(
  "get_clause",
  "Hent fullstendig innhold for en spesifikk klausul.",
  {
    id: z.string().describe("Klausul-ID, f.eks. 'employment/non-compete' eller 'commercial/force-majeure'"),
  },
  async ({ id }) => {
    const clause = clauses.find((c) => c.id === id);

    if (!clause) {
      const available = clauses.map((c) => c.id).join(", ");
      return {
        content: [
          {
            type: "text" as const,
            text: `Klausul '${id}' ikke funnet. Tilgjengelige klausuler: ${available}`,
          },
        ],
      };
    }

    const header = [
      `# ${clause.title}`,
      `**Kategori:** ${clause.category}`,
      `**Juridisk grunnlag:** ${clause.legal_basis.map((b) => `[${b.law} ${b.section}](${b.url})`).join(", ")}`,
      `**Kilde:** ${clause.source}`,
      clause.reviewed_by
        ? `**Gjennomgått av:** ${clause.reviewed_by}`
        : "⚠️ **Ikke gjennomgått av jurist**",
      `**Sist oppdatert:** ${clause.last_updated}`,
    ].join("\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `${header}\n\n${clause.content}`,
        },
      ],
    };
  }
);

// Tool: List clauses by category
server.tool(
  "list_clauses",
  "List alle klausuler, eventuelt filtrert etter kategori.",
  {
    category: z
      .enum([
        "employment",
        "confidentiality",
        "commercial",
        "corporate",
        "data-privacy",
        "general",
      ])
      .optional()
      .describe("Filtrer etter kategori. Utelat for å se alle."),
  },
  async ({ category }) => {
    const filtered = category
      ? clauses.filter((c) => c.category === category)
      : clauses;

    if (filtered.length === 0) {
      return {
        content: [
          {
            type: "text" as const,
            text: category
              ? `Ingen klausuler i kategori '${category}'.`
              : "Ingen klausuler funnet.",
          },
        ],
      };
    }

    const grouped = new Map<string, typeof filtered>();
    for (const c of filtered) {
      const group = grouped.get(c.category) || [];
      group.push(c);
      grouped.set(c.category, group);
    }

    let text = `**${filtered.length} klausul(er)**\n\n`;
    for (const [cat, items] of grouped) {
      text += `### ${cat}\n`;
      for (const item of items) {
        const review = item.reviewed_by ? "✅" : "⚠️";
        text += `- ${review} **${item.title}** (${item.id})\n`;
      }
      text += "\n";
    }

    return {
      content: [{ type: "text" as const, text }],
    };
  }
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
