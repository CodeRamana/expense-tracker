const api = "https://6852095e8612b47a2c0be784.mockapi.io/api/v1/transactions/Expense";

const getTransactions = async () => {
    try {
        const response = await fetch(api);
        const data = await response.json();
        return data
    }
    catch (err) {
        console.log(err.message)
    }
}

const createMenuItems = (items) => {
    const menuEl = document.getElementById("menu");
    console.log(menuEl)
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


async function main(){
    const transactions = await getTransactions();
    if (transactions.length !== 0) {
        createMenuItems([{ name: "Home", href: "#" },
        { name: "Dashboard", href: "#" },
        { name: "Transactions", href: "#" },
        ])

        const welcome = document.getElementById("welcome");
        welcome.classList.add("hidden");

        const noTransactions = document.getElementById("noTransactions");
        noTransactions.classList.add("hidden");
    }

    console.log(transactions)
}

main();