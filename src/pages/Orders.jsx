
import { useMemo, useState } from "react";
import { Eye, ShoppingCart } from "lucide-react";
import { useStore } from "../context/StoreContext";
import SearchFilter from "../components/SearchFilter";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import { formatCurrency, formatDate } from "../utils/formatters";
import useDebounce from "../hooks/useDebounce";

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function Orders() {
  const { orders, updateOrderStatus, customers } = useStore();
  const [search, setSearch] = useState("");
  const query = useDebounce(search);
  const [status, setStatus] = useState("All");
  const [payment, setPayment] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const pageSize = 6;

  const filtered = useMemo(() => orders.filter(order => {
    const matches = `${order.id} ${order.customer} ${order.customerId}`.toLowerCase().includes(query.toLowerCase());
    return matches && (status === "All" || order.status === status) && (payment === "All" || order.payment === payment);
  }).sort((a, b) => b.date.localeCompare(a.date)), [orders, query, status, payment]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="page-content">
      <div className="page-heading"><div><span className="eyebrow">FULFILMENT</span><h2>Orders</h2><p>Track customer purchases, payments and fulfilment status.</p></div></div>

      <div className="metrics-grid compact-metrics">
        {[
          ["Total orders", orders.length, "purple"],
          ["Pending", orders.filter(o => o.status === "Pending").length, "orange"],
          ["Processing", orders.filter(o => o.status === "Processing").length, "blue"],
          ["Delivered", orders.filter(o => o.status === "Delivered").length, "green"]
        ].map(([label, value, tone]) => <div className="metric-card" key={label}><div className="metric-top">{label}<span className={`metric-icon ${tone}`}><ShoppingCart size={18} /></span></div><div className="metric-value">{value}</div><div className="metric-foot">Current order records</div></div>)}
      </div>

      <section className="panel table-panel">
        <div className="panel-heading"><div><h3>All orders</h3><p>Open an order to inspect its details or update its status.</p></div><span className="count-pill">{filtered.length}</span></div>
        <SearchFilter search={search} onSearch={v => { setSearch(v); setPage(1); }} filters={[
          { label: "Order status", value: status, onChange: v => { setStatus(v); setPage(1); }, options: [{ label: "All statuses", value: "All" }, ...statuses.map(v => ({ label: v, value: v }))] },
          { label: "Payment status", value: payment, onChange: v => { setPayment(v); setPage(1); }, options: [{ label: "All payments", value: "All" }, ...["Paid", "Pending", "Refunded"].map(v => ({ label: v, value: v }))] }
        ]} />
        <div className="table-scroll"><table>
          <thead><tr><th>ORDER ID</th><th>CUSTOMER</th><th>DATE</th><th>ITEMS</th><th>TOTAL</th><th>PAYMENT</th><th>STATUS</th><th>ACTION</th></tr></thead>
          <tbody>{rows.map(order => <tr key={order.id}>
            <td className="id-cell">{order.id}</td><td>{order.customer}</td><td>{formatDate(order.date)}</td><td>{order.items}</td><td className="amount-cell">{formatCurrency(order.total)}</td><td><StatusBadge status={order.payment} /></td><td><StatusBadge status={order.status} /></td>
            <td><button className="icon-button" aria-label={`View order ${order.id}`} title="View order" onClick={() => setSelected(order)}><Eye size={15} /></button></td>
          </tr>)}</tbody>
        </table>
        {rows.length === 0 && <div className="empty-state"><ShoppingCart size={28} /><strong>No orders found</strong><span>Try another search or filter.</span></div>}
        </div>
        <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={pageSize} onChange={setPage} />
      </section>

      {selected && (
        <Modal title={`Order ${selected.id}`} subtitle="Review the order and update its fulfilment status." onClose={() => setSelected(null)}>
          <div className="detail-body">
            {[["Customer", selected.customer], ["Customer ID", selected.customerId], ["Order date", formatDate(selected.date)], ["Items", selected.items], ["Order total", formatCurrency(selected.total)], ["Payment", selected.payment]].map(([label, value]) => <div className="detail-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}
            {customers.find(c => c.id === selected.customerId) && <div className="detail-row"><span>Customer email</span><strong>{customers.find(c => c.id === selected.customerId).email}</strong></div>}
            <label className="detail-select-label">Order status
              <select value={selected.status} onChange={event => {
                const nextStatus = event.target.value;
                updateOrderStatus(selected.id, nextStatus);
                setSelected(current => ({ ...current, status: nextStatus }));
              }}>{statuses.map(s => <option key={s}>{s}</option>)}</select>
            </label>
            <div className="modal-actions"><button className="button button-secondary" onClick={() => setSelected(null)}>Close</button></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
