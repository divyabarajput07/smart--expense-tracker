# Smart Expense Tracker 💰

A smart, responsive, and secure personal finance web application built using pure Vanilla JavaScript, HTML5, and CSS3. This application helps users set a monthly budget, track real-time expenses with strict data validation, search transactions, and manage financial logs completely offline.

## 🚀 Live Demo
[https://divyabarajput07.github.io/smart--expense-tracker/]

---

## ✨ Features

*   **Financial Scoreboard Dashboard:** Real-time dynamic calculation of Total Budget, Total Expenses, and Available Balance.
*   **Strict Data Validation:** Prevents form submission errors by blocking empty strings, invalid characters, or negative expense amounts.
*   **Full CRUD Functionality:** Allows users to easily Add, Delete, and Edit transactions with seamless input form auto-population.
*   **Real-time Lookup Search:** Instant filtering system to search expenses dynamically by title or category.
*   **Smart Overspending Alert:** Automatically triggers a visual danger theme and shaking animation on the balance card when the budget is exhausted.
*   **Persistent Storage:** Uses Web Storage API (`LocalStorage`) to preserve financial logs across page refreshes.
*   **Persistent Dark Mode:** Includes a smooth theme switcher toggling between light and dark modes that stays saved for future sessions.

---

## 🛠️ Tech Stack

*   **Frontend Structure:** HTML5
*   **Styling & Animations:** CSS3 (Custom Variables, Flexbox, Keyframes)
*   **Logic & State Management:** Vanilla JavaScript (ES6+, LocalStorage, DOM Manipulation)

---

## 📂 Project Structure

```text
├── index.html       # Application layout and UI structure
├── style.css        # Responsive styling and dark mode configuration
└── app.js           # Core business logic, calculations, and state tracking
```

---

## 🧩 How to Run This Project Locally

1. Clone this repository to your local system:
   ```bash
   git clone https://github.com
   ```
2. Navigate to the project directory.
3. Open the `index.html` file in any modern web browser (Chrome, Edge, Safari).
4. **No internet connection or external servers required!**

---

## 💡 Interview Core Concepts Covered

This project demonstrates strong foundational skills in Frontend Web Development, specifically:
*   Advanced DOM Manipulation & Event Handling
*   State synchronization with Browser `LocalStorage`
*   Data Validation and Input Sanitization (`.trim()`, `isNaN()`)
*   Array Methods logic manipulation (`.filter()`, `.map()`, `.reduce()`)
*   Clean CSS transition flows and dynamic class toggling
*
