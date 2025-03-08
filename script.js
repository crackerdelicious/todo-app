// Get references to the HTML elements we need to interact with
const newTodoInput = document.getElementById("new-todo-input");
const addTodoButton = document.getElementById("add-todo-button");
const todoList = document.getElementById("todo-list");

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

    // Add the new li element to the ul
    todoList.appendChild(newTodoItem);
    // Clear the input field
    newTodoInput.value = "";
}

// Add an event listener to the button to call the addTodo function when clicked
addTodoButton.addEventListener("click", addTodo);

// Add event listener for the 'Enter' Key
newTodoInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTodo();
    }
});
