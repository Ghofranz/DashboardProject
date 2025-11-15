📊 Interactive Dashboard – HTML/CSS/JavaScript

A modern, responsive, and modular dashboard built entirely using HTML5, CSS3, and Vanilla JavaScript (ES Modules).
The application features dynamic data tables, real-time statistics powered by Chart.js, customizable settings, and persistent storage using LocalStorage — all without the need for a backend.

✨ Key Features
Dashboard

Real-time KPIs (revenue, users, clients)

“New Order” modal with automatic ID generation

Automatically updated recent activity feed

Clean, responsive UI with modern design patterns

Orders Tables

Full-text search

Status filtering

Column sorting (ID, customer, product, amount, date)

Pagination with dynamic page numbers

View, edit, and delete actions

Edit modal fully synchronized with LocalStorage

Statistics

Built with Chart.js

Weekly and monthly order analytics

Automatic refresh every 10 seconds

Doughnut, bar, and line charts

Settings

Theme selection (Dark / Light / Auto)

Accent color selector

Toggles for notifications, privacy, and security options

Password change UI component

Profile Page

User card with statistics

Editable personal information

Active projects list

Recent conversations display

🗄 Data Management (LocalStorage)

Persistent data storage is handled through orders.js, which provides:

loadOrders() – Retrieve existing orders

addOrder() – Add a new order

deleteOrderById() – Delete an order

getNextOrderId() – Generate unique incremental IDs

seedDemoOrdersIfEmpty() – Auto-seed demo data on first launch

This project requires no backend.

🧰 Technologies Used

HTML5 — structure

CSS3 — responsive design (flexbox & grid)

JavaScript (ES Modules) — logic & interactivity

Chart.js — graphical visualizations

LocalStorage API — persistent data

📸 Screenshots
<img width="100%" alt="Dashboard Screenshot" src="https://github.com/user-attachments/assets/fe0ab591-7eca-412d-93d4-bba77825891c" /> <img width="100%" alt="Tables Screenshot" src="https://github.com/user-attachments/assets/833f730a-3211-48ba-88ec-b7394d821684" /> <img width="100%" alt="Settings Screenshot" src="https://github.com/user-attachments/assets/b3bf268e-ab33-4b3b-ba78-f4a91ff706af" /><img width="100%" alt="Statistics Screenshot" src="https://github.com/user-attachments/assets/6a9a994d-a6cd-44c5-ac4b-cde29e8789b0" /> 
