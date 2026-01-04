# 2TUBE

**This is youtube clone developed with Next.js(App Router) and TypeScript.
core features include a feed page, search, user channels, a subscription system, a studio for uploading/managing videos, and interactive elements (comments, reactions, views)**

### **Web architecture**

	 - **Tool:** Next.js (App Router), React, TypeScript, Tailwind CSS, Bun-compatible tooling (project includes `bun`), Drizzle ORM for database schema, tRPC for API layer, UploadThing for uploads, Redis for caching/rate-limiting, Mux for video handling .
	 - **Third party:** Next.js, Tailwind CSS, Drizzle ORM, tRPC, UploadThing, Redis, Mux, UI primitives (shadcn-style components), sonner/toaster for notifications. Project uses common packages for auth, file uploads and storage integrations.

### **How to run**

	 - install dependencies ( `npm`, `pnpm`, `yarn` or `bun`):

		 ```bash
		 npm install
		 # or
		 pnpm install
		 # or
		 yarn install
		 # or (if using bun)
		 bun install
		 ```

	 - set environment (exam):

		 - `DATABASE_URL` — connect to database (Postgres, MySQL followed by Drizzle)
		 - `NEXT_PUBLIC_*` / `SECRET_*` — external key like e.g. UploadThing, Mux, Redis URL

	 - run:

		 ```bash
		 npm run dev
		 # or
		 pnpm dev
		 # or
		 yarn dev
		 # or
		 bun dev
		 ```

---

### Main files:

- `src/app/` — structure and routing
- `src/components/` — components UI
- `src/lib/` — utilities e.g. `mux.ts`, `redis.ts`, `uploadthing.ts`
- `src/db/` — setting Drizzle and schema
- `src/trpc/` — client/server and routers
