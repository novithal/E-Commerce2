
import { useMemo, useState } from "react";
import { Warehouse, Package, Save } from "lucide-react";
import { useStore } from "../context/StoreContext";
import SearchFilter from "../components/SearchFilter";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import useDebounce from "../hooks/useDebounce";

export default function Inventory() {
  const { products, updateStock } = useStore();
  const [search, setSearch] = useState("");
  const query = useDebounce(search);
  const [stockFilter, setStockFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [drafts, setDrafts] = useState({});
  const pageSize = 6;

  const filtered = useMemo(() => products.filter(product => {
    const matches = `${product.name} ${product.sku} ${product.id}`.toLowerCase().includes(query.toLowerCase());
    const category = stockFilter === "All" ||
      (stockFilter === "Healthy" && product.stock > 10) ||
      (stockFilter === "Low stock" && product.stock > 0 && product.stock <= 10) ||
      (stockFilter === "Out of stock" && product.stock === 0);
    return matches && category;
  }), [products, query, stockFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const healthy = products.filter(p => p.stock > 10).length;
  const low = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const out = products.filter(p => p.stock === 0).length;

  return (
    <div className="page-content">
      <div className="page-heading"><div><span className="eyebrow">STOCK CONTROL</span><h2>Inventory</h2><p>Monitor stock, identify low inventory and update quantities.</p></div></div>

      <div className="metrics-grid compact-metrics">
        {[
          ["Healthy stock", healthy, "green"],
          ["Low stock", low, "orange"],
          ["Out of stock", out, "blue"],
          ["Total units", products.reduce((sum, p) => sum + p.stock, 0), "purple"]
        ].map(([label, value, tone]) => <div className="metric-card" key={label}><div className="metric-top">{label}<span className={`metric-icon ${tone}`}><Warehouse size={18} /></span></div><div className="metric-value">{value}</div><div className="metric-foot">Based on current quantities</div></div>)}
      </div>

      <section className="panel table-panel">
        <div className="panel-heading"><div><h3>Stock management</h3><p>Change a quantity and save it to update inventory.</p></div><span className="count-pill">{filtered.length} products</span></div>
        <SearchFilter search={search} onSearch={v => { setSearch(v); setPage(1); }} filters={[
          { label: "Stock level", value: stockFilter, onChange: v => { setStockFilter(v); setPage(1); }, options: [{ label: "All stock levels", value: "All" }, { label: "Healthy", value: "Healthy" }, { label: "Low stock", value: "Low stock" }, { label: "Out of stock", value: "Out of stock" }] }
        ]} />
        <div className="table-scroll"><table>
          <thead><tr><th>PRODUCT</th><th>SKU</th><th>CATEGORY</th><th>CURRENT STOCK</th><th>STOCK LEVEL</th><th>NEW QUANTITY</th><th>ACTION</th></tr></thead>
          <tbody>{rows.map(product => {
            const level = product.stock === 0 ? "Out of stock" : product.stock <= 10 ? "Low stock" : "Healthy";
            const draft = drafts[product.id] ?? String(product.stock);
            return <tr key={product.id}>
              <td><div className="product-cell"><div className="product-thumb"><Package size={18} /></div><div><strong>{product.name}</strong><small>{product.id}</small></div></div></td>
              <td>{product.sku}</td><td>{product.category}</td>
              <td className={product.stock === 0 ? "stock-out" : product.stock <= 10 ? "stock-low" : "stock-number"}>{product.stock}</td>
              <td><StatusBadge status={level} /></td>
              <td><input aria-label={`New stock for ${product.name}`} type="number" min="0" step="1" value={draft} onChange={e => setDrafts(current => ({ ...current, [product.id]: e.target.value }))} style={{ width: 90, padding: "8px", border: "1px solid #e3e8f0", borderRadius: 8, fontSize: 11 }} /></td>
              <td><button className="button button-secondary button-small" onClick={() => {
                if (draft.trim() === "" || !Number.isInteger(Number(draft)) || Number(draft) < 0) return;
                if (updateStock(product.id, Number(draft))) {
                  setDrafts(current => { const next = { ...current }; delete next[product.id]; return next; });
                }
              }}><Save size={13} /> Save</button></td>
            </tr>;
          })}</tbody>
        </table>
        {rows.length === 0 && <div className="empty-state"><Warehouse size={28} /><strong>No inventory items found</strong><span>Try changing the search or stock filter.</span></div>}
        </div>
        <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={pageSize} onChange={setPage} />
      </section>
    </div>
  );
}
