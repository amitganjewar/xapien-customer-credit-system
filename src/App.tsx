import React from "react";
import { CustomerProvider } from "./modules/credit-tracking/contexts/CustomerContext";
import CustomerTable from "./modules/credit-tracking/organisms/CustomerTable";
import CustomerDetail from "./modules/credit-tracking/organisms/CustomerDetail";
import { useToast } from "./modules/credit-tracking/hooks/useToast";

// Main application component that renders the customer tracking interface
// It includes a header, customer table, and customer detail view
// The CustomerProvider context is used to manage customer data and state
// The useToast hook is used to display toast notifications for user actions
// The layout is responsive, with the customer table and detail view displayed side by side
const App = () => {
  const { showToast, Toast } = useToast();
  return (
    <>
      <h1 style={{ marginBottom: "16px", padding: "8px" }}>
        Xapien Credit Tracking
      </h1>
      <CustomerProvider>
        <div className="flex" style={{ margin: "16px" }}>
          <CustomerTable />
          <CustomerDetail showToast={showToast} />
        </div>
      </CustomerProvider>
      {Toast}
    </>
  );
}
export default App;
