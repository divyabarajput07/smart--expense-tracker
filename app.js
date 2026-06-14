// ==================== LOCAL STORAGE (ડેટા લોડ કરવો) ====================
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// LocalStorage માંથી બજેટ લોડ કરવું
const localStorageBudget = localStorage.getItem('totalBudget');
let totalBudget = localStorageBudget !== null ? Number(localStorageBudget) : 0;

// ૧. HTML ના એલિમેન્ટ્સ પકડવા
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

// ==================== યુઝર બજેટ સેટ કરે ત્યારે ====================
if (setBudgetBtn) {
    setBudgetBtn.addEventListener('click', function() {
        const enteredBudget = Number(budgetInput.value);
        if (enteredBudget > 0) {
            totalBudget = enteredBudget;
            localStorage.setItem('totalBudget', totalBudget);
            updateValues();
            budgetInput.value = '';
        } else {
            alert('મહેરબાની કરીને સાચું બજેટ ઉમેરો!');
        }
    });
}

// ==================== સુધારેલું ફંક્શન: સ્ક્રીન પર લિસ્ટ બતાવવું (Delete Button સાથે) ====================
function addExpenseToDOM(transaction) {
    const li = document.createElement('li');
    li.classList.add('expense-item');
    li.setAttribute('data-category', transaction.category); 
    
    // અહીં આપણે લિસ્ટની અંદર એક Delete (❌) બટન ઉમેર્યું છે અને તેમાં onclick ઇવેન્ટ આપી છે
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

// ==================== નવું ફંક્શન: ખર્ચ ડિલીટ કરવા માટે ====================
function deleteExpense(id) {
    // આ મેથડ આપેલા id સિવાયના બધા ખર્ચ રાખીને બાકીનાને એરેમાંથી ફિલ્ટર કરી દેશે
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    // LocalStorage અને સ્ક્રીન પર દેખાતા આંકડા અપડેટ કરવા
    updateLocalStorage();
    init(); 
}

// ==================== હિસાબ ગણવો (Live Calculation) ====================
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

// ૩. જ્યારે યુઝર "Add Expense" બટન દબાવે ત્યારે
expenseForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = expenseNameInput.value;
    const amount = Number(expenseAmountInput.value);
    const date = expenseDateInput.value;
    const category = expenseCategoryInput.value;

    // અહીં આપણે દરેક નવા ખર્ચને એક યુનિક ID (Date.now()) આપી રહ્યા છીએ
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

// ૫. ફિલ્ટર ચેન્જ થાય ત્યારનું લોજિક
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

function showAllExpenses() {
    const items = expenseList.getElementsByClassName('expense-item');
    for (let item of items) {
        item.style.display = 'flex';
    }
}

// ડેટાને LocalStorage માં સેવ કરવાનું ફંક્શન
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// એપ શરૂ કરવાનું મેઈન ફંક્શન
function init() {
    expenseList.innerHTML = ''; 
    transactions.forEach(addExpenseToDOM); 
    updateValues(); 
}

init();
