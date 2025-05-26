import React, { useState, useEffect } from "react";
import { useCustomers } from "../contexts/CustomerContext";
import { Customer, Plan } from "../types/types";
import { useCustomerEditor } from "../hooks/useCustomerEditor";

interface IProps {
  showToast: (message: string) => void;
}

// Component to display and edit details of a selected customer
// It shows customer information, allows editing of plan, per-user limit, and top-up amount
// It also provides a save button to persist changes
// The component uses the useCustomers context to access customer data and the useCustomerEditor hook for editing functionality
// The save function shows toast notification on the success or failure of the update operation.

export default function CustomerDetail({ showToast }: IProps) {

  const { selected } = useCustomers();
  const { state, dispatch, isDirty, save } = useCustomerEditor(
    selected as Customer
  );

  if (!selected)
    return (
      <div className="card" style={{ flex: "0 0 40%" }}>
        Select a customer
      </div>
    );

  const onSave = async () => {
    const { successes, failures } = await save();

    if (failures.length === 0) {
      showToast(`Successfully updated ${successes.join(", ")}`);
    } else if (successes.length === 0) {
      showToast(`All failed: ${failures.join(", ")}. Please retry.`);
    } else {
      showToast(
        `Successfully updated ${successes.join(
          ", "
        )}, but failed to update ${failures.join(", ")}.`
      );
    }
  };

  return (
    <div className="card" style={{ flex: "0 0 40%" }}>
      <h2>{state.original.name}</h2>
      <label>
        Plan&nbsp;
        <select
          value={state.draft.plan}
          data-testid="plan-select"
          onChange={(e) =>
            dispatch({ type: "SET_PLAN", value: e.target.value as Plan })
          }
        >
          {Object.values(Plan).map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <p>
        Monthly Credits: <strong>{state.original.monthlyCredits}</strong>
      </p>
      <p>Used: {state.original.usedCredits}</p>
      <p>
        Remaining: {state.original.monthlyCredits - state.original.usedCredits}
      </p>
      <label>
        Per-user&nbsp;
        <input
          type="number"
          min="0"
          data-testid="limit-input"
          value={state.draft.perUserLimit || ""}
          onChange={(e) =>
            dispatch({
              type: "SET_LIMIT",
              value: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
      </label>
      <div style={{ marginTop: ".5rem" }}>
        <label>
          Top-up&nbsp;
          <input
            type="number"
            data-testid="topup-input"
            min="0"
            value={state.draft.topUp}
            onChange={(e) =>
              dispatch({ type: "SET_TOPUP", value: Number(e.target.value) })
            }
            style={{ width: 80 }}
          />
        </label>
      </div>
      <button
        onClick={onSave}
        disabled={!isDirty}
        data-testid="save-button"
        style={{ marginTop: "16px" }}
      >
        Save
      </button>
    </div>
  );
}
