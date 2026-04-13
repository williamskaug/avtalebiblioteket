# Avtalebiblioteket

Norske kontraktsklausuler — forklart på vanlig norsk.

Et åpent bibliotek med kontraktsklausuler for norsk næringsliv. Hver klausul kommer med klausultekst, forklaring på vanlig norsk, vanlige variasjoner, fallgruver, og referanser til norsk lov.

> ⚠️ **Dette er ikke juridisk rådgivning.** Se [DISCLAIMER.md](DISCLAIMER.md).

## Innhold

### Arbeidsrett
- [Konkurranseklausul](clauses/employment/non-compete.md) — Forbud mot å jobbe hos konkurrent etter oppsigelse

### Fortrolighet
*Kommer snart*

### Kommersielle avtaler
*Kommer snart*

### Selskapsrett
*Kommer snart*

### Personvern
*Kommer snart*

## Bruk med AI (MCP)

Avtalebiblioteket har en MCP-server som lar Claude og andre AI-assistenter søke i og hente klausuler direkte.

### Oppsett i Claude Desktop

Legg til i `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "avtalebiblioteket": {
      "command": "npx",
      "args": ["avtalebiblioteket"]
    }
  }
}
```

### Eksempler på spørsmål

- *«Jeg skal signere en konsulentavtale. Hvilke klausuler bør jeg se etter?»*
- *«Forklar konkurranseklausulen i arbeidskontrakten min»*
- *«Hva sier loven om oppsigelsestid hvis kontrakten ikke nevner det?»*
- *«Kan arbeidsgiver håndheve et konkurranseforbud etter nedbemanning?»*

### MCP-verktøy

| Verktøy | Beskrivelse |
|---------|-------------|
| `search_clauses` | Søk i klausuler med naturlig språk |
| `get_clause` | Hent fullstendig innhold for en klausul |
| `list_clauses` | List alle klausuler, eventuelt filtrert etter kategori |

## Bidra

Vi trenger hjelp med nye klausuler, bedre forklaringer, og juridisk gjennomgang. Se [CONTRIBUTING.md](CONTRIBUTING.md).

## Lisens

- Innhold: [CC BY-SA 4.0](LICENSE-CONTENT)
- Kode: [MIT](LICENSE-CODE)
