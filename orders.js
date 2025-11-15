// orders.js
const ORDERS_KEY = "orders";
const COUNTER_KEY = "orderIdCounter";
const COUNTER_START = 8275;

// Charge les commandes depuis localStorage
export function loadOrders() {
  const raw = localStorage.getItem(ORDERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Unable to parse orders from localStorage", e);
    return [];
  }
}

// Sauvegarde la liste complète
export function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

// Ajoute une commande et la sauvegarde
export function addOrder(order) {
  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);
  return order;
}

// Supprime une commande par id
export function deleteOrderById(id) {
  let orders = loadOrders();
  orders = orders.filter(o => o.id !== id);
  saveOrders(orders);
}

// Initialise le compteur d’ID si besoin
export function initOrderIdCounter() {
  if (!localStorage.getItem(COUNTER_KEY)) {
    localStorage.setItem(COUNTER_KEY, String(COUNTER_START));
  }
}

// Retourne un nouvel ID unique
export function getNextOrderId() {
  initOrderIdCounter();
  const current = Number(localStorage.getItem(COUNTER_KEY));
  const safeCurrent = Number.isFinite(current) ? current : COUNTER_START;
  const next = safeCurrent + 1;
  localStorage.setItem(COUNTER_KEY, String(next));
  return next;
}

// Total des revenus
export function getTotalRevenue() {
  return loadOrders().reduce(
    (sum, o) => sum + Number(o.amount || 0),
    0
  );
}

// Nombre de clients uniques
export function getUniqueCustomersCount() {
  const names = loadOrders().map(o => (o.customer || "").toLowerCase().trim());
  return new Set(names).size;
}
export function seedDemoOrdersIfEmpty() {
  const existing = loadOrders();
  if (existing.length > 0) return;  // déjà des données → ne rien faire

  const today = new Date();
  const format = d => d.toISOString().slice(0, 10);

  const demoOrders = [
    {
      id: getNextOrderId(),
      customer: "Amal",
      product: "Laptop",
      amount: 1200,
      status: "Delivered",
      date: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)),
      avatar: "Amal"
    },
    {
      id: getNextOrderId(),
      customer: "Bedr",
      product: "Wireless Mouse",
      amount: 49,
      status: "Processing",
      date: format(today),
      avatar: "Bedr"
    },
    {
      id: getNextOrderId(),
      customer: "Chaima",
      product: "Headphones",
      amount: 89,
      status: "Pending",
      date: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)),
      avatar: "Chaima"
    },
    {
      id: getNextOrderId(),
      customer: "Ali",
      product: "Mechanical Keyboard",
      amount: 150,
      status: "Delivered",
      date: format(today),
      avatar: "Ali"
    },
    {
      id: getNextOrderId(),
      customer: "Emna",
      product: "Phone Case",
      amount: 25,
      status: "Cancelled",
      date: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5)),
      avatar: "Emna"
    },
    {
      id: getNextOrderId(),
      customer: "Firas",
      product: "Smartwatch",
      amount: 299,
      status: "Delivered",
      date: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)),
      avatar: "Firas"
    },
    {
      id: getNextOrderId(),
      customer: "Ghada",
      product: "USB-C Cable",
      amount: 15,
      status: "Pending",
      date: format(today),
      avatar: "Ghada"
    },
    {
      id: getNextOrderId(),
      customer: "Housem",
      product: "External SSD",
      amount: 180,
      status: "Processing",
      date: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4)),
      avatar: "Housem"
    }
  ];

  saveOrders(demoOrders);
  console.log("Demo orders inserted.");
}
