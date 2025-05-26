import { Customer, Plan } from "../types/types";
import { customers } from "./mockData";

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const api = {
  listCustomers: async (): Promise<Customer[]> => {
    await delay();
    return [...customers];
  },
  setPlan: async (id: string, plan: Plan): Promise<Customer> => {
    await delay();
    const customer = customers.find((c) => c.id === id)!;
    customer.plan = plan;
    customer.monthlyCredits = {
      [Plan.Ultimate]: 1000,
      [Plan.Enterprise]: 500,
      [Plan.Basic]: 100,
      [Plan.Lite]: 20,
      [Plan.Trial]: 10,
    }[plan];
    return { ...customer };
  },
  setPerUserLimit: async (
    id: string,
    limit: number | null
  ): Promise<Customer> => {
    await delay();
    const customer = customers.find((c) => c.id === id)!;
    customer.perUserLimit = limit;
    return { ...customer };
  },
  topUp: async (id: string, amount: number): Promise<Customer> => {
    await delay();
    const customer = customers.find((c) => c.id === id)!;
    customer.monthlyCredits += amount;
    return { ...customer };
  },
};
