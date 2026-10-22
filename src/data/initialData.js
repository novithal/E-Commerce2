
export const initialProducts = [
  { id: "PRD-1001", name: "Wireless Headphones", category: "Electronics", price: 2499, stock: 48, status: "Active", sku: "ELE-001", description: "Wireless headphones with clear audio and comfortable ear cushions." },
  { id: "PRD-1002", name: "Smart Watch Pro", category: "Electronics", price: 4999, stock: 7, status: "Active", sku: "ELE-002", description: "Smart watch with activity tracking and notifications." },
  { id: "PRD-1003", name: "Classic Backpack", category: "Accessories", price: 1599, stock: 32, status: "Active", sku: "ACC-001", description: "Everyday backpack with practical storage." },
  { id: "PRD-1004", name: "Cotton T-Shirt", category: "Fashion", price: 699, stock: 0, status: "Inactive", sku: "FAS-001", description: "Soft cotton everyday T-shirt." },
  { id: "PRD-1005", name: "Running Shoes", category: "Fashion", price: 3299, stock: 15, status: "Active", sku: "FAS-002", description: "Lightweight running shoes for daily training." },
  { id: "PRD-1006", name: "Desk Lamp", category: "Home", price: 1199, stock: 5, status: "Active", sku: "HOM-001", description: "Compact desk lamp for home and office." },
  { id: "PRD-1007", name: "Ceramic Mug Set", category: "Home", price: 899, stock: 26, status: "Active", sku: "HOM-002", description: "A set of ceramic mugs for everyday use." },
  { id: "PRD-1008", name: "Travel Bottle", category: "Accessories", price: 549, stock: 18, status: "Active", sku: "ACC-002", description: "Reusable bottle designed for travel." },
  { id: "PRD-1009", name: "Bluetooth Speaker", category: "Electronics", price: 1899, stock: 3, status: "Active", sku: "ELE-003", description: "Portable Bluetooth speaker." },
  { id: "PRD-1010", name: "Leather Wallet", category: "Accessories", price: 999, stock: 21, status: "Active", sku: "ACC-003", description: "Slim wallet with multiple card slots." },
  { id: "PRD-1011", name: "Table Organizer", category: "Home", price: 799, stock: 12, status: "Active", sku: "HOM-003", description: "Organizer for desk accessories." },
  { id: "PRD-1012", name: "Sunglasses", category: "Fashion", price: 1299, stock: 9, status: "Active", sku: "FAS-003", description: "Everyday sunglasses with a lightweight frame." }
];

export const initialCustomers = [
  { id: "CUS-2001", name: "Aarav Kumar", email: "aarav@example.com", phone: "+91 98765 43210", city: "Chennai", status: "Active", orders: 8, spent: 18450 },
  { id: "CUS-2002", name: "Priya Sharma", email: "priya@example.com", phone: "+91 98765 43211", city: "Coimbatore", status: "Active", orders: 5, spent: 12600 },
  { id: "CUS-2003", name: "Rahul Raj", email: "rahul@example.com", phone: "+91 98765 43212", city: "Salem", status: "Active", orders: 3, spent: 7900 },
  { id: "CUS-2004", name: "Meera Devi", email: "meera@example.com", phone: "+91 98765 43213", city: "Madurai", status: "Inactive", orders: 2, spent: 3200 },
  { id: "CUS-2005", name: "Arjun Das", email: "arjun@example.com", phone: "+91 98765 43214", city: "Trichy", status: "Active", orders: 6, spent: 14700 },
  { id: "CUS-2006", name: "Kavya S", email: "kavya@example.com", phone: "+91 98765 43215", city: "Erode", status: "Active", orders: 4, spent: 8900 }
];

export const initialOrders = [
  { id: "ORD-3001", customerId: "CUS-2001", customer: "Aarav Kumar", date: "2026-10-20", items: 2, total: 7498, status: "Delivered", payment: "Paid" },
  { id: "ORD-3002", customerId: "CUS-2002", customer: "Priya Sharma", date: "2026-10-20", items: 1, total: 2499, status: "Processing", payment: "Paid" },
  { id: "ORD-3003", customerId: "CUS-2003", customer: "Rahul Raj", date: "2026-10-19", items: 3, total: 4597, status: "Pending", payment: "Pending" },
  { id: "ORD-3004", customerId: "CUS-2004", customer: "Meera Devi", date: "2026-10-18", items: 1, total: 3299, status: "Shipped", payment: "Paid" },
  { id: "ORD-3005", customerId: "CUS-2005", customer: "Arjun Das", date: "2026-10-17", items: 2, total: 3898, status: "Delivered", payment: "Paid" },
  { id: "ORD-3006", customerId: "CUS-2006", customer: "Kavya S", date: "2026-10-16", items: 1, total: 1199, status: "Cancelled", payment: "Refunded" },
  { id: "ORD-3007", customerId: "CUS-2001", customer: "Aarav Kumar", date: "2026-10-15", items: 2, total: 4598, status: "Processing", payment: "Paid" },
  { id: "ORD-3008", customerId: "CUS-2002", customer: "Priya Sharma", date: "2026-10-14", items: 1, total: 899, status: "Delivered", payment: "Paid" }
];

export const initialNotifications = [
  { id: "NOT-1", title: "Low stock alert", message: "Smart Watch Pro has only 7 units remaining.", type: "warning", date: "Just now", read: false, target: "/inventory" },
  { id: "NOT-2", title: "New order received", message: "Order ORD-3002 is ready for processing.", type: "order", date: "10 minutes ago", read: false, target: "/orders" },
  { id: "NOT-3", title: "Inventory needs attention", message: "Bluetooth Speaker stock is running low.", type: "warning", date: "1 hour ago", read: false, target: "/inventory" },
  { id: "NOT-4", title: "Order delivered", message: "Order ORD-3001 has been delivered.", type: "success", date: "Yesterday", read: true, target: "/orders" }
];

export const initialProfile = {
  name: "Admin User",
  email: "admin@commerceflow.com",
  phone: "+91 98765 43210",
  role: "Store Administrator",
  company: "CommerceFlow Store",
  city: "Salem, Tamil Nadu"
};
