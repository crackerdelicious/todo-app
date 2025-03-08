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
    // Add span element for the text
    const textSpan = document.createElement("span");
    textSpan.textContent = todoText;
    textSpan.addEventListener("click", startEdit); // Add event listener for editing
    newTodoItem.appendChild(textSpan);

    // Create a delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    // Add event listener in delete button
    deleteButton.addEventListener("click", deleteTodo);

    // Add the delete button to the li
    newTodoItem.appendChild(deleteButton);

    // Add event listener for toggle complete in the newTodoItem
    newTodoItem.addEventListener("click", toggleComplete);

    // Add the new li element to the ul
    todoList.appendChild(newTodoItem);
    // Clear the input field
    newTodoInput.value = "";

    saveTodos();
}

// Function to toggle the 'completed' class on a to-do item
function toggleComplete(event) {
    // 'this' refers to the element that was clicked (the li)
    if (event.target === this) {
        this.classList.toggle("completed");
        saveTodos();
    }
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
    const todoItems = todoList.querySelectorAll("li");

    todoItems.forEach((item) => {
        // Get span element to get the text
        const textSpan = item.querySelector("span");

        todos.push({
            text: textSpan.textContent,
            completed: item.classList.contains("completed"),
        });
    });

    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
    const savedTodos = localStorage.getItem("todos");

    if (savedTodos) {
        const todos = JSON.parse(savedTodos);

        todos.forEach((todo) => {
            const newTodoItem = document.createElement("li");
            // Add span element for the text
            const textSpan = document.createElement("span");
            textSpan.textContent = todo.text;
            textSpan.addEventListener("click", startEdit);
            newTodoItem.appendChild(textSpan);

            // Important add class 'completed' if the task was completed
            if (todo.completed) {
                newTodoItem.classList.add("completed");
            }

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", deleteTodo);
            newTodoItem.appendChild(deleteButton);

            newTodoItem.addEventListener("click", toggleComplete);
            todoList.appendChild(newTodoItem);
        });
    }
}

// Function to start editing a to-do
function startEdit() {
    const listItem = this.parentElement; // Get the parent li
    const currentText = this.textContent;

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = currentText;

    // Replace the span with the input field
    listItem.replaceChild(editInput, this);

    editInput.focus(); // Automatically focus the input field

    // Event Listener for pressing Enter
    editInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            finishEdit(listItem, editInput);
        }
    });

    // Event listener for clicking outside the input (blur event)
    editInput.addEventListener("blur", function () {
        finishEdit(listItem, editInput);
    });
}

// Function to finish editing and save changes
function finishEdit(listItem, editInput) {
    // Check if we're already processing an edit
    if (editInput.dataset.editing === "true") {
        return; // Exit the function if already editing
    }

    // Mark as editing to prevent concurrent calls
    editInput.dataset.editing = "true";

    const newText = editInput.value;

    // Create a new span with the updated text
    const newTextSpan = document.createElement("span");
    newTextSpan.textContent = newText;
    newTextSpan.addEventListener("click", startEdit); // Re-attach the edit listener

    // Replace the input field with the new span
    listItem.replaceChild(newTextSpan, editInput);

    // Remove the editing flag (not strictly necessary, but good practice)
    delete editInput.dataset.editing;

    saveTodos(); // Save the changes
}

// Add an event listener to the button to call the addTodo function when clicked
addTodoButton.addEventListener("click", addTodo);

// Add event listener for the 'Enter' Key
newTodoInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTodo();
    }
});
