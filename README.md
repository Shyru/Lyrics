# Lyrics

Kleine Node.js-/Express-Anwendung zum Anzeigen von Liedtexten fuer Gottesdienste mit optionalem Presenter-Modus.

Die Anwendung laeuft aktuell auf Vercel und ist unter [songs.feg-dillenburg.de](https://songs.feg-dillenburg.de) veroeffentlicht.

## Zweck

- Zeigt Liedtexte mobilfreundlich in einer einzigen Seite an
- Erstellt automatisch ein Inhaltsverzeichnis aus den Liedsektionen
- Unterstuetzt Schriftgroesse, Dark-Mode und Auto-Scroll
- Hat einen Presenter-Modus, der Zuschauer zu den aktuell gesungenen Abschnitten scrollen kann

## Projektstruktur

- `public/index.html`
  Enthält praktisch die gesamte App-Oberflaeche:
  - CSS
  - Songtexte
  - Client-seitige Socket.IO-Logik
  - Presenter-Modus
  - Auto-Scroll
  - Modal / Dark-Mode / Inhaltsverzeichnis

- `server.js`
  Kleiner Express-/Socket.IO-Server:
  - liefert `public/index.html` aus
  - verteilt `scrollTo`-Events
  - merkt sich die letzte aktive Scroll-Position
  - zaehlt aktive Zuschauer mit aktiviertem Auto-Scroll

- `vercel.json`
  Vercel-Konfiguration, damit `server.js` als Node-Entry benutzt wird.

- `lyrics.html`
  Generierte statische Fallback-Datei.

- `lyrics.template.html`
  Vorlage fuer die statische Fallback-Datei `lyrics.html`.

- `scripts/build-static.js`
  Build-Skript, das den Songbereich aus `public/index.html` in `lyrics.template.html` einsetzt und daraus `lyrics.html` erzeugt.

## Lokal starten

```bash
npm install
npm start
```

Danach ist die App unter `http://localhost:3000` erreichbar.

## Statischen Fallback bauen

```bash
npm run build
```

Dabei gilt:

- `public/index.html` bleibt die Quelle der Wahrheit
- der Liedbereich wird zwischen `<!-- SONGS:START -->` und `<!-- SONGS:END -->` gelesen
- Titel, sichtbare Ueberschrift und Songblock werden in `lyrics.template.html` eingesetzt
- daraus wird `lyrics.html` erzeugt

Wenn Liedtexte geaendert werden und der statische Fallback aktuell bleiben soll, danach immer auch `npm run build` ausfuehren.

## Presenter-Modus

Der Presenter-Modus wird ueber den URL-Parameter `?presenter` aktiviert.

Beispiele:

- Zuschauer: `http://localhost:3000`
- Presenter: `http://localhost:3000/?presenter`

Im Presenter-Modus:

- erscheint oben eine gelbe Leiste
- ein Klick auf einen Absatz sendet die Scroll-Position an alle Zuschauer
- der aktive Absatz wird hervorgehoben

## Songs pflegen

Die aktuellen Liedtexte werden direkt in `public/index.html` gepflegt.

Wichtige Struktur:

- pro Lied ein `<section>`
- Liedtitel als `<h2>`
- jede Strophe / jeder Block als eigenes `<p>`
- Zeilen innerhalb eines Blocks mit `<br/>`

Das Inhaltsverzeichnis wird beim Laden automatisch aus allen `section > h2` erzeugt.

## Aktuelles Verhalten

- Das Info-Modal wird pro Browser nur einmal angezeigt und ueber `localStorage` gemerkt
- Der Dark-Mode folgt automatisch `prefers-color-scheme`
- Ein manueller Klick auf den Dark-Mode-Button ueberschreibt die Systemvorgabe pro Browser dauerhaft ueber `localStorage`
- Im Presenter-Modus wird die aktive Zeile mit einer Outline markiert, ohne dass der Text durch Border/Padding springt
- Im Dark-Mode ist die Presenter-Markierung gelb statt rot

## Deployment

Deployment erfolgt aktuell ueber Vercel:

- GitHub-Repo: `Shyru/Lyrics`
- Push auf `main` triggert automatisches Deployment
- Vercel-Projekt war zuletzt mit diesem Repo direkt verbunden
- Custom Domain: `songs.feg-dillenburg.de`

Hinweise:

- Die App nutzt Socket.IO auf `polling`, nicht auf echtem WebSocket
- Das ist historisch aus dem Vercel-Setup entstanden
- Die statische Fallback-Seite auf `www.feg-dillenburg.de/songs/` kann ueber `lyrics.html` aktuell gehalten werden, ist aber nicht die aktuelle Hauptinstanz

## Historie / Notizen

- Tag `Sportwoche2025` markiert den Stand vor den Karfreitag-Aenderungen
- `.aider.chat.history.md` enthaelt den damaligen Aider-Verlauf zur Entstehung des Projekts

## Wartung

Wenn relevante Aenderungen an Deployment, Bedienung, Projektstruktur oder Presenter-Logik gemacht werden, sollte diese README mit aktualisiert werden.
