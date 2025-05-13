# next-route-tree

A CLI utility to generate a route tree from a Next.js 14 `app/` directory.  
Supports route groups, dynamic routes, slots, catch-all exclusion, and API exclusion.

## Installation (local only)

From the project directory:

```bash
npm install
npm link
```

`npm link` - This will register the `next-route-tree` command globally.

## Usage
```
next-route-tree [path] [flags]
```

For example:

* Routes tree logs in terminal
```bash
next-route-tree ./src/app --pdf
```

* Routes tree logs in terminal and includes `/api`
```bash
next-route-tree ./src/app --include-api
```

* Routes tree saved in PDF

```bash
next-route-tree ./src/app --pdf
```

Arguments:

`path` - the relative path to the app/ directory (default: ./app)

Flags:

`--include-api` - include /api routes in the tree

`--pdf` - save output to route-tree.pdf instead of printing to console

## Features

* Supports route groups like (settings) as (group)
* Supports dynamic routes like [id] rendered as :id
* Supports optional segments like [[locale]] rendered as :locale
* Skips catch-all routes like [...slug] by default
* Skips API routes unless --include-api is passed
* Supports slots like @slot and marks them as (slot)
* PDF output renders clean readable structure