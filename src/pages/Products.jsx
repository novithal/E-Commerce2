
import { useMemo, useState } from "react";
import { Eye, Pencil, Trash2, Plus, Package, ArrowUpDown } from "lucide-react";
import { useStore } from "../context/StoreContext";
import Modal from "../components/Modal";
import SearchFilter from "../components/SearchFilter";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import { formatCurrency } from "../utils/formatters";
import { validateProduct } from "../utils/validators";
import useDebounce from "../hooks/useDebounce";

const blankProduct = {
  name: "", sku: "", category: "Electronics", price: "", stock: "", status: "Active", description: ""
};

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, notify } = useStore();
  const [search, setSearch] = useState("");
  const query = useDebounce(search);
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blankProduct);
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);
  const pageSize = 6;

  const filtered = useMemo(() => {
    let rows = products.filter(p => {
      const matchesSearch = `${p.name} ${p.sku} ${p.id} ${p.category}`.toLowerCase().includes(query.toLowerCase());
      return matchesSearch && (category === "All" || p.category === category) &&
        (status === "All" || p.status === status);
    });

    rows.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "stock") return a.stock - b.stock;
      return b.id.localeCompare(a.id);
    });
    return rows;
  }, [products, query, category, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  function openAdd() {
    setForm(blankProduct);
    setErrors({});
    setModal({ type: "add" });
  }

  function openEdit(product) {
    setForm({ ...product });
    setErrors({});
    setModal({ type: "edit", product });
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validateProduct(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const duplicateSku = products.some(p =>
      p.sku.toLowerCase() === form.sku.trim().toLowerCase() &&
      p.id !== modal.product?.id
    );
    if (duplicateSku) {
      setErrors({ sku: "This SKU is already in use." });
      return;
    }

    if (modal.type === "add") addProduct(form);
    else updateProduct(modal.product.id, form);

    setModal(null);
    setPage(1);
  }

  function removeProduct() {
    if (confirmDelete) {
      deleteProduct(confirmDelete.id);
      setConfirmDelete(null);
    }
  }

  return (
    <div className="page-content">
      <div className="page-heading">
        <div><span className="eyebrow">CATALOGUE</span><h2>Products</h2><p>Add, update and manage all products in your store.</p></div>
        <button className="button button-primary" onClick={openAdd}><Plus size={16} /> Add product</button>
      </div>

      <div className="metrics-grid compact-metrics">
        <div className="metric-card"><div className="metric-top">Total products <span className="metric-icon purple"><Package size={18} /></span></div><div className="metric-value">{products.length}</div><div className="metric-foot">In your catalogue</div></div>
        <div className="metric-card"><div className="metric-top">Active products <span className="metric-icon green"><Package size={18} /></span></div><div className="metric-value">{products.filter(p => p.status === "Active").length}</div><div className="metric-foot">Available in store</div></div>
        <div className="metric-card"><div className="metric-top">Low stock <span className="metric-icon orange"><Package size={18} /></span></div><div className="metric-value">{products.filter(p => p.stock > 0 && p.stock <= 10).length}</div><div className="metric-foot">10 units or fewer</div></div>
        <div className="metric-card"><div className="metric-top">Out of stock <span className="metric-icon blue"><Package size={18} /></span></div><div className="metric-value">{products.filter(p => p.stock === 0).length}</div><div className="metric-foot">Needs replenishment</div></div>
      </div>

      <section className="panel table-panel">
        <div className="panel-heading"><div><h3>Product catalogue</h3><p>Search, filter and manage product records.</p></div><span className="count-pill">{filtered.length}</span></div>
        <SearchFilter
          search={search}
          onSearch={value => { setSearch(value); setPage(1); }}
          filters={[
            { label: "Category", value: category, onChange: value => { setCategory(value); setPage(1); }, options: [{ label: "All categories", value: "All" }, ...["Electronics", "Accessories", "Fashion", "Home"].map(v => ({ label: v, value: v }))] },
            { label: "Status", value: status, onChange: value => { setStatus(value); setPage(1); }, options: [{ label: "All statuses", value: "All" }, { label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }] },
            { label: "Sort products", value: sort, onChange: value => { setSort(value); setPage(1); }, options: [{ label: "Newest", value: "newest" }, { label: "Name A–Z", value: "name" }, { label: "Price low–high", value: "price-asc" }, { label: "Price high–low", value: "price-desc" }, { label: "Stock low–high", value: "stock" }] }
          ]}
          extra={<ArrowUpDown size={14} color="#929cad" />}
        />

        <div className="table-scroll">
          <table>
            <thead><tr><th>PRODUCT</th><th>SKU</th><th>CATEGORY</th><th>PRICE</th><th>STOCK</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
            <tbody>
              {rows.map(product => (
                <tr key={product.id}>
                  <td><div className="product-cell"><div className="product-thumb"><Package size={18} /></div><div><strong>{product.name}</strong><small>{product.id}</small></div></div></td>
                  <td>{product.sku}</td><td>{product.category}</td>
                  <td className="amount-cell">{formatCurrency(product.price)}</td>
                  <td><span className={product.stock === 0 ? "stock-out" : product.stock <= 10 ? "stock-low" : "stock-number"}>{product.stock}</span></td>
                  <td><StatusBadge status={product.status} /></td>
                  <td><div className="action-buttons">
                    <button className="icon-button" title="View product" aria-label={`View ${product.name}`} onClick={() => setModal({ type: "view", product })}><Eye size={15} /></button>
                    <button className="icon-button" title="Edit product" aria-label={`Edit ${product.name}`} onClick={() => openEdit(product)}><Pencil size={15} /></button>
                    <button className="icon-button delete-icon" title="Delete product" aria-label={`Delete ${product.name}`} onClick={() => setConfirmDelete(product)}><Trash2 size={15} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <div className="empty-state"><Package size={30} /><strong>No products found</strong><span>Try changing the search or filters, or add a new product.</span><button className="button button-primary" onClick={openAdd}><Plus size={14} /> Add product</button></div>}
        </div>
        <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={pageSize} onChange={setPage} />
      </section>

      {modal && (
        <Modal title={modal.type === "add" ? "Add product" : modal.type === "edit" ? "Edit product" : "Product details"} subtitle="Manage the product information." onClose={() => setModal(null)}>
          {modal.type === "view" ? (
            <div className="detail-body">
              <div className="product-detail-heading"><div className="product-detail-thumb"><Package size={24} /></div><div><h3>{modal.product.name}</h3><span>{modal.product.id}</span></div><StatusBadge status={modal.product.status} /></div>
              {[["SKU", modal.product.sku], ["Category", modal.product.category], ["Price", formatCurrency(modal.product.price)], ["Stock", modal.product.stock], ["Description", modal.product.description || "No description provided."]].map(([label, value]) => <div className={`detail-row ${label === "Description" ? "detail-description" : ""}`} key={label}><span>{label}</span>{label === "Description" ? <p>{value}</p> : <strong>{value}</strong>}</div>)}
              <div className="modal-actions"><button className="button button-secondary" onClick={() => setModal(null)}>Close</button><button className="button button-primary" onClick={() => openEdit(modal.product)}><Pencil size={14} /> Edit product</button></div>
            </div>
          ) : (
            <form className="form-body" onSubmit={submit} noValidate>
              <div className="form-grid">
                <label>Product name *<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter product name" />{errors.name && <small className="field-error">{errors.name}</small>}</label>
                <label>SKU *<input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="e.g. ELE-004" />{errors.sku && <small className="field-error">{errors.sku}</small>}</label>
                <label>Category *<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{["Electronics", "Accessories", "Fashion", "Home"].map(v => <option key={v}>{v}</option>)}</select>{errors.category && <small className="field-error">{errors.category}</small>}</label>
                <label>Price (₹) *<input type="number" min="0" step="1" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" />{errors.price && <small className="field-error">{errors.price}</small>}</label>
                <label>Stock quantity *<input type="number" min="0" step="1" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" />{errors.stock && <small className="field-error">{errors.stock}</small>}</label>
                <label>Status<select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select></label>
              </div>
              <label>Description<textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description (optional)" /></label>
              <div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="button button-primary">{modal.type === "add" ? "Create product" : "Save changes"}</button></div>
            </form>
          )}
        </Modal>
      )}

      {confirmDelete && (
        <Modal title="Delete product?" subtitle="This action cannot be undone." onClose={() => setConfirmDelete(null)}>
          <div className="confirmation-body">
            <div className="confirmation-warning"><Trash2 size={24} /></div>
            <p>Are you sure you want to delete <strong>{confirmDelete.name}</strong>?</p>
            <p>The product will be removed from your catalogue and inventory.</p>
            <div className="modal-actions"><button className="button button-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button><button className="button button-danger" onClick={removeProduct}><Trash2 size={14} /> Delete product</button></div>
          </div>
        </Modal>
      )}
    </div>
  );
}
