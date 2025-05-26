import React from "react";
import { render, screen, act } from "@testing-library/react";
import { CustomerProvider, useCustomers } from "./CustomerContext";
import { api } from "../services/mockApi";

jest.mock("../services/mockApi");

function TestComponent() {
  const { customers, loading, error } = useCustomers();
  if (loading) return <div>Loading</div>;
  if (error) return <div>{error}</div>;
  return <div>{customers.length}</div>;
}

test("CustomerContext loads data", async () => {
  (api.listCustomers as jest.Mock).mockResolvedValue([
    {
      id: "1",
      name: "ABC Corp",
      plan: "Basic",
      monthlyCredits: 0,
      perUserLimit: null,
      usedCredits: 0,
      users: 0,
    },
  ]);
  render(
    <CustomerProvider>
      <TestComponent />
    </CustomerProvider>
  );
  expect(screen.getByText("Loading")).toBeInTheDocument();
  await act(async () => {});
  expect(screen.getByText("1")).toBeInTheDocument();
});

test("CustomerContext shows error message", async () => {
  (api.listCustomers as jest.Mock).mockRejectedValue([
    "Failed to load customers data",
  ]);
  render(
    <CustomerProvider>
      <TestComponent />
    </CustomerProvider>
  );
  expect(screen.getByText("Loading")).toBeInTheDocument();
  await act(async () => {});
  expect(screen.getByText("Failed to load customers data")).toBeInTheDocument();
});
