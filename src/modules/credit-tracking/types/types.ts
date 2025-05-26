

export interface Customer {
  id: string;
  name: string;
  plan: Plan;
  monthlyCredits: number;
  perUserLimit: number | null;
  usedCredits: number;
  users: number;
}

export enum Plan {
    Trial = "Trial",
    Basic = "Basic",
    Lite = "Lite",
    Enterprise = "Enterprise",
    Ultimate = "Ultimate"
}