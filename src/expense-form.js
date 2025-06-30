const handleForm = (action, id) => {
    const formEl = document.forms["expense-form"];
    formEl.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(formEl)
        const data = Object.fromEntries(formData.entries())
        console.log(data)
        if(action !== "delete" && (!data.description || !data.category || !data.amount) ){
            console.log(data);
            return;
        }

        const transactions = JSON.parse(localStorage.getItem("transactions"));
        if (action === "create") {

            const result = transactions.length === 0 ? { createdAt: new Date(), ...data, amount: parseInt(data.amount), id: "1" } : { createdAt: new Date(), ...data, amount: parseInt(data.amount), id: JSON.stringify(parseInt(transactions[transactions.length - 1]["id"]) + 1) };
            console.log(result)
            localStorage.setItem("transactions", JSON.stringify([...transactions, result]))
            console.log(JSON.parse(localStorage.getItem("transactions")));
            createTransaction(result)
        }
        else if (action === "edit") {
            const filtered = transactions.filter((value) => value.id !== id)
            const result = { createdAt: new Date(), ...data, amount: parseInt(data.amount), id }
            localStorage.setItem("transactions", JSON.stringify([...filtered, result]))

            updateTransaction(data, id);
        }
        else{
            const filtered = transactions.filter((value) => value.id !== id)
            localStorage.setItem("transactions", JSON.stringify([...filtered]))
            deleteTransaction(id)
        }

    })
}

const handleReset = () => {
    const input = document.querySelectorAll('input');
    console.log(input)
    input.forEach((element) => {
        element.value = ""
    })
}

const api = "https://6852095e8612b47a2c0be784.mockapi.io/api/v1/transactions/Expense";

const createTransaction = async (result) => {
    try {
        const response = await fetch(api, {
            method: 'POST',
            body: JSON.stringify(result),
            headers: { 'Content-Type': 'Application/json' }
        })

        if (response) {
            handleReset();
           window.location.href = '/';
        }
    }
    catch (err) {
        console.log(err.message)
    }
}

const updateTransaction = async (result, id) => {
    try {
        const response = await fetch(`${api}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(result),
            headers: { 'Content-Type': 'Application/json' }
        })

        if (response) {
            handleReset();
            window.location.href = '/';
        }
    }
    catch (err) {
        console.log(err.message)
    }
}

const deleteTransaction = async (id) => {
    try {
        const response = await fetch(`${api}/${id}`, {
            method: 'DELETE'
        })

        if (response) {
            handleReset();
            window.location.href = '/';
        }
    }
    catch (err) {
        console.log(err.message)
    }
}

//main function
function main() {
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

    const params = new URLSearchParams(window.location.search);

    const action = params.get('action');
    const id = params.get('id');

    const btn = document.querySelectorAll('button');
    console.log(btn)
    btn.forEach((element)=>{
        if(element.type === 'submit'){
            element.innerText = (action === 'create') ? "Submit" : (action === 'edit' ? "Edit" : "Delete");
        }
        else{
            if(action !== "create"){
                element.classList.add('hidden');
            }
            else{
                element.classList.remove('hidden');
            }
        }
    })

    const transactions = JSON.parse(localStorage.getItem("transactions"));
    const obj = transactions.find((obj) => obj.id === id);

    const inputEl = document.querySelectorAll('input')

    if(action !== "create"){
        inputEl.forEach((element) => {
            if (element.type !== 'radio') {
                element.value = obj[element.name];
            }
            else {
                if (obj[element.name] === element.value) {
                    element.checked = true;
                }
            }

        })
    }

    if(action === "delete"){
        inputEl.forEach((element) => element.disabled = true);
        if(!confirm("Do you want to delete?")){
            window.history.back();
        }  
    }
    
    handleForm(action, id)
      
}

main();