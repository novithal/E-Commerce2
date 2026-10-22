
import { useMemo, useState } from "react";
import { Eye, Users, UserRound } from "lucide-react";
import { useStore } from "../context/StoreContext";
import SearchFilter from "../components/SearchFilter";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import { formatCurrency } from "../utils/formatters";
import useDebounce from "../hooks/useDebounce";

export default function Customers() {
  const { customers, updateCustomer } = useStore();
  const [search, setSearch] = useState("");
  const query = useDebounce(search);
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const pageSize = 6;

  const filtered = useMemo(() => customers.filter(customer =>
    `${customer.name} ${customer.email} ${customer.id} ${customer.city}`.toLowerCase().includes(query.toLowerCase()) &&
    (status === "All" || customer.status === status)
  ), [customers, query, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="page-content">
      <div className="page-heading"><div><span className="eyebrow">CUSTOMER RELATIONSHIPS</span><h2>Customers</h2><p>Review customer details, order history counts and spending.</p></div></div>
      <div className="metrics-grid compact-metrics">
        {[
          ["Total customers", customers.length, "purple"],
          ["Active customers", customers.filter(c => c.status === "Active").length, "green"],
          ["Inactive customers", customers.filter(c => c.status === "Inactive").length, "orange"],
          ["Total customer spend", formatCurrency(customers.reduce((sum, c) => sum + c.spent, 0)), "blue"]
        ].map(([label, value, tone]) => <div className="metric-card" key={label}><div className="metric-top">{label}<span className={`metric-icon ${tone}`}><Users size={18} /></span></div><div className="metric-value">{value}</div><div className="metric-foot">From saved customer records</div></div>)}
      </div>

      <section className="panel table-panel">
        <div className="panel-heading"><div><h3>Customer directory</h3><p>Search by name, email, city or customer ID.</p></div><span className="count-pill">{filtered.length}</span></div>
        <SearchFilter search={search} onSearch={v => { setSearch(v); setPage(1); }} filters={[
          { label: "Customer status", value: status, onChange: v => { setStatus(v); setPage(1); }, options: [{ label: "All statuses", value: "All" }, { label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }] }
        ]} />
        <div className="table-scroll"><table>
          <thead><tr><th>CUSTOMER</th><th>CUSTOMER ID</th><th>CITY</th><th>ORDERS</th><th>TOTAL SPEND</th><th>STATUS</th><th>ACTION</th></tr></thead>
          <tbody>{rows.map(customer => <tr key={customer.id}>
            <td><div className="customer-cell"><div className="mini-avatar">{customer.name.split(" ").map(n => n[0]).slice(0, 2).join("")}</div><div><strong>{customer.name}</strong><small>{customer.email}</small></div></div></td>
            <td className="id-cell">{customer.id}</td><td>{customer.city}</td><td>{customer.orders}</td><td className="amount-cell">{formatCurrency(customer.spent)}</td><td><StatusBadge status={customer.status} /></td>
            <td><button className="icon-button" title="View customer" aria-label={`View ${customer.name}`} onClick={() => setSelected(customer)}><Eye size={15} /></button></td>
          </tr>)}</tbody>
        </table>
        {rows.length === 0 && <div className="empty-state"><Users size={28} /><strong>No customers found</strong><span>Try another search or filter.</span></div>}
        </div>
        <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={pageSize} onChange={setPage} />
      </section>

      {selected && (
        <Modal title="Customer details" subtitle={selected.id} onClose={() => setSelected(null)}>
          <div className="detail-body">
            <div className="detail-banner"><div className="detail-icon"><UserRound size={22} /></div><div><strong>{selected.name}</strong><small>{selected.email}</small></div><StatusBadge status={selected.status} /></div>
            {[["Phone", selected.phone], ["City", selected.city], ["Total orders", selected.orders], ["Total spend", formatCurrency(selected.spent)]].map(([label, value]) => <div className="detail-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}
            <label className="detail-select-label">Customer status
              <select value={selected.status} onChange={event => {
                const next = { ...selected, status: event.target.value };
                updateCustomer(selected.id, { status: next.status });
                setSelected(next);
              }}><option>Active</option><option>Inactive</option></select>
            </label>
            <div className="modal-actions"><button className="button button-secondary" onClick={() => setSelected(null)}>Close</button></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
