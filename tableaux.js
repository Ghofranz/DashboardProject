// tableaux.js
import {
  loadOrders,
  deleteOrderById,
} from "./orders.js";

const PAGE_SIZE = 5;      // 5 lignes par page
let currentPage = 1;

// état tri + filtres
let currentSort = { column: "id", direction: "desc" };
let currentSearch = "";
let currentStatus = "all";

// =====================
// Filtres + tri
// =====================
function getFilteredSortedOrders() {
  let orders = loadOrders().slice();

  // filtre texte
  if (currentSearch.trim() !== "") {
    const s = currentSearch.toLowerCase();
    orders = orders.filter(o => {
      const idStr    = String(o.id ?? "");
      const customer = (o.customer || "").toLowerCase();
      const product  = (o.product  || "").toLowerCase();
      return (
        idStr.includes(s) ||
        customer.includes(s) ||
        product.includes(s)
      );
    });
  }

  // filtre statut
  if (currentStatus !== "all") {
    orders = orders.filter(o => (o.status || "") === currentStatus);
  }

  // tri
  orders.sort((a, b) => {
    let valA = a[currentSort.column];
    let valB = b[currentSort.column];

    if (currentSort.column === "amount" || currentSort.column === "id") {
      valA = Number(valA || 0);
      valB = Number(valB || 0);
    } else if (currentSort.column === "date") {
      const dA = new Date(valA || 0);
      const dB = new Date(valB || 0);
      valA = dA.getTime();
      valB = dB.getTime();
    } else {
      valA = (valA || "").toString().toLowerCase();
      valB = (valB || "").toString().toLowerCase();
    }

    if (valA < valB) return currentSort.direction === "asc" ? -1 : 1;
    if (valA > valB) return currentSort.direction === "asc" ? 1 : -1;
    return 0;
  });

  return orders;
}

// =====================
// Pagination
// =====================
function getPagedOrders() {
  const all = getFilteredSortedOrders();
  const totalItems = all.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex   = startIndex + PAGE_SIZE;
  const pageItems  = all.slice(startIndex, endIndex);

  return {
    pageItems,
    totalItems,
    totalPages,
    startIndex,
    endIndex: Math.min(endIndex, totalItems),
  };
}

// =====================
// Rendu du tableau
// =====================
function renderTable() {
  const tbody = document.getElementById("ordersTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  const {
    pageItems,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
  } = getPagedOrders();

  pageItems.forEach(order => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="checkbox" style="width:16px; height:16px; cursor:pointer;"></td>
      <td><strong>#${order.id}</strong></td>
      <td>
        <div style="display:flex; align-items:center;">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=${order.avatar || order.customer || "User"}"
            alt="Avatar"
            class="avatar"
          >
          <span style="font-weight:600; margin-left:8px;">${order.customer || "Unknown"}</span>
        </div>
      </td>
      <td>${order.product || "—"}</td>
      <td><strong>$${Number(order.amount || 0).toLocaleString()}</strong></td>
      <td>
        <span class="status-badge status-${String(order.status || "Pending").toLowerCase()}">
          ${order.status || "Pending"}
        </span>
      </td>
      <td>${order.date || "—"}</td>
      <td>
        <button class="action-btn view" title="View">👁️</button>
        <button class="action-btn edit" title="Edit">✏️</button>
        <button class="action-btn delete" title="Delete" data-id="${order.id}">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  attachRowEvents();
  renderPagination(totalItems, totalPages, startIndex, endIndex);
}

// =====================
// Click sur les lignes
// =====================
function attachRowEvents() {
  const deleteButtons = document.querySelectorAll(".action-btn.delete");

  deleteButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      if (!Number.isFinite(id)) return;

      if (confirm(`Delete order #${id} ?`)) {
        deleteOrderById(id);
        renderTable();
      }
    });
  });
  // EDIT BUTTON
  document.querySelectorAll(".action-btn.edit").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.closest("td").querySelector(".delete")?.dataset.id || btn.dataset.id);
      openEditModal(id);
    });
  });
}
// =============================
// EDIT MODAL LOGIC
// =============================

