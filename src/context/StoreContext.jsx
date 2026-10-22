
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { loadStore, saveStore } from "../services/storage";
import { makeId } from "../utils/formatters";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [store, setStore] = useState(loadStore);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = saveStore(store);
    if (!saved) {
      setToast({
        id: Date.now(),
        type: "error",
        message: "Could not save changes. Check browser storage."
      });
    }
  }, [store]);

  const notify = useCallback((message, type = "success") => {
    setToast({ id: Date.now(), type, message });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 650));
      setStore(current => ({ ...current }));
      notify("Dashboard refreshed successfully.");
    } catch {
      notify("Refresh failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  const addProduct = useCallback((values) => {
    const product = {
      ...values,
      id: makeId("PRD"),
      price: Number(values.price),
      stock: Number(values.stock),
      status: values.status || "Active",
      sku: values.sku.trim(),
      name: values.name.trim()
    };

    setStore(current => ({ ...current, products: [product, ...current.products] }));
    notify("Product added successfully.");
    return product;
  }, [notify]);

  const updateProduct = useCallback((id, values) => {
    setStore(current => ({
      ...current,
      products: current.products.map(item =>
        item.id === id
          ? { ...item, ...values, price: Number(values.price), stock: Number(values.stock) }
          : item
      )
    }));
    notify("Product updated successfully.");
  }, [notify]);

  const deleteProduct = useCallback((id) => {
    const product = store.products.find(item => item.id === id);
    if (!product) return false;

    setStore(current => ({
      ...current,
      products: current.products.filter(item => item.id !== id)
    }));
    notify(`${product.name} deleted successfully.`);
    return true;
  }, [store.products, notify]);

  const updateStock = useCallback((id, stock) => {
    const quantity = Number(stock);

    if (!Number.isInteger(quantity) || quantity < 0) {
      notify("Stock must be a whole number of 0 or more.", "error");
      return false;
    }

    setStore(current => ({
      ...current,
      products: current.products.map(item =>
        item.id === id ? { ...item, stock: quantity } : item
      )
    }));
    notify("Inventory stock updated.");
    return true;
  }, [notify]);

  const updateOrderStatus = useCallback((id, status) => {
    const allowed = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!allowed.includes(status)) {
      notify("Invalid order status.", "error");
      return;
    }

    setStore(current => ({
      ...current,
      orders: current.orders.map(order =>
        order.id === id ? { ...order, status } : order
      )
    }));
    notify(`Order ${id} updated to ${status}.`);
  }, [notify]);

  const updateCustomer = useCallback((id, values) => {
    setStore(current => ({
      ...current,
      customers: current.customers.map(customer =>
        customer.id === id ? { ...customer, ...values } : customer
      )
    }));
    notify("Customer details updated.");
  }, [notify]);

  const updateProfile = useCallback((values) => {
    setStore(current => ({ ...current, profile: { ...current.profile, ...values } }));
    notify("Profile saved successfully.");
  }, [notify]);

  const markNotificationRead = useCallback((id) => {
    setStore(current => ({
      ...current,
      notifications: current.notifications.map(item =>
        item.id === id ? { ...item, read: true } : item
      )
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setStore(current => ({
      ...current,
      notifications: current.notifications.map(item => ({ ...item, read: true }))
    }));
    notify("All notifications marked as read.");
  }, [notify]);

  const value = useMemo(() => ({
    ...store,
    toast,
    loading,
    notify,
    dismissToast,
    refreshDashboard,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    updateOrderStatus,
    updateCustomer,
    updateProfile,
    markNotificationRead,
    markAllNotificationsRead
  }), [
    store, toast, loading, notify, dismissToast, refreshDashboard,
    addProduct, updateProduct, deleteProduct, updateStock,
    updateOrderStatus, updateCustomer, updateProfile,
    markNotificationRead, markAllNotificationsRead
  ]);

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
