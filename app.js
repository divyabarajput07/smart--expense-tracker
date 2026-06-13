// ==================== LOCAL STORAGE (ડેટા લોડ કરવો) ====================
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

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

// ૨. શરૂઆતનું બજેટ સેટ કરવું
let totalBudget = 20000;

// ==================== નવું ફંક્શન: સ્ક્રીન પર લિસ્ટ બતાવવું ====================
function addExpenseToDOM(transaction) {
    const li = document.createElement('li');
    li.classList.add('expense-item');
    li.setAttribute('data-category', transaction.category); 
    
    li.innerHTML = `
        <div>
            <strong>${transaction.name}</strong> (${transaction.category}) <br>
            <small style="color: #666;">📅 ${transaction.date}</small>
        </div>
        <span>₹ ${transaction.amount}</span>
    `;
    expenseList.appendChild(li);
}

// ==================== નવું ફંક્શન: હિસાબ ગણવો (Live Calculation) ====================
function updateValues() {
    // એરેમાંથી બધા ખર્ચનો સરવાળો કરવો
    const totalExpense = transactions.reduce((acc, item) => acc + item.amount, 0);
    const remainingBalance = totalBudget - totalExpense;

    // સ્ક્રીન પર આંકડા બદલવા
    totalBudgetEl.innerText = `₹ ${totalBudget}`;
    totalExpenseEl.innerText = `₹ ${totalExpense}`;
    availableBalanceEl.innerText = `₹ ${remainingBalance}`;

    // રેડ એલર્ટ લોજિક
    if (remainingBalance <= 0) {
        availableBalanceEl.parentElement.classList.add('balance-alert');
    } else {
        availableBalanceEl.parentElement.classList.remove('balance-alert');
    }
}

// ૩. જ્યારે યુઝર "Add Expense" બટન દબાવે ત્યારે
expenseForm.addEventListener('submit', function(event) {
    event.preventDefault(); // પેજ રિફ્રેશ થતું અટકાવવા

    const name = expenseNameInput.value;
    const amount = Number(expenseAmountInput.value);
    const date = expenseDateInput.value;
    const category = expenseCategoryInput.value;

    // ૧. નવા ખર્ચનો ઓબ્જેક્ટ બનાવવો
    const newTransaction = {
        name: name,
        amount: amount,
        date: date,
        category: category
    };

    // ૨. તેને એરેમાં ઉમેરવો
    transactions.push(newTransaction);

    // ૩. DOM પર લિસ્ટ ઉમેરવું અને ગણતરી અપડેટ કરવી
    addExpenseToDOM(newTransaction);
    updateValues();
    updateLocalStorage();

    // ફોર્મ ખાલી કરવું
    expenseForm.reset();
    
    // ફિલ્ટર પાછું 'All' પર સેટ કરવું
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

// ==================== એપ શરૂ કરવાનું મેઈન ફંક્શન (જૂનો ડેટા પાછો લાવવા) ====================
function init() {
    expenseList.innerHTML = ''; // પહેલા લિસ્ટ ખાલી કરવું
    transactions.forEach(addExpenseToDOM); // સેવ થયેલો ડેટા એક-એક કરીને સ્ક્રીન પર લાવવો
    updateValues(); // હિસાબ ગણવો
}

// વેબસાઈટ લોડ થતા જ રન કરો
init();