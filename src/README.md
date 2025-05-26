# Credit Tracking Dashboard

A simple React + Vite application that allows a Customer Success team to view and manage customer accounts (plans, credits, top‑ups). Built with modular, testable, and scalable patterns using React Context, custom hooks, and atomic/module-based design.

---

## Getting Started

1. **Install dependencies**

   ```bash
   node 20.12.1
   npm install
   ```
2. **Run locally**

   ```bash
   npm run dev
   ```
3. **Run tests**

   ```bash
   npm test
   ```
---

## Project Structure

```
src/
  modules/                     # Feature-based modules
    credit-tracking/           # Credit Tracking feature
      contexts/                # React Context for global state
      hooks/                   # Custom hooks (useToast, useCustomerEditor)
      organisms/               # Composite components (CustomerTable, CustomerDetail)
      services/                # API clients and mocks
      types.ts                 # Domain types (Customer, Plan)
  main.tsx                     # App entry point
  App.tsx                      # Root component wiring modules
```

* **Module concept**: grouping files by feature (e.g., `credit-tracking`) makes it easy to add new modules (billing, analytics) without affecting others.
* Promotes **easy integration** into larger systems: drop in new modules in `src/modules/` and update routes or contexts as needed.

---

## Key Concepts

### React Context for Data

* Centralizes customer list, loading/error state, selection, and refresh logic.
* Avoids prop-drilling across multiple components.
* Easy to replace with real API or advanced data layer later.

### `useCustomerEditor` Hook

* Manages form state with `useReducer` for clear action semantics and reset logic.
* Encapsulates draft vs. original state, dirty-checking, batched API calls, error handling, and refresh.
* Highly **testable** as a pure function of state and actions.

### `useToast` Hook

* Lightweight global notification mechanism.
* Provides `showToast` method and `Toast` JSX for easy integration in any component.

---

## Design & Thought Process

* **Modularity**: Each feature lives in its own folder, so adding or removing a feature is contained.
* **Reusability**: Hooks and services are stateless and can be reused across modules.
* **Maintainability**: Clear separation of concerns — UI in `organisms/`, state logic in `hooks/`, data access in `services/`.
* **Scalability**: New modules (e.g., analytics, billing) follow the same pattern; contexts can be combined or nested.
* **Testability**: Unit tests co-located with implementation; pure functions (reducers, hooks) are easy to mock and verify.

---

## Testing

* Jest + React Testing Library for components and hooks.
* Tests live alongside source files (e.g., `useCustomerEditor.test.tsx`).
* Comprehensive coverage for loading, errors, user interactions, and reducer logic.

---

## Next Steps

* Integrate with real backend APIs.
* Add input validation and accessibility enhancements.
* Expand test coverage for edge cases and concurrency scenarios.

---

Built with maintainability and growth in mind, ready for production integration and feature expansion.

## Future Improvements

* **Unified Update API**: Replace individual field APIs (`setPlan`, `setPerUserLimit`, `topUp`) with a single `updateCustomer` endpoint. This simplifies the UI logic, reduces network chatter, and makes save operations atomic and more seamless.
* **Form Library Integration**: Adopt a form library (e.g., React Hook Form or Formik) to handle validation, dirty-tracking, and draft state out-of-the-box. This would eliminate the need for a custom `useReducer` and streamline form management.
