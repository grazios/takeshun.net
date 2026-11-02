# TAKESHUN DEV NOTES

Personal development notes at https://takeshun.net/.

## Architecture

Static HTML, CSS, and JavaScript. GitHub Pages publishes the repository root from main. No build step, database, analytics, third-party assets, or paid APIs.

- index.html: article index, category filters, title/summary/tag search.
- notes/: full article pages with a table of contents and related links.
- script.js: URL-backed filters, return-to-list context, local accent preferences.
- feed.xml: RSS summaries.
- sitemap.xml and robots.txt: discovery metadata.
- CNAME: custom domain.

Japanese HTML/XML text uses numeric entities to keep source files ASCII. Files render as Japanese in browsers. JavaScript is a progressive enhancement; articles and links work without it.

## Add a note

1. Copy a page in notes/ and update its title, canonical URL, summary, sections, table of contents, date, and related links.
2. Add its article card to index.html, including data-category and searchable tags.
3. Update category counts and the total count in index.html.
4. Add the note to feed.xml and sitemap.xml.
5. Preview desktop/mobile, check links, then commit and push main.

Do not publish local DNS backups, credentials, or operational logs.

