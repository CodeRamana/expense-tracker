const api = "https://6852095e8612b47a2c0be784.mockapi.io/api/v1/transactions/Expense";
// function for getting Transactions data
const getTransactions = async () => {
    try {
        const response = await fetch(api);
        const data = await response.json();
        //storing the data in local storage
        localStorage.setItem("transactions", JSON.stringify(data))
        return data
    }
    catch (err) {
        console.log(err.message)
    }
}

// filter tabs functionality
const setActiveTabs = (filterTabs, transactions) => {
    for (let i = 0; i < filterTabs.length; i++) {
        filterTabs[i].addEventListener('click', () => {
            for (let i = 0; i < filterTabs.length; i++) {
                filterTabs[i].classList.remove('active');
            }
            filterTabs[i].classList.add('active');
            bindingData(filterTabs[i].innerText, transactions)
        })

    }
}

//dynamic menu items in Navbar
const createMenuItems = (items) => {
    const menuEl = document.getElementById("menu");
    items.forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.setAttribute("href", item.href);
        a.classList.add("hover:font-bold");
        a.textContent = item.name;
        li.append(a);
        menuEl.append(li);
    });

}

//creating Dynamic list of Transaction Details
const renderingTransactionList = (data) => {
    const transactionList = document.getElementById("list");
    transactionList.innerHTML = "";


    data.forEach((value) => {

        const list = document.createElement('div');
        list.className = "flex justify-between items-center bg-gray-50 px-3 py-2 rounded-2xl dark:bg-[#1E1E1E]";
        const leftDiv = document.createElement('div');
        leftDiv.className = "flex flex-col items-start gap-1.5";

        const date = new Date(value["createdAt"]);
        const dateFormat = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
        const dateEl = document.createElement('p');
        dateEl.innerText = dateFormat

        const descriptionEl = document.createElement('p');
        descriptionEl.className = "text-xl font-extrabold dark:text-green-500";
        descriptionEl.innerText = value["description"];

        leftDiv.append(dateEl, descriptionEl);

        const rightDiv = document.createElement('div');
        rightDiv.className = "flex flex-col items-end gap-1.5";

        const categoryEl = document.createElement('p');
        categoryEl.innerText = value["category"];

        const amountEl = document.createElement('p');
        amountEl.className = "bg-white px-3 py-2 text-xl font-extrabold rounded-xl dark:text-black";
        amountEl.innerText = value["amount"];

        rightDiv.append(categoryEl, amountEl);

        list.append(leftDiv, rightDiv)
        transactionList.appendChild(list)
    })

}

// creating dynamic table row data and appending to table's body element.
const renderingTransactionTable = (data) => {
    const table = document.querySelector('table');
    const tableBody = [...table.children].filter((value) => value.tagName === 'TBODY').length === 0 ? document.createElement('tbody') : document.querySelector('table > tbody')
    tableBody.innerHTML = "";

    data.forEach((value) => {
        const tr = document.createElement('tr');
        Object.keys(value).forEach((key) => {
            const td = document.createElement('td');
            if (key !== 'id') {
                let text = "";
                if (key === 'createdAt') {
                    const date = new Date(value[key]);
                    const dateFormat = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
                    text = document.createTextNode(dateFormat);
                }
                else {
                    text = document.createTextNode(value[key]);
                }
                td.append(text)
            }
            else {
                td.innerHTML = '<span><a href="#">Edit</a></span> | <span><a href="#">Delete</a></span>'
            }
            td.className = 'border border-gray-300 text-center p-4';
            tr.append(td)
        })

        tableBody.append(tr);
        table.append(tableBody);
    })
}

