// ------ TodoItem Class ------
class TodoItem {
    constructor(text, completed = false, dueDate = null, priority = "Medium") {
        this.text = text;
        this.completed = completed;
        this.dueDate = dueDate;
        this.priority = priority;
        this.id = this.generatedId(); // Add a unique ID
    }

    generatedId() {
        return (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    updateText(newText) {
        this.text = newText;
    }

    updateDueDate(newDueDate) {
        this.dueDate = newDueDate;
    }

    updatePriority(newPriority) {
        this.newPriority = newPriority;
    }
}

// ------ TodoList Class ------
class TodoList {
    constructor() {
        this.todos = []; // Initialize an empty array to store TodoItem objects
        this.loadTodos(); // Load to-dos from localStorage when a TodoList is created
    }

    addTodo(todoItem) {
        this.todos.push(todoItem);
        this.saveTodos(); // Save after adding
        this.render(); // Re-render the list after adding
    }

    removeTodo(id) {
        this.todos = this.todos.filter((todo) => todo.id !== id);
        this.saveTodos(); // Save after removing
        this.render(); // Re-render the list after removing
    }

    saveTodos() {
        localStorage.setItem("todos", JSON.stringify(this.todos));
    }

    loadTodos() {
        const savedTodos = localStorage.getItem("todos");
        if (savedTodos) {
            const todosData = JSON.parse(savedTodos);
            // Important: Create TodoItem instances from the loaded data
            this.todos = todosData.map(
                (todoData) =>
                    new TodoItem(
                        todoData.text,
                        todoData.completed,
                        todoData.dueDate,
                        todoData.priority
                    )
            );
        }
    }

    // find todo by ID
    findTodoById(id) {
        return this.todos.find((todo) => todo.id === id);
    }

    render() {
        todoListElement.innerHTML = ""; // Clear the existing list

        this.todos.forEach((todo) => {
            const newTodoItem = document.createElement("li");
            newTodoItem.dataset.id = todo.id; // Store the ID on the li element

            const textSpan = document.createElement("span");
            textSpan.textContent = todo.text;
            textSpan.classList.add("todo-text"); // Add a class for targeting
            newTodoItem.appendChild(textSpan);

            if (todo.dueDate) {
                const dueDateSpan = document.createElement("span");
                dueDateSpan.classList.add("due-date");
                dueDateSpan.textContent = `Due: ${todo.dueDate}`;
                newTodoItem.appendChild(dueDateSpan);
            }

            const prioritySpan = document.createElement("span");
            prioritySpan.classList.add("priority");
            prioritySpan.classList.add(todo.priority);
            prioritySpan.textContent = todo.priority;
            newTodoItem.appendChild(prioritySpan);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            newTodoItem.appendChild(deleteButton);

            if (todo.completed) {
                newTodoItem.classList.add("completed");
            }

            todoListElement.appendChild(newTodoItem);
        });
    }
}

// Get references to the HTML elements we need to interact with
const newTodoInput = document.getElementById("new-todo-input");
const addTodoButton = document.getElementById("add-todo-button");
const todoListElement = document.getElementById("todo-list"); // Renamed to avoid conflict
const newTodoDueDate = document.getElementById("new-todo-due-date");
const newTodoPriority = document.getElementById("new-todo-priority");

// Create a single instance of TodoList
const todoList = new TodoList();

// Add an event listener to the button to call the addTodo function when clicked
addTodoButton.addEventListener("click", addTodo);
// Add event listener for the 'Enter' Key
newTodoInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTodo();
    }
});

todoListElement.addEventListener("click", handleTodoClick); // Centralized event handler

// Function to add a new to-do item
function addTodo() {
    const todoText = newTodoInput.value; // Get the text from the input field
    const dueDate = newTodoDueDate.value; // Get due date
    const priority = newTodoPriority.value; // Get priority

    // Check if the input is empty
    if (todoText.trim() === "") {
        alert("Please enter a to-do item.");
        return; // Stop the function if the input is empty
    }

    // Create a new TodoItem object
    const newTodo = new TodoItem(todoText, false, dueDate, priority);
    todoList.addTodo(newTodo); // Add the new TodoItem to the TodoList

    // Clear the input field
    newTodoInput.value = "";
    newTodoDueDate.value = "";
    newTodoPriority.value = "Medium";
}

function handleTodoClick(event) {
    const target = event.target;
    const listItem = target.closest("li"); // Find the closest li ancestor

    if (!listItem) return; // Clicked outside a list item

    const todoId = listItem.dataset.id;
    const todo = todoList.findTodoById(todoId);

    if (!todo) return; // Couldn't find the TodoItem (shouldn't happen)

    if (target.tagName === "BUTTON") {
        // Delete button was clicked
        todoList.removeTodo(todoId);
    } else if (target.classList.contains("todo-text")) {
        // To-do text was clicked - start editing
        startEdit(listItem, todo);
    } else {
        // The li itself was clicked (not the button) - toggle complete
        todo.toggleComplete();
        todoList.saveTodos(); // Save after toggling
        todoList.render(); // Re-render to update the UI
    }
}

function startEdit(listItem, todo) {
    // Hide the text
    const textSpan = listItem.querySelector(".todo-text");
    textSpan.classList.add("editing");

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = todo.text;
    listItem.prepend(editInput); // Add to begin of list item
    editInput.focus();

    editInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            finishEdit(listItem, editInput, todo);
        }
    });

    editInput.addEventListener('blue', function() {
        finishEdit(listItem, editInput, todo);
    });
}

function finishEdit(listItem, editInput, todo) {
    if (editInput.dataset.editing === 'true') {
        return; // Exit the function if already editing
    }

    // Mark as editing to prevent concurrent calls
    editInput.dataset.editing = 'true';

    const newText = editInput.value;
    todo.updateText(newText); // Use the updateText method
    todoList.saveTodos(); // Save the changes
    todoList.render(); // Re-render the list
    delete editInput.dataset.editing;
}

// Initial render
todoList.render();