const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners(){ // All event listeners
    
    form.addEventListener("submit",addtodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}

// Clear all todos from UI and local storage
function clearAllTodos(){
    if (confirm("Tümünü silmek istediğinize emin misiniz?")) {
        
        /* Method 1
        todoList.innerHTML = ""; // Slower than method 2
        */
        
        // Method 2
        while(todoList.firstElementChild != null)
            todoList.removeChild(todoList.firstElementChild);
        
        localStorage.removeItem("todos");
    }
}

function filterTodos(e){
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");
    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1) {
            // not found
            listItem.setAttribute("style","display : none !important");
        }else{
            listItem.setAttribute("style","display : block");
        }
    })
}

function deleteTodo(e){
    if (e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        removeExistAlert();
        showAlert("success","Todo has been deleted successfully.");
    }
    e.preventDefault();
}

function deleteTodoFromStorage(deletetodo){
    let todos = getTodosFromStorage();
    todos.forEach(function(todo,index){
        if (todo === deletetodo) {
            todos.splice(index,1); // remove value from array in local storage
        }
    });

    localStorage.setItem("todos",JSON.stringify(todos));
}

function loadAllTodosToUI(){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo){
        addTodoToUI(todo);
    })
}

function addtodo(e){
    const newTodo = todoInput.value.trim();
    let isTodoExist = false;
        
    if (newTodo === "") {
        removeExistAlert();
        showAlert("danger","Please enter a todo.");
        
    }else{
        if (todoList.firstElementChild != null) {
            Array.prototype.forEach.call(todoList.children,function(ch){
                if(newTodo===ch.textContent){
                    removeExistAlert();
                    showAlert("warning","Todo has already been created.");
                    isTodoExist = true;
                }
            });
        }
        if (!isTodoExist) {
            addTodoToUI(newTodo);
            addTodoToStorage(newTodo);
            removeExistAlert();
            showAlert("success","Todo has been created successfully.");
        }    
    }
    // Clear input after adding todo
    todoInput.value="";
    
    e.preventDefault();
}

function removeExistAlert(){
    const alert = document.querySelector(".alert");
    if (document.body.contains(alert)) {
        alert.remove();
    }
}

function showAlert(type,message){
    const alert = document.createElement("div");
    
    alert.className = `alert alert-${type}`;
    alert.textContent=message;
    firstCardBody.appendChild(alert);

    // setTimeout method
    if (type==="success") {
        setTimeout(function(){
            alert.remove();
        },2000);   
    }else if (type === "danger"){    
        setTimeout(function(){
            alert.remove();
        },1000);
    }else if (type === "warning"){
        setTimeout(function(){
            alert.remove();
        },2000);
    }
    
    
}

function addTodoToUI(newTodo){ // add String value to UI as list item
    // Generate List Item
    const listItem = document.createElement("li");
    // Generate Link for list item
    const link = document.createElement("a");
    link.href = "#";
    link.className="delete-item";
    link.innerHTML="<i class = 'fa fa-remove'></i>";

    listItem.className="list-group-item d-flex justify-content-between";
    // Add text node to list item
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);
    // Add list item to ToDoList(UI)
    todoList.appendChild(listItem);
}

function getTodosFromStorage(){
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    }else{
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodoToStorage(newTodo){
    let todos = getTodosFromStorage();
    todos.push(newTodo);
    // stringify -- array to String
    localStorage.setItem("todos",JSON.stringify(todos));
}