//binding the data in the Ui Dynamically based on the filter
const bindingData = (filters, transactions) => {
    const data = filters === 'All' ? transactions : transactions.filter((value) => value.category === filters);
    //no data found against filtered
    if (data.length === 0) {
        const list = document.querySelector('#list');
        list.classList.add('hidden')

        const table = document.querySelector('table');
        table.style.display = 'none';

        const noTransactions = document.getElementById("noTransactions");
        noTransactions.classList.remove("hidden");

        const transactionImage = noTransactions.children[0]
        transactionImage.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuAKaA8c8UEYWiFgAG6bppQVOSd5QIvdDUS3PusZMi4fbl-XUoI77XhvHK1ZE5tVe6Vffb7-2ArjDfTE08gpk7-VR1BfxZ-Q1OpaibWX7pfeOHKXTMkxf1H-AwSXviRgjFCPZ1X9u2SESkG5s_4dd4LRtswYDI2_8UfB13ZRCpio6KsbcS_GEMO38GbUCBN_wdeXXS_PNMoficXDrnmx0eg4oFbp6yftuGmDOTrgunaSG1ghjlnKzPXaxKdBSOCQr5iWhu994VrxiKE";

        const transactionMessage = noTransactions.children[1];
        transactionMessage.children[0].innerText = "No transactions found";
        transactionMessage.children[1].innerText = "No transactions match your current filter criteria.";
    }
    else {
        //filtered data

        const list = document.querySelector('#list');
        list.classList.remove('hidden')

        const table = document.querySelector('table');
        table.style.display = '';

        const noTransactions = document.getElementById("noTransactions");
        noTransactions.classList.add("hidden");
        renderingTransactionList(data);
        renderingTransactionTable(data);
    }

}

//logic for Dynamic Dashboard
const setDashboard = (filterTabs, transactions) => {
    // transactions total of Income and Expense Object Constuction logic
    const reduced = transactions.reduce((p, c) => {
        const category = c.category
        if (p[category]) {
            p[category] = p[category] + c.amount;
        } else {
            p[category] = c.amount;
        }
        return p;
    }, {})

    //binding the reduced total Income and expense data
    const income = document.getElementById("Income")
    const expense = document.getElementById("Expense")
    const balance = document.getElementById("Balance")

    income.textContent = `Rs: ${reduced.Income}`;
    expense.textContent = `Rs: - ${reduced.Expense ?? 0}`;
    balance.textContent = `Rs: ${reduced.Income - (reduced.Expense ?? 0)}`;

    //indicating the net balance in image dynamically.
    document.getElementById("indicator").src = (reduced.Income > reduced.Expense) ? "../assets/rocket.png" : "../assets/cartoon.jpg";

    // filtering the transactions data from the buttons in Dashboard
    const dashBoardBtn = document.querySelectorAll('#dashboard > div > div > a');
    dashBoardBtn.forEach((value) => {
        value.addEventListener('click', (event) => {
            const btn = event.target;
            const btnValue = btn.tagName === 'A' ? btn.innerText : btn.parentElement.innerText;

            for (let i = 0; i < filterTabs.length; i++) {
                filterTabs[i].classList.remove('active');
            }

            for (let i = 0; i < filterTabs.length; i++) {
                if (filterTabs[i].innerText === btnValue.split(" ")[0]) {
                    console.log("True")
                    filterTabs[i].classList.add('active')
                    bindingData(filterTabs[i].innerText, transactions)
                }
            }
        })
    })
}

//main function
async function main() {

    // Dark Mode Functionality
    const mode = document.getElementById("mode");

    mode.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            mode.textContent = "light_off";
        } else {
            mode.textContent = "lightbulb";
        }
    });

    const transactions = JSON.parse(localStorage.getItem("transactions")) || await getTransactions();
    //const transactions = [];
    if (transactions.length !== 0) {
        createMenuItems([{ name: "Home", href: "" },
        { name: "Dashboard", href: "#dashboard" },
        { name: "Transactions", href: "#transactions" },
        ])

        const welcome = document.getElementById("welcome");
        welcome.classList.add("hidden");

        const noTransactions = document.getElementById("noTransactions");
        noTransactions.classList.add("hidden");
        const filters = document.getElementById("filters");

        const filterTabs = filters.children;

        setDashboard(filterTabs, transactions)

        setActiveTabs(filterTabs, transactions)

        bindingData('All', transactions)
    }
    else {
        const dashboard = document.getElementById('dashboard');
        dashboard.classList.add('hidden')
        const filters = document.querySelector('#filters');
        filters.style.display = 'none'
        const list = document.querySelector('#list');
        list.style.display = 'none'
        const table = document.querySelector('table');
        table.style.display = 'none'

    }


}

main();