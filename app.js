// ==================== LOCAL STORAGE (Loading Data) ====================
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

const localStorageBudget = localStorage.getItem('totalBudget');
let totalBudget = localStorageBudget !== null ? Number(localStorageBudget) : 0;

// Track application edit states globally
let editId = null;

// DOM Elements Selection
const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseDateInput = document.getElementById('expense-date');
const expenseCategoryInput = document.getElementById('expense-category');
const expenseList = document.getElementById('expense-list');
const filterCategory = document.getElementById('filter-category');
const searchExpenseInput = document.getElementById('search-expense'); 

const totalBudgetEl = document.getElementById('total-budget');
const totalExpenseEl = document.getElementById('total-expense');
const availableBalanceEl = document.getElementById('available-balance');

const budgetInput = document.getElementById('budget-input');
const setBudgetBtn = document.getElementById('set-budget-btn');
const themeToggleBtn = document.getElementById('theme-toggle'); 

// ==================== Set Initial Budget Logic ====================
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

// ==================== Render Expense Item to DOM Section ====================
function addExpenseToDOM(transaction) {
    const li = document.createElement('li');
    li.classList.add('expense-item');
    li.setAttribute('data-category', transaction.category); 

    li.innerHTML = `
        <div>
            <strong>${transaction.name}</strong> (${transaction.category}) <br>
            <small style="color: #666;" class="expense-date-text">📅 ${transaction.date}</small>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
            <span>₹ ${transaction.amount}</span>
            <button onclick="editExpense(${transaction.id})" style="background-color: #f39c12; color: white; border: none; padding: 5px 8px; border-radius: 3px; cursor: pointer; font-weight: bold;">✏️</button>
            <button onclick="deleteExpense(${transaction.id})" style="background-color: #e74c3c; color: white; border: none; padding: 5px 8px; border-radius: 3px; cursor: pointer; font-weight: bold;">❌</button>
        </div>
    `;
    expenseList.appendChild(li);
}

// ==================== Edit Existing Expense Logic ====================
function editExpense(id) {
    const transactionToEdit = transactions.find(t => t.id === id);
    if (transactionToEdit) {
        expenseNameInput.value = transactionToEdit.name;
        expenseAmountInput.value = transactionToEdit.amount;
        expenseDateInput.value = transactionToEdit.date;
        expenseCategoryInput.value = transactionToEdit.category;
        expenseForm.querySelector('button[type="submit"]').innerText = "Update Expense (✏️)";
        editId = id;
        expenseForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==================== Delete Expense Logic ====================
function deleteExpense(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init(); 
}

// ==================== Live Financial Scoreboard Calculation ====================
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

// ==================== Form Submission Handle (Add/Update Expense) ====================
expenseForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = expenseNameInput.value.trim();
    const amount = Number(expenseAmountInput.value);
    const date = expenseDateInput.value;
    const category = expenseCategoryInput.value;

    if (name === '' || isNaN(amount) || date === '' || category === '') {
        alert('Please fill out all the fields correctly!');
        return; 
    }
    if (amount <= 0) {
        alert('Expense amount must be greater than 0!');
        return;
    }

    const totalExpenseSoFar = transactions.reduce((acc, item) => acc + item.amount, 0);
    let availableBalance = totalBudget - totalExpenseSoFar;
    
    if (editId !== null) {
        const oldTransaction = transactions.find(t => t.id === editId);
        if (oldTransaction) availableBalance += oldTransaction.amount;
    }

    if (amount > availableBalance && totalBudget > 0) {
        const proceed = confirm('Warning: This expense exceeds your remaining budget. Do you still want to proceed?');
        if (!proceed) return; 
    }

    if (editId !== null) {
        transactions = transactions.map(t => t.id === editId ? { id: editId, name, amount, date, category } : t);
        editId = null; 
        expenseForm.querySelector('button[type="submit"]').innerText = "Add Expense (+)";
    } else {
        const newTransaction = {
            id: Date.now(), 
            name: name,
            amount: amount,
            date: date,
            category: category
        };
        transactions.push(newTransaction);
    }

    updateLocalStorage();
    init();

    expenseForm.reset();
    filterCategory.value = 'All';
    if(searchExpenseInput) searchExpenseInput.value = '';
});

// ==================== Live Filter and Search Handling Section ====================
if (searchExpenseInput) {
    searchExpenseInput.addEventListener('input', filterAndSearchExpenses);
}
if (filterCategory) {
    filterCategory.addEventListener('change', filterAndSearchExpenses);
}

function filterAndSearchExpenses() {
    const searchText = searchExpenseInput ? searchExpenseInput.value.toLowerCase() : '';
    const selectedCategory = filterCategory ? filterCategory.value : 'All';
    
    expenseList.innerHTML = '';
    
    const filtered = transactions.filter(t => {
        const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
        const matchesSearch = t.name.toLowerCase().includes(searchText);
        return matchesCategory && matchesSearch;
    });
    
    filtered.forEach(addExpenseToDOM);
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// ==================== Theme Controller (Dark / Light Mode) ====================
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggleBtn) themeToggleBtn.innerText = '☀️';
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeToggleBtn.innerText = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggleBtn.innerText = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
}

// Core App Initialization Function
function init() {
    expenseList.innerHTML = ''; 
    transactions.forEach(addExpenseToDOM); 
    updateValues(); 
}

init();
