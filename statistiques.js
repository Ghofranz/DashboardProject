import { loadOrders, getTotalRevenue } from "./orders.js";


const chartColors = {
  primary: "#667eea",
  blue: "#11cdef",
  green: "#2dce89",
  orange: "#fb6340",
  yellow: "#ffd600",
};
function updateHeaderStats() {
  const orders = loadOrders();
  const totalRevenue = getTotalRevenue();
  const revenueEl = document.getElementById("statsRevenueValue");
  const avgOrderEl = document.getElementById("statsAvgOrderValue");

  if (revenueEl) {
    revenueEl.textContent = "$" + totalRevenue.toLocaleString();
  }

  if (avgOrderEl) {
    const count = orders.length;
    const avg = count > 0 ? totalRevenue / count : 0;
    // on arrondit à 2 décimales
    avgOrderEl.textContent = "$" + avg.toFixed(2);
  }
}

// =========================
// Static charts
// =========================

function initStaticRevenueChart() {
  const revenueCtx = document.getElementById("revenueChart");
  if (!revenueCtx) return;

  new Chart(revenueCtx.getContext("2d"), {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Revenue ($)",
          data: [30000, 35000, 32000, 40000, 38000, 45890],
          borderColor: chartColors.primary,
          backgroundColor: "rgba(102, 126, 234, 0.1)",
          tension: 0.4,
          fill: true,
          borderWidth: 3,
          pointRadius: 5,
          pointBackgroundColor: "#fff",
          pointBorderColor: chartColors.primary,
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: chartColors.primary,
          borderWidth: 1,
          callbacks: {
            label: ctx => "$" + ctx.parsed.y.toLocaleString(),
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#67748e",
            font: { size: 12 },
            callback: value => "$" + value / 1000 + "k",
          },
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
            drawBorder: false,
          },
        },
        x: {
          ticks: { color: "#67748e", font: { size: 12 } },
          grid: { display: false },
        },
      },
    },
  });
}

function initStaticUsersChart() {
  const usersCtx = document.getElementById("usersChart");
  if (!usersCtx) return;

  new Chart(usersCtx.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Users",
          data: [8500, 9200, 10100, 11000, 11800, 12543],
          backgroundColor: chartColors.blue,
          borderRadius: 8,
          barThickness: 40,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: chartColors.blue,
          borderWidth: 1,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#67748e", font: { size: 12 } },
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
            drawBorder: false,
          },
        },
        x: {
          ticks: { color: "#67748e", font: { size: 12 } },
          grid: { display: false },
        },
      },
    },
  });
}

// =========================
// Helpers dates
// =========================

function parseOrderDate(order) {
  if (!order.date) return null;
  const d = new Date(order.date);
  if (isNaN(d.getTime())) return null;
  return d;
}

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();        // 0 = Sunday
  const diff = (day + 6) % 7;    // 0 → Monday, 6 → Sunday
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// =========================
// Dynamic data aggregations
// =========================

function computeStatusCounts(orders) {
  const map = { Delivered: 0, Processing: 0, Pending: 0, Cancelled: 0 };

  orders.forEach(o => {
    const s = o.status || "Pending";
    if (map[s] !== undefined) {
      map[s]++;
    }
  });

  const labels = Object.keys(map);
  const data = Object.values(map);

  // si pas de données, on évite un donut vide
  const total = data.reduce((s, v) => s + v, 0);
  if (total === 0) {
    return {
      labels: ["No orders"],
      data: [1],
    };
  }

  return { labels, data };
}


function computeOrdersThisWeek(orders) {
  const now = new Date();
  const weekStart = getStartOfWeek(now);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts = [0, 0, 0, 0, 0, 0, 0];

  orders.forEach(o => {
    const d = parseOrderDate(o);
    if (!d) return;

    // seulement la semaine courante
    const diffDays = Math.floor((d - weekStart) / (1000 * 60 * 60 * 24));
    if (diffDays < 0 || diffDays > 6) return;

    const weekday = (d.getDay() + 6) % 7; // 0 = Mon ... 6 = Sun
    counts[weekday] += 1;
  });

  return { labels, data: counts };
}

