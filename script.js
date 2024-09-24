document.addEventListener('DOMContentLoaded', loadTransactions);
document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    const transaction = { date, description, amount, type };
    saveTransaction(transaction);
    addTransactionToTable(transaction);
    updateTotals(type, amount);
});

document.getElementById('filter-button').addEventListener('click', filterTransactions);

function saveTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadTransactions() {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.forEach(transaction => {
        addTransactionToTable(transaction);
        updateTotals(transaction.type, transaction.amount);
    });
}

function addTransactionToTable(transaction) {
    const table = document.getElementById('transaction-table');
    const row = table.insertRow();

    row.insertCell(0).innerText = transaction.date;
    row.insertCell(1).innerText = transaction.description;
    row.insertCell(2).innerText = transaction.amount.toFixed(2);
    row.insertCell(3).innerText = transaction.type === 'income' ? 'Ingreso' : 'Gasto';

    const actionsCell = row.insertCell(4);
    const editButton = document.createElement('button');
    editButton.innerText = 'Editar';
    editButton.classList.add('edit-btn');
    editButton.addEventListener('click', () => {
        editTransaction(transaction, row);
    });
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Eliminar';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', () => {
        deleteTransaction(transaction, row);
    });
    actionsCell.appendChild(deleteButton);
}

function deleteTransaction(transaction, row) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions = transactions.filter(t => t !== transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    row.remove();
    updateTotals(transaction.type, -transaction.amount);
}

function editTransaction(transaction, row) {
    document.getElementById('date').value = transaction.date;
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('type').value = transaction.type;

    deleteTransaction(transaction, row);
}

function updateTotals(type, amount) {
    const totalIncome = document.getElementById('total-income');
    const totalExpense = document.getElementById('total-expense');

    if (type === 'income') {
        totalIncome.innerText = (parseFloat(totalIncome.innerText) + amount).toFixed(2);
    } else {
        totalExpense.innerText = (parseFloat(totalExpense.innerText) + amount).toFixed(2);
    }
}

function filterTransactions() {
    const filterMonth = document.getElementById('filter-month').value;
    const filterType = document.getElementById('filter-type').value;
    const table = document.getElementById('transaction-table');
    table.innerHTML = '';

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let filteredTransactions = transactions.filter(transaction => {
        const matchesMonth = transaction.date.startsWith(filterMonth);
        const matchesType = filterType === 'all' || transaction.type === filterType;
        return matchesMonth && matchesType;
    });

    let totalIncome = 0;
    let totalExpense = 0;

    filteredTransactions.forEach(transaction => {
        addTransactionToTable(transaction);
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });

    document.getElementById('total-income').innerText = totalIncome.toFixed(2);
    document.getElementById('total-expense').innerText = totalExpense.toFixed(2);
}