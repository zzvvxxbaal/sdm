---
name: sdm environment & dependencies
description: How the sdm Next app is wired into the repo and what's needed before typecheck/lint pass.
---

# sdm is standalone, not a workspace package
The repo is a pnpm monorepo (packages: artifacts/*, lib/*) but `sdm/` is a standalone
Next 16 app with its own `node_modules` and `package-lock.json` — it is NOT in
`pnpm-workspace.yaml`. Run `npm install` inside `sdm/`, not pnpm at the root.

# First typecheck required a real install
Deps were never fully installed, so `tsc`/`eslint` reported phantom "Cannot find module
'next'" for ALL files. `npm install` may need several runs (each ~2 min cap; it caches
and progresses each time). The `next` package can be left half-extracted after an
ENOTEMPTY rename — if `node_modules/next/index.d.ts` is missing, `rm -rf node_modules/next`
and reinstall `next` specifically.

# Not runnable yet
`NEXT_PUBLIC_FIREBASE_*` env vars are not set, and sdm has no Replit workflow/artifact
registered, so the app cannot run in-environment until those are configured.
