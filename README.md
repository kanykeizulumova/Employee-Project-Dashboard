# Employee & Project Management Dashboard

deploy page https://kanykeizulumova.github.io/Employee-Project-Dashboard/

A high-performance, interactive web application designed for resource management and financial tracking. This dashboard allows businesses to manage employee assignments, project budgets, and track profitability across different time periods.

## 🚀 Features

### 📅 Data Persistence & Monthly Snapshots
- **Full Persistence:** All data is saved to `localStorage`, ensuring consistency across page refreshes.
- **Monthly Isolation:** Independent data snapshots for each month/year. Changes in one month do not affect others.
- **Seed Data:** Easily copy data from a previous month to a new one to save time on setup.

### 👥 Resource Management (CRUD)
- **Employee Management:** Create, update, and delete employee profiles. Includes automated age calculation and salary tracking.
- **Project Management:** Manage project portfolios with budget tracking and capacity requirements.

### ⚖️ Assignment Logic & Financials
- **Dynamic Assignments:** Assign employees to projects with adjustable **Capacity** and **Project Fit** coefficients.
- **Real-time Calculations:** 
  - **Effective Capacity:** Calculated based on assigned capacity, fit, and vacation days.
  - **Revenue & Cost Tracking:** Automatic revenue per employee/project and cost calculations (including the 0.5 minimum salary rule).
  - **Profitability:** Color-coded profit/loss indicators for projects and overall company health.

### 🔍 Advanced UI/UX
- **Smart Popups:** Context-aware popups for assignments and filters that dynamically reposition to stay within the viewport and follow scroll events.
- **Multi-Level Filtering:** Filter by any column with interactive "chips" and a "Clear All" functionality.
- **Sorting:** Ascending and descending sorting for all table columns with state-aware icons (↑ ↓ ⇅).
- **Availability Calendar:** Track employee vacations with real-time updates to effective capacity.

## 🛠 Tech Stack

- **Frontend:** Vanilla HTML5, CSS3 (Custom Variables & Modern Layouts), JavaScript (ES6+ Modules).
- **Architecture:** Module-based structure for clean separation of concerns.
- **Build Tools:** Webpack 5 for bundling and development server.
- **Persistence:** Browser LocalStorage.
- **Deployment:** GitHub Pages ready.

## 📦 How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npm start
   ```
   Open `http://localhost:8080` in your browser.

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

## 📝 Implementation Notes

- **Financial Formula:** The project uses the formula `Profit = Total Project Revenue - (Employee Costs + Bench Costs)` to provide a realistic view of company performance.
- **Smart Viewport Logic:** Popups use a custom calculation engine to detect screen edges and "flip" their position (e.g., opening above a button if there's no space below).
- **State Management:** The application state is centralized in a `state` object, allowing for synchronized updates across multiple UI components.

---
*Developed as part of the RS School Project Dashboard Task.*
