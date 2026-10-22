
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Toast from "./Toast";
import { useStore } from "../context/StoreContext";
import { RefreshCw } from "lucide-react";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { loading, refreshDashboard, toast, dismissToast } = useStore();

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="main-area">
        <Topbar onMenu={() => setMenuOpen(true)} />
        <div className="refresh-strip">
          <span><i /> Your store workspace is ready</span>
          <button onClick={refreshDashboard} disabled={loading}>
            <RefreshCw size={13} className={loading ? "spin" : ""} />
            {loading ? "Refreshing..." : "Refresh dashboard"}
          </button>
        </div>
        {loading && <div className="loading-bar"><span /></div>}
        <Outlet />
        <footer className="app-footer">
          <span>© {new Date().getFullYear()} CommerceFlow. All rights reserved.</span>
          <span><i /> All systems operational</span>
        </footer>
      </main>
      <Toast toast={toast} onClose={dismissToast} />
    </div>
  );
}
