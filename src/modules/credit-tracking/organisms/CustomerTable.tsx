import React from "react";
import { useCustomers } from "../contexts/CustomerContext";

const CustomerTable = () => {
  const { loading, error, customers, select, selected } = useCustomers();

  // Function to render the content based on loading, error, and customers state
  // If loading, it shows a loading message
  // If there's an error, it shows the error message
  // If there are no customers, it shows a message indicating no customers found
  // If customers are available, it renders a table with customer details
  // Each row is clickable and highlights the selected customer
  // The table displays customer name, plan, monthly credits, and remaining credits
  const renderContent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!customers || customers.length === 0) return <p>No customers found</p>;
    return (
      <>
        <h2>Customers</h2>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Plan</th>
              <th>Monthly Credits</th>
              <th>Remaining Credits</th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((customer) => {
              const remaining = customer.monthlyCredits - customer.usedCredits;
              return (
                <tr
                  key={customer.id}
                  onClick={() => select(customer.id)}
                  className={selected?.id === customer.id ? "selected" : ""}
                  style={{ cursor: "pointer" }}
                >
                  <td>{customer.name}</td>
                  <td>{customer.plan}</td>
                  <td>{customer.monthlyCredits}</td>
                  <td>{remaining}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <div className="card" style={{ flex: "0 0 58%", minWidth: 320 }}>
      {renderContent()}
    </div>
  );
};
export default CustomerTable;
