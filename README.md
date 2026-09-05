# Ivan Badanjak Photography

A documentary photography portfolio built with Next.js, React, TypeScript, and Tailwind CSS.

## Local development

Use the Node.js version configured for the deployment environment, then install the locked dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Project structure

- `src/app/` contains routes, metadata, global styles, the sitemap, and robots rules.
- `src/components/` contains the portfolio shell, navigation, homepage slideshow, and gallery layouts.
- `src/lib/portfolio.ts` is the canonical source for project copy, routes, image order, and Jaima wall placement.
- `public/Photo Gallery/` contains the original portfolio photographs.

Read `AGENTS.md` before making changes. Photograph order, aspect ratios, editorial meaning, and Jaima wall coordinates must be preserved unless a change is explicitly approved.
