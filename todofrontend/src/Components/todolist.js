import React, { useState, useEffect } from 'react';
import TODOITEM from './todoitem';
import axios from 'axios'; 

const API_URL = 'http://localhost:5000/tasks'; 

function TOLIST() {
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [editMode, setEditMode] = useState(null); 
  const [editText, setEditText] = useState('');   

  
  useEffect(() => {
    axios.get(API_URL)
      .then(response => setTodos(response.data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const toggleComplete = (id) => {
    const todo = todos.find(todo => todo.id === id);
    axios.put(`${API_URL}/${id}`, { completed: !todo.completed })
      .then(() => {
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
      })
      .catch(error => console.error('Error updating todo:', error));
  };

  const editTodo = (id, text) => {
    setEditMode(id);
    setEditText(text);
  };

  const handleEditChange = (e) => {
    setEditText(e.target.value);
  };

  const handleEditSubmit = (id) => {
    axios.put(`${API_URL}/${id}`, { text: editText })
      .then(() => {
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, text: editText } : todo
        ));
        setEditMode(null);
        setEditText('');
      })
      .catch(error => console.error('Error updating todo:', error));
  };

  const deleteTodo = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  const handleChange = (e) => {
    setNewTodoText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodoText.trim() === '') return;

    axios.post(API_URL, { text: newTodoText })
      .then(response => {
        setTodos([...todos, response.data]);
        setNewTodoText('');
      })
      .catch(error => console.error('Error adding todo:', error));
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodoText}
          onChange={handleChange}
          placeholder="Add a new task"
        />
        <button type="submit">Add Todo</button>
      </form>
      <div className="todo-list">
        {todos.map(todo => (
          <TODOITEM
            key={todo.id}
            todo={todo}
            toggleComplete={toggleComplete}
            editTodo={editTodo} // Pass the function directly
            deleteTodo={deleteTodo}
            isEditing={editMode === todo.id}
            editText={editText}
            handleEditChange={handleEditChange}
            handleEditSubmit={handleEditSubmit}
          />
        ))}
      </div>
    </div>
  );
}

export default TOLIST;
