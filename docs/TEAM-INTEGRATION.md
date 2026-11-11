# Team Integration Plan

The four member areas are feature ownership boundaries, not separate applications. The user should experience one Student Hub with one navigation system, one state model, and one responsive design language.

## Shared integration contract

- `src/App.tsx` owns view composition and navigation registration.
- `src/context/AppContext.tsx` owns cross-feature state and actions.
- `src/types/index.ts` owns shared domain types.
- `src/data/mockData.ts` owns fallback/demo data.
- `src/components/layout/` owns the shared navbar, sidebar, and mobile navigation.
- `server/` owns persistence and API boundaries.

Feature members should expose reusable views and call shared context actions. They should not create parallel navigation, duplicate user models, or directly mutate another member's state.

## Integration workflow

1. Build the feature inside the assigned member folder.
2. Add or update shared types before passing new data between features.
3. Add the context action and API contract for persisted changes.
4. Register the view in `src/App.tsx` only after the feature works independently.
5. Check desktop and mobile layouts, loading states, empty states, and API failure states.
6. Run `npx tsc --noEmit` and `npm run build` before opening a pull request.

## Product experience priorities

- Dashboard cards should link users into the relevant feature view.
- Global search should return consistent results across all domains.
- Toasts, errors, modals, buttons, forms, and loading states should use shared patterns.
- Every feature should preserve responsive behavior from 320px mobile width through desktop.
- The backend should become the single source of truth as each local-only action is migrated.

## Recommended pull request labels

- `work-1-academics`
- `work-2-campus-operations`
- `work-3-community-career`
- `work-4-student-services`
- `shared-integration`
- `security-and-data`

