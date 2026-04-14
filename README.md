# Avtalebiblioteket

**Norske kontraktsklausuler — forklart på vanlig norsk.**

[![License: CC BY-SA 4.0](https://img.shields.io/badge/Innhold-CC_BY--SA_4.0-blue.svg)](LICENSE-CONTENT)
[![License: MIT](https://img.shields.io/badge/Kode-MIT-green.svg)](LICENSE-CODE)
[![Clauses](https://img.shields.io/badge/klausuler-6-orange.svg)](#innhold)

Et åpent bibliotek med kontraktsklausuler for norsk næringsliv. Hver klausul kommer med klausultekst, forklaring på vanlig norsk, vanlige variasjoner, fallgruver, og direkte referanser til norsk lov på Lovdata.

Biblioteket er tilgjengelig både som **markdown-filer** og som en **MCP-server**, slik at du kan slå opp klausuler direkte fra Claude, Cursor og andre AI-assistenter.

> ⚠️ **Dette er ikke juridisk rådgivning.** Klausulene er ment som pedagogisk materiale og utgangspunkt for videre arbeid. Se [DISCLAIMER.md](DISCLAIMER.md).

## Hvorfor?

Å lese norske kontrakter er vanskelig — selv for jurister, og spesielt for gründere, ledere og ansatte som må forstå hva de skriver under på. Standardklausulene er de samme fra avtale til avtale, men forklaringene er låst inne i advokatfirmaer eller spredt over lovkommentarer, blogginnlegg og glemte PDF-er.

Avtalebiblioteket samler de vanligste klausulene ett sted, med:

- **Klausultekst** du kan kopiere og tilpasse
- **Forklaring på vanlig norsk** — hva betyr dette egentlig?
- **Fallgruver og variasjoner** basert på norsk rettspraksis
- **Lovdata-lenker** til hver paragraf som er grunnlaget

Og fordi alt er maskinlesbart: du kan spørre en AI om klausulen, og få et svar som er forankret i norsk rett i stedet for generiske gjetninger.

## Innhold

### Arbeidsrett

- [Konkurranseklausul](clauses/employment/non-compete.md) — forbud mot å jobbe hos konkurrent etter oppsigelse (AML kap. 14A)
- [Kundeklausul](clauses/employment/customer-restriction.md) — forbud mot kontakt med arbeidsgivers kunder etter oppsigelse (AML § 14A-4)

### Fortrolighet

- [Gjensidig fortrolighetsavtale](clauses/confidentiality/mutual-nda.md) — mutual NDA for due diligence, partnerskap, M&A
- [Ensidig fortrolighetsavtale](clauses/confidentiality/unilateral-nda.md) — one-way NDA for investorpresentasjoner, konsulenter, styremedlemmer

### Kommersielle avtaler

- [Ansvarsbegrensning](clauses/commercial/limitation-of-liability.md) — tak på erstatningsansvar i B2B-avtaler
- [Force majeure-klausul](clauses/commercial/force-majeure.md) — fritak ved ekstraordinære hendelser

### Selskapsrett, personvern, generelt

*Kommer.* Se [CONTRIBUTING.md](CONTRIBUTING.md) hvis du vil bidra.

## Bruk med AI (MCP)

Avtalebiblioteket har en MCP-server (Model Context Protocol) som gir AI-assistenter direkte tilgang til klausulene. I stedet for at modellen gjetter basert på treningsdata, henter den reell, oppdatert klausultekst fra dette repoet.

### MCP-verktøy

| Verktøy | Beskrivelse |
|---------|-------------|
| `search_clauses` | Søk i klausuler med naturlig språk |
| `get_clause` | Hent fullstendig innhold for en klausul |
| `list_clauses` | List alle klausuler, eventuelt filtrert etter kategori |

### Oppsett — Claude Code

Klon repoet og registrer MCP-serveren lokalt:

```bash
git clone https://github.com/williamskaug/avtalebiblioteket.git
cd avtalebiblioteket
npm install
npm run build

claude mcp add avtalebiblioteket -- node "$(pwd)/dist/mcp/index.js"
```

### Oppsett — Claude Desktop

Legg til i `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "avtalebiblioteket": {
      "command": "node",
      "args": ["/absolutt/sti/til/avtalebiblioteket/dist/mcp/index.js"]
    }
  }
}
```

### Oppsett — Cursor / andre MCP-klienter

Alle klienter som støtter MCP over stdio fungerer. Kommandoen er den samme: `node /sti/til/avtalebiblioteket/dist/mcp/index.js`. Se klientens egen dokumentasjon for hvor config-filen ligger.

### Eksempler på spørsmål

Når MCP-serveren er koblet til, kan du spørre AI-en ting som:

- *«Jeg skal signere en konsulentavtale. Hvilke klausuler bør jeg se etter?»*
- *«Forklar konkurranseklausulen i arbeidskontrakten min, og si ifra hvis noe er rart.»*
- *«Hva sier norsk rett om ansvarsbegrensning hvis leverandøren er grovt uaktsom?»*
- *«Kan arbeidsgiver håndheve et konkurranseforbud etter nedbemanning?»*
- *«Forskjell på mutual og unilateral NDA — hvilken passer for en investorpitch?»*

## Kilder

`sources/` inneholder offisielle norske malerdokumenter fra Altinn, Brønnøysundregistrene, Arbeidstilsynet, Datatilsynet og Lotteri- og stiftelsestilsynet, samt lenker til Startuplabs åpne maler (SLIP, shareholder agreement, term sheet). Se [sources/INDEX.md](sources/INDEX.md) for full oversikt med kildeadresser og nedlastingsdato.

Disse malene brukes som referansemateriale når klausuler skrives, og gir et kontrollert grunnlag for sammenligning med det du selv måtte forhandle frem.

## Utvikling

```bash
npm install                 # Installer avhengigheter
npm run validate            # Valider alle klausuler (frontmatter, struktur, lovdata-lenker)
npm run build:index         # Generer index.json
npm run dev:mcp             # Kjør MCP-server i utviklingsmodus
npm run build               # Bygg både index og MCP-server til dist/
```

### Legge til en ny klausul

1. Kopier [`clauses/employment/non-compete.md`](clauses/employment/non-compete.md) som utgangspunkt.
2. Oppdater frontmatter (`id`, `title`, `category`, `tags`, `legal_basis`).
3. Skriv innholdet under de påkrevde seksjonene: *Klausultekst, Hva betyr dette?, Når brukes den?, Vanlige variasjoner, Pass på, Juridisk grunnlag*.
4. Kjør `npm run validate` og `npm run build:index`.
5. Åpne PR. Se [CONTRIBUTING.md](CONTRIBUTING.md) for detaljer.

## Status og veikart

Dette er et tidlig-fase prosjekt. Per nå: **6 klausuler**, alle skrevet originalt, **ingen juridisk gjennomgang** (klausuler er merket med `reviewed_by: null`). Veikart:

- [ ] Utvide til ~30 klausuler på tvers av alle kategorier
- [ ] Juridisk gjennomgang av eksisterende klausuler
- [ ] `reviewed_by`-felt med attribusjon til jurist
- [ ] Publisering til npm (`npx avtalebiblioteket-mcp`)
- [ ] Engelsk oversettelse

Stjerne repoet eller følg issues hvis du vil holde deg oppdatert.

## Bidra

Vi trenger hjelp med:

- **Nye klausuler** — særlig innen selskapsrett, personvern og kommersielle avtaler
- **Bedre forklaringer** — hvis noe er uklart, åpne et issue
- **Juridisk gjennomgang** — jurister som vil låne navnet sitt til `reviewed_by` er hjertelig velkommen
- **Oversettelser** — engelsk og nynorsk

Se [CONTRIBUTING.md](CONTRIBUTING.md).

## Lisens

- **Innhold** (klausuler, forklaringer, dokumentasjon): [CC BY-SA 4.0](LICENSE-CONTENT) — du kan bruke, endre og dele, men må kreditere og dele videre under samme lisens.
- **Kode** (MCP-server, scripts): [MIT](LICENSE-CODE).

Opphavsrett © 2026 William Skaug og bidragsytere.
