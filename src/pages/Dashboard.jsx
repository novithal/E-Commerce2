
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign, ShoppingCart, Package, Users, ArrowUpRight,
  AlertTriangle, ArrowRight
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { formatCurrency, formatDate } from "../utils/formatters";

function SalesChart({ orders }) {
  const values = useMemo(() => {
    const result = Array(7).fill(0);
    orders.forEach(order => {
      if (order.status === "Cancelled") return;
      const age = Math.floor((Date.now() - new Date(`${order.date}T00:00:00`).getTime()) / 86400000);
      if (age >= 0 && age < 7) result[6 - age] += order.total;
    });
    return result.some(Boolean) ? result : [1200, 1800, 1450, 2500, 2100, 3000, 2800];
  }, [orders]);

  const max = Math.max(...values, 1);
  const points = values.map((value, i) => ({
    x: 34 + i * 50,
    y: 145 - (value / max) * 112
  }));
  const line = points.map(point => `${point.x},${point.y}`).join(" ");
  const area = `34,150 ${line} ${points[points.length - 1].x},150`;

  return (
    <div className="chart-container">
      <div className="chart-legend"><span><i /> Order revenue</span><span>Last 7 days</span></div>
      <svg className="sales-chart" viewBox="0 0 370 185" role="img" aria-label="Sales revenue chart">
        {[35, 65, 95, 125, 155].map(y => (
          <line key={y} x1="25" y1={y} x2="340" y2={y} className="chart-grid" />
        ))}
        <polygon points={area} className="chart-area" />
        <polyline points={line} className="chart-line" />
        {points.map((point, i) => (
          <circle key={i} cx={point.x} cy={point.y} r="3.5" className="chart-point" />
        ))}
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
          <text key={day} x={34 + i * 50} y="173" textAnchor="middle" className="chart-label">{day}</text>
        ))}
      </svg>
      <div className="chart-summary">
        <span>Revenue from non-cancelled orders</span>
        <strong>{formatCurrency(values.reduce((a, b) => a + b, 0))}</strong>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { products, orders, customers, notifications } = useStore();

  const revenue = orders.filter(order => !["Cancelled"].includes(order.status))
    .reduce((sum, order) => sum + order.total, 0);
  const pending = orders.filter(order => ["Pending", "Processing"].includes(order.status)).length;
  const lowStock = products.filter(product => product.stock > 0 && product.stock <= 10).length;
  const outOfStock = products.filter(product => product.stock === 0).length;

  return (
    <div className="page-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">STORE OVERVIEW</span>
          <h2>Dashboard</h2>
          <p>Here's what's happening with your store today.</p>
        </div>
        <button className="button button-primary" onClick={() => navigate("/products")}>
          <Package size={15} /> Manage products
        </button>
      </div>

      <div className="metrics-grid">
        <StatCard title="Total Revenue" value={formatCurrency(revenue)} icon={DollarSign} tone="purple" note="Based on current orders" />
        <StatCard title="Total Orders" value={orders.length.toLocaleString("en-IN")} icon={ShoppingCart} tone="blue" note={`${pending} pending / processing`} />
        <StatCard title="Total Products" value={products.length.toLocaleString("en-IN")} icon={Package} tone="green" note={`${lowStock + outOfStock} need stock attention`} />
        <StatCard title="Total Customers" value={customers.length.toLocaleString("en-IN")} icon={Users} tone="orange" note="Registered customers" />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <div><h3>Sales performance</h3><p>Revenue from recent orders</p></div>
            <span className="live-tag"><i /> Live data</span>
          </div>
          <SalesChart orders={orders} />
        </section>

        <section className="panel inventory-panel">
          <div className="panel-heading">
            <div><h3>Inventory overview</h3><p>Current product stock levels</p></div>
            <button className="text-button" onClick={() => navigate("/inventory")}>Details <ArrowRight size={14} /></button>
          </div>
          <div className="inventory-summary">
            <div className="inventory-total"><strong>{products.reduce((sum, item) => sum + item.stock, 0)}</strong><span>Total units in stock</span></div>
            <div className="inventory-ring"><Package size={21} /><span>{products.length}<small>Products</small></span></div>
          </div>
          <div className="stock-bar">
            <span style={{ width: `${products.length ? products.filter(p => p.stock > 10).length / products.length * 100 : 0}%` }} />
          </div>
          <div className="stock-legend"><span><i className="dot-green" /> Healthy stock</span><strong>{products.filter(p => p.stock > 10).length}</strong></div>
          <div className="stock-legend"><span><i className="dot-orange" /> Low stock</span><strong>{lowStock}</strong></div>
          <div className="stock-legend"><span><i className="dot-red" /> Out of stock</span><strong>{outOfStock}</strong></div>
          {(lowStock > 0 || outOfStock > 0) && (
            <button className="inventory-alert" onClick={() => navigate("/inventory")}>
              <AlertTriangle size={15} /> Review stock alerts <ArrowUpRight size={14} />
            </button>
          )}
        </section>
      </div>

      <section className="panel recent-orders-panel">
        <div className="panel-heading">
          <div><h3>Recent orders</h3><p>Latest customer transactions</p></div>
          <button className="text-button" onClick={() => navigate("/orders")}>View all orders <ArrowRight size={14} /></button>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>ORDER ID</th><th>CUSTOMER</th><th>DATE</th><th>AMOUNT</th><th>PAYMENT</th><th>STATUS</th></tr></thead>
            <tbody>
              {[...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map(order => (
                <tr key={order.id}>
                  <td className="id-cell">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{formatDate(order.date)}</td>
                  <td className="amount-cell">{formatCurrency(order.total)}</td>
                  <td><StatusBadge status={order.payment} /></td>
                  <td><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="empty-state"><ShoppingCart size={28} /><strong>No orders yet</strong><span>Orders will appear here when added.</span></div>}
        </div>
      </section>

      {notifications.some(item => !item.read) && (
        <p style={{ color: "#8792a4", fontSize: 11, marginTop: 16 }}>
          You have {notifications.filter(item => !item.read).length} unread notification(s).
          {" "}<button className="text-button" onClick={() => navigate("/notifications")}>Review notifications</button>
        </p>
      )}
    </div>
  );
}
