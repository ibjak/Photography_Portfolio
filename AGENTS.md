# Ivan Badanjak Photography Portfolio — Codex Instructions

## Purpose and creative direction

This is a documentary photography portfolio built with Next.js. The photographs and their sequencing are the primary work; the interface should remain quiet, editorial, minimal, and image-led.

Preserve the existing visual identity unless the user explicitly approves a redesign. Do not introduce generic product-site patterns such as cards, gradients, badges, decorative dashboards, or attention-seeking animation.

## Non-negotiable photographic constraints

- Do not reorder, add, remove, rename, replace, retouch, or recompress photographs unless the task explicitly requires it.
- Preserve each gallery's current sequence as defined in `src/lib/portfolio.ts`.
- Preserve original image aspect ratios. Default to `object-contain` or intrinsic sizing.
- Do not crop documentary photographs. `object-cover` is allowed only where the existing approved composition already uses it, such as Jaima's exhibition-wall thumbnails; do not extend that treatment without approval.
- Do not change captions, project statements, names, dates, locations, or alt text in ways that alter their editorial meaning without user approval.
- Treat `public/Photo Gallery/` as source material. Avoid destructive or bulk image operations.

## Existing design language

- Keep the white, restrained presentation, serif display name, sans-serif supporting type, warm neutral text, subtle rules, and small terracotta accent.
- Maintain generous whitespace and give images visual priority.
- Prefer simple, discoverable interactions and restrained transitions.
- Respect `prefers-reduced-motion` when adding or changing motion.
- Do not make broad visual redesigns without presenting the proposal to the user first.

## Repository map

- `src/components/PortfolioSite.tsx`: shared navigation, homepage slideshow, gallery grid/slideshow, and Jaima exhibition-wall renderer.
- `src/lib/portfolio.ts`: canonical gallery metadata, photograph order, project text, routes, home-slide selection, and Jaima wall coordinates.
- `src/app/globals.css`: global design tokens, transitions, and exhibition-wall styling.
- `src/app/[section]/[slug]/page.tsx`: gallery routes and route metadata.
- `src/app/layout.tsx`: global metadata and root layout.
- `public/Photo Gallery/`: original portfolio image assets.

## Collaboration boundaries

- Keep each agent's task narrow and use a separate Git worktree for parallel implementation.
- Before coding, state the intended files and confirm that no other active agent owns the same area.
- Avoid overlapping edits to `src/components/PortfolioSite.tsx`, `src/lib/portfolio.ts`, and `src/app/globals.css`. If overlap is unavoidable, stop after analysis and provide a patch plan for the lead/reviewer.
- Do not merge branches or make broad cross-cutting changes without showing the user the diff and visual impact first.
- Agents should not deploy, publish, alter DNS, or change production settings unless explicitly asked.
- Keep commits focused and describe any effect on sequencing, aspect ratio, metadata, accessibility, or image delivery.

## Workstream guardrails

### Responsive and mobile

- Test at 320px, 375px, 768px, and 1440px widths.
- Preserve image proportions and ensure navigation, controls, project text, grids, and the Jaima wall remain usable by touch and keyboard.
- Do not solve mobile issues by cropping photographs or changing their sequence.

### Performance and image delivery

- Measure before optimizing and report the baseline and result.
- Prefer framework-native image delivery when it preserves presentation and sequencing.
- Any generated derivatives must remain reproducible and must not replace source photographs.
- Check layout shift, responsive `sizes`, lazy/eager loading choices, decoding, cache behavior, and first-image priority.

### SEO and accessibility

- Preserve factual editorial copy. Flag uncertain facts instead of rewriting them silently.
- Verify page-specific titles, descriptions, canonical URLs, Open Graph assets, robots/sitemap behavior, headings, landmarks, focus states, keyboard controls, reduced motion, link names, and meaningful alt text.
- Do not fabricate descriptions for photographs; create an audit list when human editorial input is needed.

### Jaima

- Treat Jaima as a project-specific exhibition layout, not a template for other galleries.
- Preserve `jaimaImages` order and all `wallPlacement` coordinates unless the user approves a revised hanging plan.
- Keep wall thumbnails and full-image viewing distinct: the wall may retain its existing framed crop, while the selected photograph must show uncropped.
- Present proposed layout changes with screenshots at mobile and desktop sizes before requesting merge.

### QA and review

- Review other workstreams; do not redesign while reviewing.
- Check for regressions in every gallery, not only the changed route.
- Confirm routes, missing assets, browser console errors, keyboard use, responsive behavior, sequencing, aspect ratios, and production build/lint status.
- Report findings by severity and do not merge implementation branches automatically.

## Verification

For code changes, run the smallest relevant checks and finish with:

```bash
npm run lint
npm run build
```

When layout or interaction changes, also inspect the homepage, About page, one standard gallery, one strict-grid gallery, and Jaima at the target viewport sizes. Include screenshots or a concise visual QA report in the handoff.

## Handoff format

Every agent should report:

1. What was inspected and changed.
2. Exact files changed.
3. Checks run and their results.
4. Screenshots or measurements relevant to the task.
5. Risks, unresolved questions, and any user approval still needed.
6. A clear recommendation: ready for review, needs revision, or analysis only.
