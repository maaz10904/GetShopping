import { useUser } from "@clerk/react";
import { ShoppingBagIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { NAVIGATION } from "./Navbar";

function Sidebar() {
  const location = useLocation();
  const { user } = useUser();

  return (
    <div className="drawer-side z-40">
      <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label>

      <aside className="flex min-h-full w-72 flex-col border-r border-base-300 bg-base-200">
        <div className="w-full p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary">
              <ShoppingBagIcon className="w-6 h-6 text-primary-content" />
            </div>
            <span className="text-xl font-bold">Admin</span>
          </div>
        </div>

        <ul className="menu w-full grow gap-2 px-3">
          {NAVIGATION.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={isActive ? "bg-primary text-primary-content" : ""}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="w-full border-t border-base-300 p-4">
          <div className="flex items-center gap-3">
            <div className="avatar shrink-0">
              <div className="w-10 rounded-full">
                <img src={user?.imageUrl} alt={user?.fullName || "User"} className="h-10 w-10 rounded-full" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">
                {user?.fullName || "Admin User"}
              </p>

              <p className="text-xs opacity-60 truncate">
                {user?.emailAddresses?.[0]?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
export default Sidebar;
