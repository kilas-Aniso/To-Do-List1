const todoContainer = document.getElementById('todos');
const filterDropdown = document.getElementById('filterDropdown');
const addTodoForm = document.getElementById('addTodoForm');
const todoInput = document.getElementById('todoInput');
let todos = [];

const getTodos = () => {
  return fetch('https://dummyjson.com/todos/user/5')
    .then(response => response.json())
    .then(response => {
      todos = response.todos;
      return todos;
    });
};

const displayTodos = () => {
  todoContainer.innerHTML = '';

  todos.forEach(item => {
    const div = document.createElement('div');
    const todo = document.createElement('h2');
    const completed = document.createElement('p');
    const checkbox = document.createElement('input');
    const deleteButton = document.createElement('button');

    todo.innerHTML = item.todo;
    completed.innerHTML = `Completed: ${item.completed}`;
    checkbox.type = 'checkbox';
    checkbox.checked = item.completed;
    deleteButton.textContent = 'Delete';

    checkbox.addEventListener('change', () => updateTodo(item.id, checkbox.checked));
    deleteButton.addEventListener('click', () => deleteTodo(item.id));

    div.appendChild(todo);
    div.appendChild(completed);
    div.appendChild(checkbox);
    div.appendChild(deleteButton);
    div.setAttribute('key', item.id);
    div.setAttribute('class', 'todo');

    if (item.completed) {
      div.style.backgroundColor = 'green';
    } else {
      div.style.backgroundColor = 'yellow';
    }

    todoContainer.appendChild(div);
  });
};

const filterTodos = () => {
  const filterValue = filterDropdown.value;

  let filteredTodos = todos;

  if (filterValue === 'completed') {
    filteredTodos = todos.filter(item => item.completed);
  } else if (filterValue === 'incomplete') {
    filteredTodos = todos.filter(item => !item.completed);
  }

  todoContainer.innerHTML = '';

  filteredTodos.forEach(item => {
    const div = document.createElement('div');
    const todo = document.createElement('h2');
    const completed = document.createElement('p');
    const checkbox = document.createElement('input');
    const deleteButton = document.createElement('button');

    todo.innerHTML = item.todo;
    completed.innerHTML = `Completed: ${item.completed}`;
    checkbox.type = 'checkbox';
    checkbox.checked = item.completed;
    deleteButton.textContent = 'Delete';

    checkbox.addEventListener('change', () => updateTodo(item.id, checkbox.checked));
    deleteButton.addEventListener('click', () => deleteTodo(item.id));

    div.appendChild(todo);
    div.appendChild(completed);
    div.appendChild(checkbox);
    div.appendChild(deleteButton);
    div.setAttribute('key', item.id);
    div.setAttribute('class', 'todo');

    if (item.completed) {
      div.style.backgroundColor = 'green';
    } else {
      div.style.backgroundColor = 'yellow';
    }

    todoContainer.appendChild(div);
  });
};

const addTodo = () => {
  const todo = todoInput.value;

  fetch('https://dummyjson.com/todos/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      todo,
      completed: false,
      userId: 5,
    }),
  })
    .then(response => response.json())
    .then(response => {
      if (response.completed) {
        updateTodo(response.id, true);
      }
      todos.push(response);
      displayTodos();
      todoInput.value = '';
    })
    .catch(error => {
      console.error('Error adding todo:', error);
    });
};

const updateTodo = (todoId, completed) => {
  const updatedTodo = todos.find(item => item.id === todoId);
  if (updatedTodo) {
    updatedTodo.completed = completed;

    fetch(`https://dummyjson.com/todos/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTodo)
    })
      .then(response => {
        const updatedIndex = todos.findIndex(item => item.id === todoId);
        if (updatedIndex !== -1) {
          todos[updatedIndex] = updatedTodo; // Update the todo object in the array
        }
        displayTodos();
      })
      .catch(error => {
        console.error('Error updating todo:', error);
      });
  }
};

const deleteTodo = todoId => {
  fetch(`https://dummyjson.com/todos/1`, {
    method: 'DELETE',
  })
    .then(() => {
      todos = todos.filter(item => item.id !== todoId);
      displayTodos();
    })
    .catch(error => {
      console.error('Error deleting todo:', error);
    });
};

filterDropdown.addEventListener('change', filterTodos);
addTodoForm.addEventListener('submit', x => {
  x.preventDefault();
  addTodo();
});

getTodos()
  .then(() => {
    displayTodos();
  });
