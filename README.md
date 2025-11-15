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
<img width="1842" height="951" alt="image" src="https://github.com/user-attachments/assets/3b947831-c33f-4b70-942a-907fc56efa12" />
<img width="1839" height="949" alt="image" src="https://github.com/user-attachments/assets/a61c0cf0-6f5b-4ffd-a412-ae5cca1b6ab0" />
<img width="1841" height="948" alt="image" src="https://github.com/user-attachments/assets/e626e8f7-cd90-4038-83f6-df537061d671" />
<img width="1396" height="933" alt="image" src="https://github.com/user-attachments/assets/e7759df4-dd9e-4b3a-8c06-300e055d1a26" />




