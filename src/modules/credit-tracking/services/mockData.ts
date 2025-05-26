import { Customer, Plan } from "../types/types";

export const customers: Customer[] = [
  {
    id: "1",
    name: "Acme Corp",
    plan: Plan.Enterprise,
    monthlyCredits: 500,
    perUserLimit: 50,
    usedCredits: 120,
    users: 10,
  },
  {
    id: "2",
    name: "Globex",
    plan: Plan.Basic,
    monthlyCredits: 100,
    perUserLimit: null,
    usedCredits: 20,
    users: 5,
  },
  {
    id: "3",
    name: "Microsoft",
    plan: Plan.Ultimate,
    monthlyCredits: 1000,
    perUserLimit: null,
    usedCredits: 20,
    users: 50,
  },
  {
    id: "4",
    name: "CompanyL",
    plan: Plan.Lite,
    monthlyCredits: 20,
    perUserLimit: null,
    usedCredits: 20,
    users: 1,
  },
  {
    id: "5",
    name: "CompanyT",
    plan: Plan.Trial,
    monthlyCredits: 10,
    perUserLimit: null,
    usedCredits: 0,
    users: 5,
  },
];

// a minimal stub so the reducer never sees `undefined`
export const emptyCustomer: Customer = {
  id: '',
  name: '',
  plan: Plan.Trial,
  monthlyCredits: 0,
  perUserLimit: null,
  usedCredits: 0,
  users: 0
};