# Bidra til Avtalebiblioteket

Takk for at du vurderer å bidra! Vi trenger spesielt:

- **Nye klausuler** med juridisk grunnlag
- **Forbedringer** av eksisterende forklaringer
- **Juridisk gjennomgang** av klausuler (merkes i frontmatter)
- **Feilretting** — feil i lovhenvisninger, utdaterte klausuler

## Klausulformat

Hver klausul er en markdown-fil med YAML frontmatter. Se [clauses/employment/non-compete.md](clauses/employment/non-compete.md) som referanseimplementasjon.

### Påkrevde felter i frontmatter

```yaml
---
id: category/slug              # Unik ID, matcher filstien
title: Norsk tittel            # Klausulens navn
category: employment           # En av: employment, confidentiality, commercial, corporate, data-privacy, general
tags: [relevante, søkeord]     # For søk
legal_basis:                   # Minst én lovhenvisning
  - law: Lovnavn
    section: "§ X"
    url: https://lovdata.no/...
source: original | altinn | ssa # Hvor klausulen kommer fra
language: nb                   # nb (bokmål)
reviewed_by: null              # null inntil en jurist har gjennomgått
last_updated: YYYY-MM-DD
---
```

### Påkrevde innholdsseksjoner

1. **Klausultekst** — selve klausulen, som blockquote (`>`)
2. **Hva betyr dette?** — én paragraf, vanlig norsk
3. **Når brukes den?** — situasjoner og kontraktstyper
4. **Vanlige variasjoner** — hvordan klausulen typisk tilpasses
5. **Pass på** — fallgruver, håndhevingsrisiko, ugyldighet
6. **Juridisk grunnlag** — relevante lover med lenker til lovdata.no

### Kvalitetskrav

- Alle lovhenvisninger må lenke til lovdata.no
- Forklaringer skal være på vanlig norsk — unngå unødvendig juridisk fagspråk
- Klausuler skal **ikke** inneholde konkret juridisk rådgivning («du bør gjøre X»), men heller forklare hva som er vanlig praksis og hva loven sier
- Nye klausuler legges inn med `reviewed_by: null`

## Juridisk gjennomgang

Hvis du er jurist og ønsker å gjennomgå en klausul:

1. Sjekk at lovhenvisningene er korrekte
2. Sjekk at forklaringen er faglig forsvarlig
3. Lag en PR som oppdaterer `reviewed_by` med ditt navn

## PR-sjekkliste

- [ ] Frontmatter følger skjemaet over
- [ ] Juridisk grunnlag er oppgitt med lovdata.no-lenker
- [ ] Forklaringer er på vanlig norsk
- [ ] Ingen konkret juridisk rådgivning
- [ ] `validate`-scriptet passerer (`npm run validate`)
