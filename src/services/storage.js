
import {
  initialProducts,
  initialCustomers,
  initialOrders,
  initialNotifications,
  initialProfile
} from "../data/initialData";

const KEY = "commerceflow_dashboard_v1";

function createInitialState() {
  return {
    products: initialProducts,
    customers: initialCustomers,
    orders: initialOrders,
    notifications: initialNotifications,
    profile: initialProfile
  };
}

export function loadStore() {
  try {
    const saved = localStorage.getItem(KEY);
    if (!saved) return createInitialState();

    const parsed = JSON.parse(saved);
    const initial = createInitialState();

    return {
      products: Array.isArray(parsed.products) ? parsed.products : initial.products,
      customers: Array.isArray(parsed.customers) ? parsed.customers : initial.customers,
      orders: Array.isArray(parsed.orders) ? parsed.orders : initial.orders,
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : initial.notifications,
      profile: parsed.profile && typeof parsed.profile === "object" ? parsed.profile : initial.profile
    };
  } catch (error) {
    console.error("Unable to load saved dashboard data:", error);
    return createInitialState();
  }
}

export function saveStore(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error("Unable to save dashboard data:", error);
    return false;
  }
}

export function resetStore() {
  const initial = createInitialState();
  saveStore(initial);
  return initial;
}
