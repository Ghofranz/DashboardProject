// dashboard.js
import {
  loadOrders,
  addOrder,
  initOrderIdCounter,
  getNextOrderId,
  getTotalRevenue,
  getUniqueCustomersCount,
  seedDemoOrdersIfEmpty
} from "./orders.js";

// Met à jour les cartes du haut + la première activité
function updateDashboard() {
  const orders = loadOrders();
  if (!orders.length) {
    return;
  }

  const lastOrder = orders[orders.length - 1];

  // 1) Carte "TODAY'S MONEY" = somme des montants
  const moneyCardValue = document.querySelector(
    ".stats-grid .stat-card:nth-child(1) .stat-value"
  );
  if (moneyCardValue) {
    const total = getTotalRevenue();
    moneyCardValue.textContent = "$" + total.toLocaleString();
  }

  // 2) Carte "TODAY'S USERS" = nombre de commandes (simple pour l'instant)
  const ordersCardValue = document.querySelector(
    ".stats-grid .stat-card:nth-child(2) .stat-value"
  );
  if (ordersCardValue) {
    ordersCardValue.textContent = orders.length.toLocaleString();
  }

  // 3) Carte "NEW CLIENTS" = nombre de clients uniques
  const newClientsValue = document.querySelector(
    ".stats-grid .stat-card:nth-child(3) .stat-value"
  );
  if (newClientsValue) {
    const nbClients = getUniqueCustomersCount();
    newClientsValue.textContent = "+" + nbClients.toLocaleString();
  }

  // 4) Bloc "Recent Activity" – première ligne
  const activityTitle = document.querySelector(
    ".activity-list .activity-item .activity-title"
  );
  const activityAmount = document.querySelector(
    ".activity-list .activity-item .activity-amount"
  );

  if (activityTitle) {
    activityTitle.textContent = `New order #${lastOrder.id}`;
  }
  if (activityAmount) {
    const amount = Number(lastOrder.amount || 0);
    activityAmount.textContent = `+$${amount.toLocaleString()}`;
  }
}

// Gère le modal "New Order" et l’ajout d’une commande
function initNewOrderModal() {
  const newOrderBtn = document.getElementById("newOrderBtn");
  const newOrderModal = document.getElementById("newOrderModal");
  const cancelOrder = document.getElementById("cancelOrder");
  const addOrderBtn = document.getElementById("addOrder");

  if (!newOrderBtn || !newOrderModal || !cancelOrder || !addOrderBtn) {
    return;
  }

  newOrderBtn.addEventListener("click", () => {
    newOrderModal.style.display = "flex";
  });

  cancelOrder.addEventListener("click", () => {
    newOrderModal.style.display = "none";
  });

  addOrderBtn.addEventListener("click", () => {
    const customerInput = document.getElementById("orderCustomer");
    const productInput = document.getElementById("orderProduct");
    const amountInput = document.getElementById("orderAmount");
    const statusSelect = document.getElementById("orderStatus");
    const dateInput = document.getElementById("orderDate");

    const customer = (customerInput?.value || "").trim();
    const product = (productInput?.value || "").trim();
    const amount = parseFloat(amountInput?.value || "0") || 0;
    const status = statusSelect?.value || "Pending";
    const date =
      dateInput?.value || new Date().toISOString().slice(0, 10); // yyyy-mm-dd

    const newOrder = {
      id: getNextOrderId(),
      customer: customer || "Unknown",
      product: product || "Unknown product",
      amount: amount,
      status: status,
      date: date,
      avatar: (customer || "User").replace(/\s+/g, "_"),
    };

    addOrder(newOrder);

    newOrderModal.style.display = "none";
    updateDashboard();

    // Reset du formulaire (optionnel)
    if (customerInput) customerInput.value = "";
    if (productInput) productInput.value = "";
    if (amountInput) amountInput.value = "";
    if (statusSelect) statusSelect.value = "Pending";
    if (dateInput) dateInput.value = "";
  });
}

// Initialisation générale du dashboard
document.addEventListener("DOMContentLoaded", () => {
  initOrderIdCounter();  // s’assure que le compteur existe
  seedDemoOrdersIfEmpty();
  updateDashboard();     // met à jour les cartes au chargement
  initNewOrderModal();   // branche le modal "New Order"
});
