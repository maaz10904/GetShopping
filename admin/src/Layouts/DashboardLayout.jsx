import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout(){
    return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
        <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex min-h-screen flex-col">
            <Navbar/>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <Outlet/>
            </main>
        </div>

        <Sidebar/>
    </div>
    );
}
export default DashboardLayout;
