// ==================== LOCAL STORAGE (loading data) ====================
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Loading total budget into LocalStorage 
const localStorageBudget = localStorage.getItem('totalBudget');
let totalBudget = localStorageBudget !== null ? Number(localStorageBudget) : 0;

// 1. To access HTML elements
const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseDateInput = document.getElementById('expense-date');
const expenseCategoryInput = document.getElementById('expense-category');
const expenseList = document.getElementById('expense-list');
const filterCategory = document.getElementById('filter-category');

const totalBudgetEl = document.getElementById('total-budget');
const totalExpenseEl = document.getElementById('total-expense');
const availableBalanceEl = document.getElementById('available-balance');

const budgetInput = document.getElementById('budget-input');
const setBudgetBtn = document.getElementById('set-budget-btn');

// ==================== When the user sets a budget ====================
if (setBudgetBtn) {
    setBudgetBtn.addEventListener('click', function() {
        const enteredBudget = Number(budgetInput.value);
        if (enteredBudget > 0) {
            totalBudget = enteredBudget;
            localStorage.setItem('totalBudget', totalBudget);
            updateValues();
            budgetInput.value = '';
        } else {
            alert('Please add the correct budget!');
        }
    });
}

// ==================== Improved function: Showing a list on the screen (With delete button) ====================
function addExpenseToDOM(transaction) {
    const li = document.createElement('li');
    li.classList.add('expense-item');
    li.setAttribute('data-category', transaction.category); 
    
    // Here We have added a delete (❌) button inside the list and given it an onclick event
    li.innerHTML = `
        <div>
            <strong>${transaction.name}</strong> (${transaction.category}) <br>
            <small style="color: #666;">📅 ${transaction.date}</small>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
            <span>₹ ${transaction.amount}</span>
            <button onclick="deleteExpense(${transaction.id})" style="background-color: #e74c3c; color: white; border: none; padding: 5px 8px; border-radius: 3px; cursor: pointer; font-weight: bold;">❌</button>
        </div>
    `;
    expenseList.appendChild(li);
}

// ==================== New function: To delete expense ====================
function deleteExpense(id) {
    // This method filters out the expense with the given ID and keeps the rest in the array
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    // Update LocalStorage and refresh the display on the screen
    updateLocalStorage();
    init(); 
}

// ==================== Live Calculation (Budget & Expenses) ====================
function updateValues() {
    const totalExpense = transactions.reduce((acc, item) => acc + item.amount, 0);
    const remainingBalance = totalBudget - totalExpense;

    totalBudgetEl.innerText = `₹ ${totalBudget}`;
    totalExpenseEl.innerText = `₹ ${totalExpense}`;
    availableBalanceEl.innerText = `₹ ${remainingBalance}`;

    if (remainingBalance <= 0 && totalBudget > 0) {
        availableBalanceEl.parentElement.classList.add('balance-alert');
    } else {
        availableBalanceEl.parentElement.classList.remove('balance-alert');
    }
}

// 3. When the user submits the "Add Expense" form
expenseForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = expenseNameInput.value;
    const amount = Number(expenseAmountInput.value);
    const date = expenseDateInput.value;
    const category = expenseCategoryInput.value;

    // Assigning a unique ID (using Date.now()) to every new expense
    const newTransaction = {
        id: Date.now(), 
        name: name,
        amount: amount,
        date: date,
        category: category
    };

    transactions.push(newTransaction);

    addExpenseToDOM(newTransaction);
    updateValues();
    updateLocalStorage();

    expenseForm.reset();
    filterCategory.value = 'All';
    showAllExpenses();
});

// 5. Logic for category filter change
filterCategory.addEventListener('change', function() {
    const selectedCategory = filterCategory.value;
    const items = expenseList.getElementsByClassName('expense-item');

    for (let item of items) {
        const itemCategory = item.getAttribute('data-category');
        if (selectedCategory === 'All' || itemCategory === selectedCategory) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    }
});

// Function to show all expenses
function showAllExpenses() {
    const items = expenseList.getElementsByClassName('expense-item');
    for (let item of items) {
        item.style.display = 'flex';
    }
}

// Function to save data in LocalStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Main function to initialize the application
function init() {
    expenseList.innerHTML = ''; 
    transactions.forEach(addExpenseToDOM); 
    updateValues(); 
}

init();
