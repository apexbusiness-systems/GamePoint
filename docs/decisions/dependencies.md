# Dependency Decisions

## WP-0

- `vite`, `@vitejs/plugin-react`, `react`, `react-dom`, and TypeScript typings are used to scaffold static-first React apps for `apps/web` and `apps/overlay`.
- `typescript` is used for strict monorepo type checking.

No paid services or runtime vendors were added. Live provider/model pricing is `UNCERTAIN` and must be verified before production release.
