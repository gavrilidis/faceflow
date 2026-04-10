# Copilot Instructions

## Role & Mindset

- Act as a **Senior Software Engineer** focused on performance, security, and readability.
- Write production-grade code. No prototypes, no throwaway snippets.
- **Zero tolerance for overengineering.** Do the simplest correct thing. No abstractions without proven need.
- Prefer deleting code over adding code. Every line must justify its existence.

## Next.js (App Router)

- **Pages Router is strictly forbidden.** All routing must use the App Router (`app/` directory).
- Use **React Server Components by default**. Every component is a Server Component unless it explicitly needs client-side interactivity.
- Add `'use client'` **only** when the component uses hooks (`useState`, `useEffect`, `useRef`, etc.), browser APIs, or event handlers.
- Never mark a parent layout or page as `'use client'` just because a child needs it — extract the interactive part into a separate Client Component instead.
- Use `loading.tsx`, `error.tsx`, and `not-found.tsx` conventions for route-level UI states.
- Data fetching happens in Server Components or Server Actions. Never use `useEffect` for data fetching.

## TypeScript

- **Strict mode is mandatory** (`"strict": true` in `tsconfig.json`).
- **`any` is forbidden.** Use `unknown` and narrow the type explicitly when the type is truly uncertain.
- **`@ts-ignore` and `@ts-expect-error` are forbidden.** Fix the type error instead.
- Use the **generated Supabase `Database` type** (`database.types.ts` or equivalent) for all database entities. Never manually re-declare table shapes.
- Prefer `interface` for object shapes and `type` for unions/intersections.
- All function parameters and return types must be explicitly typed. No implicit `any`.

## Supabase

- **Direct database queries from Client Components are forbidden.** All database access must go through Server Actions (`'use server'`) or API Routes (`app/api/`).
- Always create the Supabase client with the appropriate helper:
  - `createServerComponentClient` in Server Components.
  - `createRouteHandlerClient` in API Routes.
  - `createServerActionClient` in Server Actions.
- **Row Level Security (RLS) is the single source of truth for authorization.** Never duplicate RLS logic in application code. If a policy exists in the database, trust it — do not add redundant `if` checks in the server layer.
- Always call `supabase.auth.getUser()` (not `getSession()`) to verify the authenticated user on the server side before performing mutations.
- Handle Supabase errors explicitly: check `{ data, error }` on every query. Never silently ignore `error`.

## Telegram Bot

- **Isolate user state.** Each user session must be independent. Never use module-level mutable variables to store per-user data. Use a database or a scoped store keyed by `chat_id`.
- **Handle network errors gracefully.** Every outgoing Telegram API call must have error handling with retry logic or a meaningful fallback (graceful degradation).
- Respect **Telegram rate limits** (≤30 messages/second to different chats, ≤1 message/second to the same chat). Implement queuing or throttling when sending bulk messages.
- Validate all incoming webhook payloads. Never trust `update.message` to exist — always use optional chaining and early returns.
- Keep bot command handlers small. Extract business logic into separate utility functions.

## Code Style & Architecture

- **Functional programming.** Avoid classes. Use plain functions, closures, and modules.
- **Early return pattern.** Handle edge cases and errors at the top of the function, then proceed with the happy path. No deep nesting.
- **Small, single-purpose functions.** If a function does more than one thing, split it. Target ≤20 lines per function.
- Name variables and functions descriptively. No abbreviations except universally understood ones (`id`, `url`, `ctx`).
- Use `const` by default. Use `let` only when reassignment is necessary. Never use `var`.
- Collocate related code. Keep utilities close to where they are used. Avoid a monolithic `utils/` folder — prefer domain-specific modules (e.g., `lib/telegram/`, `lib/supabase/`).
- Prefer named exports over default exports.
- Handle errors at the boundary (API route handler, Server Action entry point). Inner utility functions should throw; outer handlers should catch and return structured error responses.
