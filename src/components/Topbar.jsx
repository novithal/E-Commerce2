
import { Bell, Menu, ChevronDown, UserRound, LogOut } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { getInitials } from "../utils/formatters";

const titles = {
  "/": ["Overview", "Your store performance at a glance"],
  "/products": ["Products", "Manage your product catalogue"],
  "/orders": ["Orders", "Track and manage customer orders"],
  "/customers": ["Customers", "Manage your customer relationships"],
  "/inventory": ["Inventory", "Monitor stock and low inventory"],
  "/notifications": ["Notifications", "Updates and alerts for your store"],
  "/profile": ["My Profile", "Manage your account details"]
};

export default function Topbar({ onMenu }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, notifications, markAllNotificationsRead, markNotificationRead } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const unread = notifications.filter(item => !item.read).length;
  const [title] = titles[location.pathname] || ["Dashboard", "Manage your store"];
  const recent = [...notifications].slice(0, 4);

  function openNotification(item) {
    markNotificationRead(item.id);
    setShowNotifications(false);
    navigate(item.target || "/notifications");
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button menu-toggle" onClick={onMenu} aria-label="Open navigation">
          <Menu size={21} />
        </button>
        <div>
          <div className="breadcrumb">CommerceFlow <span>/</span> {title}</div>
          <h1>{title}</h1>
        </div>
      </div>

      <div className="topbar-actions">
        {/* <div className="topbar-date">
          <span>{new Intl.DateTimeFormat("en-IN", {
            day: "2-digit", month: "short", year: "numeric"
          }).format(new Date())}</span>
        </div> */}

        <div className="notification-wrap">
          <button
            className="icon-button notification-button"
            onClick={() => {
              setShowNotifications(value => !value);
              setShowProfile(false);
            }}
            aria-label="Open notifications"
            aria-expanded={showNotifications}
          >
            <Bell size={19} />
            {unread > 0 && <span className="notification-dot">{unread > 9 ? "9+" : unread}</span>}
          </button>

          {showNotifications && (
            <div className="notification-popover">
              <div className="popover-heading">
                <strong>Notifications</strong>
                <button onClick={markAllNotificationsRead}>Mark all read</button>
              </div>
              {recent.length ? recent.map(item => (
                <button
                  key={item.id}
                  className="popover-notification"
                  onClick={() => openNotification(item)}
                >
                  <span className={`notification-icon ${item.type}`}>
                    <Bell size={16} />
                  </span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.message}</small>
                    <em>{item.date}</em>
                  </span>
                  {!item.read && <i />}
                </button>
              )) : <div className="empty-small">You're all caught up.</div>}
              <div style={{ padding: 13, textAlign: "center" }}>
                <button className="text-button" onClick={() => {
                  setShowNotifications(false);
                  navigate("/notifications");
                }}>View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="notification-wrap">
          <button
            className="profile-trigger"
            onClick={() => {
              setShowProfile(value => !value);
              setShowNotifications(false);
            }}
            aria-label="Open profile menu"
            aria-expanded={showProfile}
          >
            <div className="avatar">{getInitials(profile.name)}</div>
            <span>
              <strong>{profile.name}</strong>
              <small>{profile.role}</small>
            </span>
            <ChevronDown size={14} />
          </button>

          {showProfile && (
            <div className="notification-popover profile-popover">
              <div className="popover-heading">
                <strong>My account</strong>
              </div>
              <button className="popover-notification" onClick={() => {
                setShowProfile(false);
                navigate("/profile");
              }}>
                <UserRound size={18} />
                <span><strong>View profile</strong><small>Edit your personal details</small></span>
              </button>
              <button className="popover-notification" onClick={() => {
                setShowProfile(false);
                navigate("/profile");
              }}>
                <LogOut size={18} />
                <span><strong>Account settings</strong><small>Manage account information</small></span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