let editOrderId = null;

function openEditModal(id) {
  const orders = loadOrders();
  const order = orders.find(o => o.id === id);
  if (!order) return;

  editOrderId = id;

  document.getElementById("editCustomer").value = order.customer;
  document.getElementById("editProduct").value = order.product;
  document.getElementById("editAmount").value = order.amount;
  document.getElementById("editStatus").value = order.status;
  document.getElementById("editDate").value = order.date;

  document.getElementById("editOrderModal").style.display = "flex";
}

function closeEditModal() {
  document.getElementById("editOrderModal").style.display = "none";
}

// Save
document.getElementById("saveEdit").addEventListener("click", () => {
  const orders = loadOrders();
  const index = orders.findIndex(o => o.id === editOrderId);
  if (index === -1) return;

  orders[index].customer = document.getElementById("editCustomer").value;
  orders[index].product  = document.getElementById("editProduct").value;
  orders[index].amount   = Number(document.getElementById("editAmount").value);
  orders[index].status   = document.getElementById("editStatus").value;
  orders[index].date     = document.getElementById("editDate").value;

  localStorage.setItem("orders", JSON.stringify(orders));

  closeEditModal();
  renderTable();
});

// Cancel
document.getElementById("cancelEdit").addEventListener("click", closeEditModal);


// =====================
// Rendu pagination
// =====================
function renderPagination(totalItems, totalPages, startIndex, endIndex) {
  const info           = document.getElementById("rowsInfo");
  const prevBtn        = document.getElementById("prevPage");
  const nextBtn        = document.getElementById("nextPage");
  const pagesContainer = document.getElementById("paginationPages");

  // texte "Showing x–y of z"
  if (info) {
    if (!totalItems) {
      info.textContent = "No orders to display";
    } else {
      info.textContent = `Showing ${startIndex + 1}–${endIndex} of ${totalItems}`;
    }
  }

  if (!prevBtn || !nextBtn || !pagesContainer) return;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages || totalPages === 0;

  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage -= 1;
      renderTable();
    }
  };

  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      renderTable();
    }
  };

  // boutons numérotés
  pagesContainer.innerHTML = "";

  for (let p = 1; p <= totalPages; p++) {
    const btn = document.createElement("button");
    btn.textContent = String(p);
    btn.className = "page-btn";
    if (p === currentPage) {
      btn.classList.add("active");
    }
    btn.addEventListener("click", () => {
      currentPage = p;
      renderTable();
    });
    pagesContainer.appendChild(btn);
  }
}

// =====================
// Filtres (search + status)
// =====================
function initFilters() {
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const filterBtn = document.getElementById("filterBtn");

  if (searchInput) {
    searchInput.addEventListener("input", e => {
      currentSearch = e.target.value || "";
      currentPage = 1;
      renderTable();
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", e => {
      currentStatus = e.target.value || "all";
      currentPage = 1;
      renderTable();
    });
  }

  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      currentPage = 1;
      renderTable();
    });
  }
}

// =====================
// Tri sur les <th>
// =====================
function initSorting() {
  const headers = document.querySelectorAll("thead th");

  headers.forEach((th, index) => {
    let column = null;

    if (index === 1) column = "id";
    else if (index === 2) column = "customer";
    else if (index === 3) column = "product";
    else if (index === 4) column = "amount";
    else if (index === 5) column = "status";
    else if (index === 6) column = "date";

    if (!column) return;

    th.style.cursor = "pointer";

    th.addEventListener("click", () => {
      if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
      } else {
        currentSort.column = column;
        currentSort.direction = "asc";
      }
      currentPage = 1;
      renderTable();
    });
  });
}

// =====================
// Init globale
// =====================
document.addEventListener("DOMContentLoaded", () => {
  initFilters();
  initSorting();
  renderTable();
});
