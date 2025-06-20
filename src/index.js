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

    const mode = document.getElementById("mode");

    mode.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        mode.textContent = "light_off";
    } else {
        mode.textContent = "lightbulb";
    }
});
    
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

   const reduced = transactions.reduce((p,c)=>{
        const category = c.category
        console.log(!p[category])
        if(p[category]){ 
            p[category] = p[category] + c.amount;
        }else{
            p[category] = c.amount;
        }
        return p;
    },{})

    const income = document.getElementById("Income")
    const expense = document.getElementById("Expense")
    const balance = document.getElementById("Balance")

    income.textContent = `Rs: ${reduced.Income}`;
    expense.textContent = `Rs: -${reduced.Expense}`;
    balance.textContent = `Rs: ${reduced.Income - reduced.Expense}`;
    
    document.getElementById("indicator").src =(reduced.Income > reduced.Expense) ? "../assets/rocket.png" : "../assets/cartoon.jpg";

    console.log(reduced)
}

main();