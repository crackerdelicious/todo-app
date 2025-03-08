// Get references to the HTML elements we need to interact with
const newTodoInput = document.getElementById("new-todo-input");
const addTodoButton = document.getElementById("add-todo-button");
const todoList = document.getElementById("todo-list");

loadTodos();

// Function to add a new to-do item
function addTodo() {
    const todoText = newTodoInput.value; // Get the text from the input field

    // Check if the input is empty
    if (todoText.trim() === "") {
        alert("Please enter a to-do item.");
        return; // Stop the function if the input is empty
    }

    // Create a new list item (li) element
    const newTodoItem = document.createElement("li");
    newTodoItem.textContent = todoText; // Set the text content of the li

    // Create a delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    // Add event listener in delete button
    deleteButton.addEventListener('click', deleteTodo);

    // Add the delete button to the li
    newTodoItem.appendChild(deleteButton);

    // Add event listener for toggle complete in the newTodoItem
    newTodoItem.addEventListener('click', toggleComplete);

    // Add the new li element to the ul
    todoList.appendChild(newTodoItem);
    // Clear the input field
    newTodoInput.value = "";

    saveTodos();
}

// Function to toggle the 'completed' class on a to-do item
function toggleComplete() {
    // 'this' refers to the element that was clicked (the li)
    this.classList.toggle('completed');
    saveTodos();
}

// Function to delete a to-do item
function deleteTodo() {
    // 'this' refers to the element that was clicked (the button)
    // parentElement refers to the parent of the button (the li)
    this.parentElement.remove();
    saveTodos();
}

// Function to save to-dos to localStorage
function saveTodos() {
    const todos = [];
    const todoItems = todoList.querySelectorAll('li');

    todoItems.forEach(item => {
        todos.push({
            text: item.textContent.replace('Delete', '').trim(), // Remove the text 'delete from textContent.
            completed: item.classList.contains('completed'),
        });
    });

    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const savedTodos = localStorage.getItem('todos');

    if (savedTodos) {
        const todos = JSON.parse(savedTodos);

        todos.forEach(todo => {
            const newTodoItem = document.createElement('li');
            newTodoItem.textContent = todo.text;

            // Important add class 'completed' if the task was completed
            if (todo.completed) {
                newTodoItem.classList.add('completed');
            }

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', deleteTodo);
            newTodoItem.appendChild(deleteButton);

            newTodoItem.addEventListener('click', toggleComplete);
            todoList.appendChild(newTodoItem);
        });
    }
}

// Add an event listener to the button to call the addTodo function when clicked
addTodoButton.addEventListener("click", addTodo);

// Add event listener for the 'Enter' Key
newTodoInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTodo();
    }
});
