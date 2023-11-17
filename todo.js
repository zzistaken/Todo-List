// Select all elements
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners() { // All eventListeners
    form.addEventListener("submit",addTodo); // Run addTodo function when form submits
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}

function clearAllTodos(e){
    if (confirm("Are you sure you want to delete all?")){
        // Removing todos from UI
        while (todoList.firstElementChild != null){
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
        showAlert("success","All Todos cleared successfully!");
        todoList.innerHTML = "Todo List is Empty";
    }

}

function filterTodos(e) { // Filtering todos from todoList
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1){
            // Not found
            listItem.setAttribute("style","display: none !important");
        }
        else {
            listItem.setAttribute("style","display: block");
        }
    })
}

function deleteTodo(e) {
    if (e.target.className === "fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Todo removed successfully!")
    }
}

function deleteTodoFromStorage(deleteTodo) {
    let todos = getTodosFromStorage();
    
    todos.forEach(function(todo,index){
        if (todo === deleteTodo){
            todos.splice(index,1); // Delete value from array
        }
    })

    localStorage.setItem("todos",JSON.stringify(todos));
}

function loadAllTodosToUI() { // When the document is loaded, load all todos in localStorage
    let todos = getTodosFromStorage();

    todos.forEach(function (todo) {
        addTodotoUI(todo);
    })
}

function addTodo(e) { // Assigns the value entered in the Todo input field to newTodo
    const newTodo = todoInput.value.trim(); // trim function clears the string

    if (newTodo === "") {
        showAlert("warning","Please enter a value...");
    }
    else {
        addTodotoUI(newTodo);
        addTodotoStorage(newTodo);
        showAlert("success","Todo added successfully!");
    }

    e.preventDefault();
}

function getTodosFromStorage() { // If there is an array in localStorage, get it, if not, create it
    let todos;

    if(localStorage.getItem("todos") === null){
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodotoStorage(newTodo) { // Add the received todos to localStorage
    let todos = getTodosFromStorage();

    todos.push(newTodo);

    localStorage.setItem("todos",JSON.stringify(todos));
}

function showAlert(type,message) {
    // Create new div
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    // Adding alert under cardbody's lastchild
    firstCardBody.appendChild(alert);

    // setTimeout for alert div
    setTimeout(function() {
        alert.remove();
    },3000);
}

function addTodotoUI(newTodo) { // Add the received string value as list item to UI

    // Create new link
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    // Create new list item
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    // Adding listItem to todoList
    todoList.appendChild(listItem);
    todoInput.value ="";
}