function computeOrdersThisMonth(orders) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0–11

  // nombre de jours dans le mois
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const labels = [];
  const counts = new Array(daysInMonth).fill(0);

  for (let i = 1; i <= daysInMonth; i++) {
    labels.push(String(i));
  }

  orders.forEach(o => {
    const d = parseOrderDate(o);
    if (!d) return;
    if (d.getFullYear() !== year || d.getMonth() !== month) return;

    const day = d.getDate(); // 1–31
    counts[day - 1] += 1;
  });

  return { labels, data: counts };
}

// =========================
// Dynamic charts
// =========================

let categoriesChart = null;
let ordersWeekChart = null;
let usersMonthChart = null;

function initCategoriesChart() {
  const ctx = document.getElementById("categoriesChart");
  if (!ctx) return;

  const orders = loadOrders();
  const { labels, data } = computeStatusCounts(orders);

  categoriesChart = new Chart(ctx.getContext("2d"), {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            chartColors.green,   // Delivered
            chartColors.blue,    // Processing
            chartColors.yellow,  // Pending
            chartColors.orange,  // Cancelled
          ],
          borderWidth: 0,
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#252f40",
            font: { size: 13, weight: "600" },
            padding: 15,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleColor: "#fff",
          bodyColor: "#fff",
          callbacks: {
            label: ctx => `${ctx.label}: ${ctx.parsed} orders`,
          },
        },
      },
    },
  });
}


function refreshCategoriesChart() {
  if (!categoriesChart) return;

  const orders = loadOrders();
  const { labels, data } = computeStatusCounts(orders);

  categoriesChart.data.labels = labels;
  categoriesChart.data.datasets[0].data = data;
  categoriesChart.update();
}


function initOrdersWeekChart() {
  const ctx = document.getElementById("ordersWeekChart");
  if (!ctx) return;

  const { labels, data } = computeOrdersThisWeek(loadOrders());

  ordersWeekChart = new Chart(ctx.getContext("2d"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Orders",
          data,
          backgroundColor: chartColors.green,
          borderRadius: 6,
          barThickness: 32,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          padding: 10,
          titleColor: "#fff",
          bodyColor: "#fff",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#67748e", font: { size: 12 } },
          grid: {
            color: "rgba(0,0,0,0.05)",
            drawBorder: false,
          },
        },
        x: {
          ticks: { color: "#67748e", font: { size: 12 } },
          grid: { display: false },
        },
      },
    },
  });
}

function refreshOrdersWeekChart() {
  if (!ordersWeekChart) return;
  const { labels, data } = computeOrdersThisWeek(loadOrders());
  ordersWeekChart.data.labels = labels;
  ordersWeekChart.data.datasets[0].data = data;
  ordersWeekChart.update();
}

function initUsersMonthChart() {
  const ctx = document.getElementById("usersMonthChart");
  if (!ctx) return;

  const { labels, data } = computeOrdersThisMonth(loadOrders());

  usersMonthChart = new Chart(ctx.getContext("2d"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Orders per day",
          data,
          borderColor: chartColors.orange,
          backgroundColor: "rgba(251,99,64,0.15)",
          fill: true,
          tension: 0.25,
          borderWidth: 2,
          pointRadius: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(0,0,0,0.8)",
          padding: 10,
          titleColor: "#fff",
          bodyColor: "#fff",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#67748e", font: { size: 12 } },
          grid: {
            color: "rgba(0,0,0,0.05)",
            drawBorder: false,
          },
        },
        x: {
          ticks: { color: "#67748e", font: { size: 11 } },
          grid: { display: false },
        },
      },
    },
  });
}

function refreshUsersMonthChart() {
  if (!usersMonthChart) return;
  const { labels, data } = computeOrdersThisMonth(loadOrders());
  usersMonthChart.data.labels = labels;
  usersMonthChart.data.datasets[0].data = data;
  usersMonthChart.update();
}

// =========================
// INIT + AUTO REFRESH
// =========================

document.addEventListener("DOMContentLoaded", () => {
  // static
  initStaticRevenueChart();
  initStaticUsersChart();

  // dynamic
  initCategoriesChart();
  initOrdersWeekChart();
  initUsersMonthChart();

  // header stats (revenue + avg order)
  updateHeaderStats();

  // refresh dynamique toutes les 10 s
  setInterval(() => {
     updateHeaderStats(); 
    refreshCategoriesChart();
    refreshOrdersWeekChart();
    refreshUsersMonthChart();
  }, 10000);
});
