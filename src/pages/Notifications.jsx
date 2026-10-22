
import { Bell, Package, ShoppingCart, CheckCircle2, AlertTriangle, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const unread = notifications.filter(item => !item.read).length;
  const Icon = ({ type }) => type === "warning" ? AlertTriangle : type === "success" ? CheckCircle2 : type === "order" ? ShoppingCart : Package;

  return (
    <div className="page-content">
      <div className="page-heading">
        <div><span className="eyebrow">STORE ACTIVITY</span><h2>Notifications</h2><p>Important order updates and inventory alerts for your store.</p></div>
        <button className="button button-secondary" onClick={markAllNotificationsRead}><Check size={15} /> Mark all as read</button>
      </div>

      <div className="notification-stats">
        <div className="notification-stat"><span>Total notifications</span><strong>{notifications.length}</strong></div>
        <div className="notification-stat"><span>Unread notifications</span><strong>{unread}</strong></div>
        <div className="notification-stat"><span>Read notifications</span><strong>{notifications.length - unread}</strong></div>
      </div>

      <section className="panel">
        <div className="panel-heading"><div><h3>All notifications</h3><p>Click an alert to open its related page.</p></div></div>
        <div className="notifications-list">
          {notifications.map(item => {
            const ItemIcon = Icon({ type: item.type });
            return (
              <article key={item.id} className={`notification-item ${item.read ? "is-read" : ""}`}>
                <div className={`notification-icon ${item.type}`}><ItemIcon size={19} /></div>
                <div className="notification-content">
                  <h4>{item.title}</h4><p>{item.message}</p><span>{item.date}</span>
                </div>
                <div className="notification-item-actions">
                  {!item.read && <span className="unread-indicator">Unread</span>}
                  <button className="button button-secondary button-small" onClick={() => {
                    markNotificationRead(item.id);
                    navigate(item.target || "/");
                  }}>Open details</button>
                </div>
              </article>
            );
          })}
          {notifications.length === 0 && <div className="empty-state"><Bell size={30} /><strong>You're all caught up</strong><span>New store alerts will appear here.</span></div>}
        </div>
      </section>
    </div>
  );
}
