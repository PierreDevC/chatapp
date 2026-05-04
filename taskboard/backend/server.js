const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// ---- État en mémoire ----
const users = {};   // { socketId: pseudo }
const tasks = [];   // [{ id, title, category, priority, completed, author, authorPseudo }]

io.on('connection', (socket) => {
    console.log('Nouvelle connexion :', socket.id);

    // --- user:join ---
    socket.on('user:join', ({ pseudo }) => {
        users[socket.id] = pseudo;
        // Bonus 1 : diffuser le nombre de participants
        io.emit('users:count', Object.keys(users).length);
        // Envoyer les tâches existantes au nouveau venu
        socket.emit('tasks:update', tasks);
    });

    // --- task:create ---
    socket.on('task:create', ({ title, category, priority }) => {
        const task = {
            id: Date.now(),
            title,
            category,
            priority,
            completed: false,
            author: socket.id,
            authorPseudo: users[socket.id] || 'Inconnu'
        };
        tasks.push(task);
        io.emit('tasks:update', tasks);
    });

    // --- task:toggle ---
    socket.on('task:toggle', ({ taskId }) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            io.emit('tasks:update', tasks);
        }
    });

    // --- Bonus 2 : task:delete ---
    socket.on('task:delete', ({ taskId }) => {
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1 && tasks[index].author === socket.id) {
            tasks.splice(index, 1);
            io.emit('tasks:update', tasks);
        }
    });

    // --- disconnect ---
    socket.on('disconnect', () => {
        console.log('Déconnexion :', socket.id, users[socket.id]);
        delete users[socket.id];
        // Bonus 1 : mettre à jour le compteur
        io.emit('users:count', Object.keys(users).length);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});