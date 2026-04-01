import { useQuery } from "@tanstack/react-query";
import { UsersIcon } from "lucide-react";

import { customerApi } from "../libs/api";
import { formatDate } from "../libs/utils";

function CustomersPage() {
  const {
    data: customers = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: customerApi.getAll,
  });

  return (
    <div className="space-y-6">
      <div className="stats shadow w-full bg-base-100">
        <div className="stat">
          <div className="stat-figure text-primary">
            <UsersIcon className="size-8" />
          </div>
          <div className="stat-title">Total Customers</div>
          <div className="stat-value">{isLoading ? "..." : customers.length}</div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Customers</h2>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : isError ? (
            <div className="alert alert-error">
              <span>{error?.response?.data?.message || error?.message || "Failed to load customers"}</span>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">No customers found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Clerk ID</th>
                    <th>Joined</th>
                    <th>Addresses</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id}>
                      <td className="font-medium">{customer.name || "Unknown User"}</td>
                      <td>{customer.email || "-"}</td>
                      <td className="font-mono text-xs">{customer.clerkId || "-"}</td>
                      <td>{formatDate(customer.createdAt) || "-"}</td>
                      <td>{customer.addresses?.length || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomersPage;
