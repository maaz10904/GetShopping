import { useQuery } from "@tanstack/react-query";

import { customerApi } from "../libs/api";
import { formatDate } from "../libs/utils";

function CustomersPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: customerApi.getAll,
  });

  const customers = Array.isArray(data) ? data : data?.customers || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="mt-1 text-base-content/70">
          {customers.length} {customers.length === 1 ? "customer" : "customers"} registered
        </p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : customers.length === 0 ? (
            <div className="py-12 text-center text-base-content/60">
              <p className="mb-2 text-xl font-semibold">No customers yet</p>
              <p className="text-sm">Customers will appear here once they sign up</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Addresses</th>
                    <th>Wishlist</th>
                    <th>Joined Date</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="w-12 rounded-full bg-primary text-primary-content">
                              {customer.imageUrl ? (
                                <img
                                  src={customer.imageUrl}
                                  alt={customer.name || "Customer"}
                                  className="h-12 w-12 rounded-full object-cover"
                                />
                              ) : (
                                <span>{customer.name?.charAt(0)?.toUpperCase() || "U"}</span>
                              )}
                            </div>
                          </div>
                          <div className="font-semibold">{customer.name || "Unknown User"}</div>
                        </div>
                      </td>

                      <td>{customer.email || "-"}</td>

                      <td>
                        <div className="badge badge-ghost">
                          {customer.addresses?.length || 0} address(es)
                        </div>
                      </td>

                      <td>
                        <div className="badge badge-ghost">
                          {customer.wishlist?.length || 0} item(s)
                        </div>
                      </td>

                      <td>
                        <span className="text-sm opacity-60">{formatDate(customer.createdAt)}</span>
                      </td>
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
