// src/modules/credit-tracking/hooks/useCustomerEditor.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useCustomerEditor } from "./useCustomerEditor";
import * as CustCtx from "../contexts/CustomerContext";
import { api } from "../services/mockApi";
import { Plan, Customer } from "../types/types";

// 1) Mock out the context so `refresh` is a spy
jest.mock("../contexts/CustomerContext");
const refreshMock = jest.fn();
(CustCtx.useCustomers as jest.Mock).mockReturnValue({ refresh: refreshMock });

// 2) Stub the API calls
jest.mock("../services/mockApi");
const setPlanMock = api.setPlan as jest.Mock;
const setPerUserLimitMock = api.setPerUserLimit as jest.Mock;
const topUpMock = api.topUp as jest.Mock;

// 3) A static customer fixture
const customer: Customer = {
  id: "42",
  name: "Foo Inc",
  plan: Plan.Basic,
  monthlyCredits: 100,
  perUserLimit: 10,
  usedCredits: 20,
  users: 3,
};

// 4) Harness component to pull out hook values/actions
function Harness() {
  const { state, dispatch, isDirty, save } = useCustomerEditor(customer);

  return (
    <div>
      <span data-testid="plan">{state.draft.plan}</span>
      <span data-testid="limit">{state.draft.perUserLimit ?? ""}</span>
      <span data-testid="topUp">{state.draft.topUp}</span>
      <span data-testid="dirty">{String(isDirty)}</span>

      <button
        data-testid="change-plan"
        onClick={() => dispatch({ type: "SET_PLAN", value: Plan.Enterprise })}
      >
        ChangePlan
      </button>

      <button
        data-testid="change-limit"
        onClick={() => dispatch({ type: "SET_LIMIT", value: 5 })}
      >
        ChangeLimit
      </button>

      <button
        data-testid="change-topup"
        onClick={() => dispatch({ type: "SET_TOPUP", value: 15 })}
      >
        ChangeTopUp
      </button>

      <button
        data-testid="reset"
        onClick={() => dispatch({ type: "RESET", customer })}
      >
        Reset
      </button>

      <button
        data-testid="save"
        onClick={() =>
          // We don't await here; our test will wait for save to settle
          void save()
        }
      >
        Save
      </button>
    </div>
  );
}

describe("useCustomerEditor hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setPlanMock.mockResolvedValue({ ...customer, plan: Plan.Enterprise });
    setPerUserLimitMock.mockResolvedValue({ ...customer, perUserLimit: 5 });
    topUpMock.mockResolvedValue({ ...customer, monthlyCredits: 115 });
  });

  it("initializes draft from customer and dirty=false", () => {
    render(<Harness />);
    expect(screen.getByTestId("plan").textContent).toBe("Basic");
    expect(screen.getByTestId("limit").textContent).toBe("10");
    expect(screen.getByTestId("topUp").textContent).toBe("0");
    expect(screen.getByTestId("dirty").textContent).toBe("false");
  });

  it("SET_PLAN updates draft.plan and sets dirty=true", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("change-plan"));
    expect(screen.getByTestId("plan").textContent).toBe("Enterprise");
    expect(screen.getByTestId("dirty").textContent).toBe("true");
  });

  it("SET_LIMIT and SET_TOPUP update draft and dirty", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("change-limit"));
    expect(screen.getByTestId("limit").textContent).toBe("5");
    expect(screen.getByTestId("dirty").textContent).toBe("true");

    fireEvent.click(screen.getByTestId("change-topup"));
    expect(screen.getByTestId("topUp").textContent).toBe("15");
    expect(screen.getByTestId("dirty").textContent).toBe("true");
  });

  it("RESET returns draft and dirty back to initial", () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId("change-plan"));
    expect(screen.getByTestId("dirty").textContent).toBe("true");

    fireEvent.click(screen.getByTestId("reset"));
    expect(screen.getByTestId("plan").textContent).toBe("Basic");
    expect(screen.getByTestId("limit").textContent).toBe("10");
    expect(screen.getByTestId("topUp").textContent).toBe("0");
    expect(screen.getByTestId("dirty").textContent).toBe("false");
  });

  it("save() calls only changed APIs and then refreshes and resets topUp", async () => {
    render(<Harness />);

    // Change plan and top-up
    fireEvent.click(screen.getByTestId("change-plan"));
    fireEvent.click(screen.getByTestId("change-topup"));

    // Trigger save
    fireEvent.click(screen.getByTestId("save"));

    // Wait for allSettled and refresh
    await waitFor(() => {
      expect(setPlanMock).toHaveBeenCalledWith("42", Plan.Enterprise);
      expect(setPerUserLimitMock).not.toHaveBeenCalled();
      expect(topUpMock).toHaveBeenCalledWith("42", 15);
      expect(refreshMock).toHaveBeenCalledTimes(1);
    });

    // After save, topUp should reset to 0
    expect(screen.getByTestId("topUp").textContent).toBe("0");
  });
});
