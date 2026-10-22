
import {
  LayoutDashboard, Package, ShoppingCart, Users, Warehouse,
  Bell, UserRound, Store, Headphones, X, ChevronRight
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { getInitials } from "../utils/formatters";

const primaryLinks = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/products", label: "Products", icon: Package },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/inventory", label: "Inventory", icon: Warehouse }
];

export default function Sidebar({ open, onClose }) {
  const { profile, notifications } = useStore();
  const unread = notifications.filter(item => !item.read).length;

  const links = [
    ...primaryLinks,
    { to: "/notifications", label: "Notifications", icon: Bell, count: unread },
    { to: "/profile", label: "My Profile", icon: UserRound }
  ];

  return (
    <>
      {open && <button className="sidebar-backdrop" onClick={onClose} aria-label="Close menu" />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-logo"><Store size={23} /></div>
          <div>
            <strong>Commerce Flow</strong>
            <small>MANAGEMENT SUITE</small>
          </div>
          <button className="icon-button mobile-close" onClick={onClose} aria-label="Close sidebar">
            <X size={19} />
          </button>
        </div>

        <p className="nav-caption">WORKSPACE</p>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {links.map(({ to, label, icon: Icon, end, count }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {count > 0 && <span className="nav-count">{count > 9 ? "9+" : count}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {/* <div className="support-card">
            <div className="support-icon"><Headphones size={18} /></div>
            <strong>Need some help?</strong>
            <p>Manage your store with confidence. Review your orders and inventory anytime.</p>
            <button onClick={() => window.location.assign("mailto:support@example.com")}>
              Contact support <ChevronRight size={14} />
            </button>
          </div> */}
          <div className="sidebar-user">
            <div className="avatar">{getInitials(profile.name)}</div>
            <div className="sidebar-user-info">
              <strong>{profile.name}</strong>
              <small>{profile.role}</small>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
