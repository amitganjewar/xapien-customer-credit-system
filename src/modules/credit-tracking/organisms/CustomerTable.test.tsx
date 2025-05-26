import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomerTable from "./CustomerTable";
import * as CustCtx from "../contexts/CustomerContext";

jest.mock("../contexts/CustomerContext");
const useCustomersMock = CustCtx.useCustomers as jest.Mock;

describe("CustomerTable", () => {
  // Reset between tests
  beforeEach(() => {
    useCustomersMock.mockReset();
  });

  it("shows loading state", () => {
    useCustomersMock.mockReturnValue({
      loading: true,
      error: null,
      customers: [],
      select: jest.fn(),
      refresh: jest.fn(),
    });
    render(<CustomerTable />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows error state", () => {
    useCustomersMock.mockReturnValue({
      loading: false,
      error: "Network error",
      customers: [],
      select: jest.fn(),
      refresh: jest.fn(),
    });
    render(<CustomerTable />);
    expect(screen.getByText("Error: Network error")).toBeInTheDocument();
  });

  it("shows empty state when no customers", () => {
    useCustomersMock.mockReturnValue({
      loading: false,
      error: null,
      customers: [],
      select: jest.fn(),
      refresh: jest.fn(),
    });
    render(<CustomerTable />);
    expect(screen.getByText("No customers found")).toBeInTheDocument();
  });

  it("renders a list of customers and calls select()", () => {
    const fakeSelect = jest.fn();
    useCustomersMock.mockReturnValue({
      loading: false,
      error: null,
      customers: [
        {
          id: "1",
          name: "ABC Corp",
          plan: "Basic",
          monthlyCredits: 100,
          perUserLimit: null,
          usedCredits: 20,
          users: 5,
        },
      ],
      select: fakeSelect,
      refresh: jest.fn(),
    });
    render(<CustomerTable />);
    const row = screen.getByText("ABC Corp");
    expect(row).toBeInTheDocument();

    fireEvent.click(row);
    expect(fakeSelect).toHaveBeenCalledWith("1");
  });
});
