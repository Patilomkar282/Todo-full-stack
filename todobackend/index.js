const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(express.json());  
app.use(cors());         


let tasks = [];


app.get('/tasks', (req, res) => {
  res.json(tasks);
});


app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
});


app.post('/tasks', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Text is required' });

  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    text: text,
    completed: false,
    time: new Date().toLocaleString(),
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});


app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const { text, completed } = req.body;
  if (text) task.text = text;
  if (typeof completed === 'boolean') task.completed = completed;

  res.json(task);
});


app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Task not found' });

  tasks.splice(index, 1);
  res.status(204).end();
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
