const todoContainer = document.getElementById('todos');
const filterDropdown = document.getElementById('filterDropdown');
const addTodoForm = document.getElementById('addTodoForm');
const userIdInput = document.getElementById('userIdInput');
const todoInput = document.getElementById('todoInput');
let todos = [];

const getTodos = () => {
  return fetch('https://dummyjson.com/todos')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error fetching todos');
      }
      return response.json();
    })
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

    checkbox.addEventListener('change', event => handleCompletionChange(event, item.id));
    deleteButton.addEventListener('click', () => deleteTodo(item.id));

    div.appendChild(todo);
   
    div.appendChild(checkbox);
    div.appendChild(completed);
    div.appendChild(deleteButton);
    div.setAttribute('key', item.id);
    div.setAttribute('class', 'todo');

    if (item.completed) {
      div.style.backgroundColor = 'purple';
    } else {
      div.style.backgroundColor = 'green';
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

    checkbox.addEventListener('change', event => handleCompletionChange(event, item.id));
    deleteButton.addEventListener('click', () => deleteTodo(item.id));

    div.appendChild(todo);
    
    div.appendChild(checkbox);
    div.appendChild(completed);
    div.appendChild(deleteButton);
    div.setAttribute('key', item.id);
    div.setAttribute('class', 'todo');

    if (item.completed) {
      div.style.backgroundColor = 'purple';
    } else {
      div.style.backgroundColor = 'green';
    }

    todoContainer.appendChild(div);
  });
};

const addTodo = (userId, todo) => {
  const newTodo = {
    userId,
    todo,
    completed: false
  };

  fetch('https://dummyjson.com/todos/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTodo)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error adding todo');
      }
      return response.json();
    })
    .then(response => {
      todos.push(response);
      displayTodos();
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
        if (!response.ok) {
          throw new Error('Error updating todo');
        }
        return response.json();
      })
      .then(response => {
        const updatedIndex = todos.findIndex(item => item.id === todoId);
        if (updatedIndex !== -1) {
          todos[updatedIndex] = response;
        }
        displayTodos();
      })
      .catch(error => {
        console.error('Error updating todo:', error);
      });
  }
};

const deleteTodo = (todoId) => {
  fetch(`https://dummyjson.com/todos/1`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error deleting todo');
      }
      return response.json();
    })
    .then(response => {
      todos = todos.filter(item => item.id !== todoId);
      displayTodos();
    })
    .catch(error => {
      console.error('Error deleting todo:', error);
    });
};

const handleCompletionChange = (event, todoId) => {
  const completed = event.target.checked;
  const todoIndex = todos.findIndex(item => item.id === todoId);
  if (todoIndex !== -1) {
    todos[todoIndex].completed = completed;
  }

  fetch(`https://dummyjson.com/todos/1`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ completed })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error updating todo');
      }
      return response.json();
    })
    .then(response => {
      const updatedIndex = todos.findIndex(item => item.id === todoId);
      if (updatedIndex !== -1) {
        todos[updatedIndex] = response;
      }
      displayTodos();
    })
    .catch(error => {
      console.error('Error updating todo:', error);
    });

  const label = event.target.parentNode.querySelector('p');
  label.textContent = `Completed: ${completed}`;
};

filterDropdown.addEventListener('change', filterTodos);

addTodoForm.addEventListener('submit', event => {
  event.preventDefault();

  const userId = userIdInput.value;
  const todo = todoInput.value;

  if (userId && todo) {
    addTodo(userId, todo);

    userIdInput.value = '';
    todoInput.value = '';
  }
});

getTodos().then(displayTodos);
addTodo()

