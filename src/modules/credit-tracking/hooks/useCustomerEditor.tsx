import { useReducer, useEffect } from "react";
import { api } from "../services/mockApi";
import { Customer, Plan } from "../types/types";
import { useCustomers } from "../contexts/CustomerContext";
import { emptyCustomer } from "../services/mockData";

export type Draft = {
  plan: Customer["plan"];
  perUserLimit: number | null;
  topUp: number;
};

type State = {
  original: Customer;
  draft: Draft;
};

type Action =
  | { type: "SET_PLAN"; value: Draft["plan"] }
  | { type: "SET_LIMIT"; value: number | null }
  | { type: "SET_TOPUP"; value: number }
  | { type: "RESET"; customer: Customer };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PLAN":
      return { ...state, draft: { ...state.draft, plan: action.value } };
    case "SET_LIMIT":
      return {
        ...state,
        draft: { ...state.draft, perUserLimit: action.value },
      };
    case "SET_TOPUP":
      return { ...state, draft: { ...state.draft, topUp: action.value } };
    case "RESET":
      return {
        original: action.customer,
        draft: {
          plan: action.customer.plan,
          perUserLimit: action.customer.perUserLimit,
          topUp: 0,
        },
      };
    default:
      return state;
  }
}

// Custom hook to manage customer editing state
// It initializes the state with the provided customer or an empty customer
// It provides functions to set plan, per-user limit, and top-up amount
// It also provides a save function that persists changes and refreshes the customer list
// The save function returns a promise with success and failure lists for the operations performed
// The hook uses the useReducer hook to manage state transitions based on actions

export function useCustomerEditor(customer: Customer = emptyCustomer) {
  const { refresh } = useCustomers();
  const [state, dispatch] = useReducer(reducer, {
    original: customer,
    draft: {
      plan: customer.plan,
      perUserLimit: customer.perUserLimit,
      topUp: 0,
    },
  });

  useEffect(() => {
    dispatch({ type: "RESET", customer });
  }, [customer]);

  const isDirty =
    state.draft.plan !== state.original.plan ||
    state.draft.perUserLimit !== state.original.perUserLimit ||
    state.draft.topUp > 0;

  // save function that returns a promise with success/failure lists
  // it will only run if there are changes
  // and will refresh the global list once
  // it will return an object with two arrays: successes and failures
  const save = async () => {
    if (!isDirty) return { successes: [], failures: [] };

    // build [name, promise] array
    const ops: Array<[string, Promise<unknown>]> = [];

    if (state.draft.plan !== state.original.plan)
      ops.push(["Plan", api.setPlan(state.original.id, state.draft.plan)]);
    if (state.draft.perUserLimit !== state.original.perUserLimit)
      ops.push([
        "Per-user limit",
        api.setPerUserLimit(state.original.id, state.draft.perUserLimit),
      ]);
    if (state.draft.topUp > 0)
      ops.push([
        "Top-up credits",
        api.topUp(state.original.id, state.draft.topUp),
      ]);

    // run them all, wait for every result
    const results = await Promise.allSettled(ops.map(([, p]) => p));

    // pair names <--> statuses
    const successes: string[] = [];
    const failures: string[] = [];
    results.forEach((r, i) => {
      const name = ops[i][0];
      if (r.status === "fulfilled") successes.push(name);
      else failures.push(name);
    });

    // refresh global list once
    refresh();
    // reset topup state
    dispatch({ type: "SET_TOPUP", value: 0 });
    
    return { successes, failures };
  };
  return { state, dispatch, isDirty, save };
}
