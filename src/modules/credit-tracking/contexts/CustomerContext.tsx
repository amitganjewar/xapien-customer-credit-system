import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../services/mockApi";
import { Customer } from "../types/types";

interface IContext {
  customers: Customer[];
  selected?: Customer;
  select: (id: string) => void;
  refresh: () => void;
  loading: boolean;
  error: string | null;
}
const CustomerContext = createContext<IContext>({} as IContext);

// CustomerProvider component that provides customer data and actions to its children
export const CustomerProvider = ({ children }: PropsWithChildren<any>) => {
  // State to hold customers, selected customer ID, loading state, and error message
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to refresh the customers data
  // It sets the loading state to true, clears any previous error,
  // calls the API to fetch the customers, and updates the state accordingly
  const refresh = () => {
    setLoading(true);
    setError(null);
    api
      .listCustomers()
      .then(setCustomers)
      .catch((err) => setError("Failed to load customers data"))
      .finally(() => setLoading(false));
  };

  // Effect to fetch customers data when the component mounts
  useEffect(() => {
    refresh();
  }, []);

  const selected = customers.find((c) => c.id === selectedId);

  return (
    <CustomerContext.Provider
      value={{
        loading,
        error,
        customers,
        selected,
        select: setSelectedId,
        refresh,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

// Custom hook to use the CustomerContext
export const useCustomers = () => {
  const ctx = useContext(CustomerContext);
  return ctx;
};
