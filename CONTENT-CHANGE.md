## A read-only preview must explain itself AT the controls

Where a preview lets someone browse an admin area without signing in, every write control is disabled. That is correct — it is what lets a build be checked at all. But to the person looking at it, it is a page where nothing works.

Cornwall reported pencil icons that "no longer respond when clicked" and said they had worked before that build. They had not: the controls are disabled for anyone not signed in, and had been for over a week. A banner at the top said exactly that, and was missed — because it sat above a button they were busy clicking. A fault was raised against us and a build written off for a page behaving as designed.

So whenever you build or touch an admin screen that can be browsed read-only:

- **Put the reason on the control itself.** A disabled button needs a `title` (and `aria-label` where it has no text) saying why — "Open this preview in a new tab and sign in to edit". The explanation belongs where the hand is, not at the top of the page.
- **Make disabled look disabled.** Reduced opacity and `cursor-not-allowed`, so it reads as switched off before it is clicked rather than after.
- **Say where editing actually happens, truthfully for THIS site.** Do not promise a sign-in that cannot happen. Many of these setups send `/admin/login` straight to `/admin` in preview, so no session can ever be created there and the admin is read-only for good — in that case the control should say so and point at the live site. Check what your own auth does before writing the words.
- **The open-in-new-tab control is for looking, not for signing in.** It opens the preview at its own address, outside the builder frame, which is the right way to inspect layout and behaviour properly. Say that is what it is for, so nobody hunts for a login that is not there.
- **Keep the banner too**, saying the same thing the controls say. Two places, one message, no contradiction.
- **Never silently swallow the click.** A control that looks live and does nothing is the worst of the three states.

This costs a few attributes and saves a support conversation, a wasted build, and an apology for a fault that was not ours.

## The site's database — read DATABASE.md first

If this site has a database of its own, `DATABASE.md` at the repo root maps it: every readable table, how many rows it holds, what joins to what, and the real values behind status-style columns. Read it before writing any query or migration. Guessing at a schema is how a gallery column gets handled as text and a filter gets written against a column that does not exist. If the file is absent, this site has no database of its own.

**It is written at build time, so it is only as current as the last build.** It used to say "trust it over anything you infer from the code", and that was wrong in the one case that matters: a migration is applied when the change is PUBLISHED and this file is written when it is BUILT, so between the two the file is behind the database — as is every migration applied by hand before that was automatic — and the longer a site is under a no-build hold, the further behind it gets. NTUiTiV was told twice that two columns did not exist on the strength of this file while they were live, and the only thing that settled it was querying the database.

So: read it for the shape of things — what joins to what, what a status column really holds — and do NOT treat it as proof that a column is absent. If you are about to tell somebody a column or table is missing, or write a migration that depends on one not being there, check the live database first. `list_site_data` regenerates its map from the live schema on every call and is authoritative; this file is not.

Do not edit it: it is overwritten on the next build.

## Previews must not write to live data

A preview deployment that talks to the same database as production is not a preview of anything — it is the live site with a different address. That is why admin screens end up read-only on previews, and why a customer can be shown a change they can never try. Cornwall were asked to test a media picker on a preview where nothing could be clicked.

**The fix is a `preview` schema in the SAME database — not a second database.** It costs nothing extra, it is one `CREATE SCHEMA`, and a preview deployment points at it.

Whenever you CREATE a database for a site, create both from the start:

- `public` holds the real data.
- `preview` is a copy of it: same tables, same constraints, same foreign keys rebuilt to point WITHIN preview, same functions with their bodies and `search_path` rewritten to preview, same RLS enabled AND the same policies copied. `LIKE ... INCLUDING ALL` carries defaults, checks and indexes but NOT foreign keys, NOT row-level security and NOT policies — copy those yourself or preview will either deny everything or allow too much.
- Expose it: `alter role authenticator set pgrst.db_schemas = 'public, graphql_public, preview'`, then `notify pgrst, 'reload config'` and `notify pgrst, 'reload schema'`.
- The deployment chooses the schema by environment — preview builds use `preview`, production uses `public`. Pass it through the Supabase client's schema option rather than branching at every call site.

Whenever you CHANGE an existing database, change both. A new table, a new column, a changed function: apply it to `preview` in the same build. `DATABASE.md` tells you whether a preview copy exists and whether it has drifted. A preview schema that no longer matches live is worse than not having one — it tests the wrong thing and nobody finds out until a customer does.

**And say so on the screen.** Whenever the site is running against the preview schema, the admin must carry a persistent, visible notice — not a tooltip — along the lines of "Preview — you are working on a copy. Changes here do NOT affect your live site." Somebody who cannot tell which of the two they are editing will eventually make a real change believing it was a rehearsal, or report a real change as lost.

## Changing the site's own data

Some requests cannot be satisfied by editing code, because the thing the customer is describing lives in their database — a course, a price, a gallery, a listing. You MAY change that data when the request plainly calls for it. What you must NOT do is change it silently.

If you write to the site's database, you MUST also write `.bonza-data-change.json` in the repository root before you finish:

```json
{
  "table": "courses",
  "rows_changed": 13,
  "summary": "Trimmed the gallery on 13 courses to their first image, removing a stray second photograph from each",
  "before": [{ "id": "…", "gallery": [ … ] }]
}
```

- `summary` is read by the customer. Plain English, no table or column names.
- `before` is every row you changed, as it was BEFORE you changed it, with its id. This is the only way the change can be undone. Include it even when you are confident.
- Do NOT commit this file — Bonza reads it and removes it, exactly like the database file.
- One file per build. If you change several tables, list the main one in `table` and describe the rest in `summary`.

Write no data at all if the request does not clearly ask for it. Say so in your summary instead, and let a person decide.

## Proposed Changes

- Add an orange **0333 042 4424** button on the desktop header, sitting right next to the "Enquire Now" button (hidden on mobile, as the phone button already exists in the mobile menu)
- Clicking it will dial the number

**Estimated cost: £0.30 – £0.50**

## Signed-in checks

Signing in has NOT been approved for this build. Write only checks a visitor could make; a signed-in check will be reported as not run.
