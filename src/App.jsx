import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTodo = { title, complete: false };

    try {
      const response = await fetch('http://localhost:5000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (response.status === 201) {
        fetchTodos();
        setTitle('');
      } else {
        console.error('Failed to create todo');
      }
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ complete: true }),
      });

      if (response.status === 201) {
        fetchTodos();
      } else {
        console.error('Failed to complete todo');
      }
    } catch (error) {
      console.error('Error completing todo:', error);
    }
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter todo title"
          required
        />
        <button type="submit">Add Todo</button>
      </form>
      <h2>Incomplete Todos</h2>
      <ul>
        {todos.filter(todo => !todo.complete).map((todo) => (
          <li key={todo.id}>
            {todo.title} - {todo.complete ? 'Complete' : 'Incomplete'}
            <button onClick={() => handleComplete(todo.id)}>Complete</button>
          </li>
        ))}
      </ul>
      <h2>Completed Todos</h2>
      <ul>
        {todos.filter(todo => todo.complete).map((todo) => (
          <li key={todo.id}>
            {todo.title} - {todo.complete ? 'Complete' : 'Incomplete'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;