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
const polls = [];   // [{ id, question, options, votes:[], voters:{}, author }]

io.on('connection', (socket) => {
    console.log('Nouvelle connexion :', socket.id);

    // --- user:join ---
    socket.on('user:join', ({ pseudo }) => {
        users[socket.id] = pseudo;
        // Bonus 1 : diffuser le nombre de participants
        io.emit('users:count', Object.keys(users).length);
        // Envoyer les sondages existants au nouveau venu
        socket.emit('polls:update', polls);
    });

    // --- poll:create ---
    socket.on('poll:create', ({ question, options }) => {
        const poll = {
            id: Date.now(),
            question,
            options,
            votes: new Array(options.length).fill(0),
            voters: {},
            author: socket.id,
            closed: false
        };
        polls.push(poll);
        io.emit('polls:update', polls);
    });

    // --- poll:vote ---
    socket.on('poll:vote', ({ pollId, optionIndex }) => {
        const poll = polls.find(p => p.id === pollId);
        if (poll && !poll.closed && !poll.voters[socket.id]) {
            poll.votes[optionIndex]++;
            poll.voters[socket.id] = optionIndex;
            io.emit('polls:update', polls);
        }
    });

    // --- Bonus 2 : poll:close ---
    socket.on('poll:close', ({ pollId }) => {
        const poll = polls.find(p => p.id === pollId);
        if (poll && poll.author === socket.id) {
            poll.closed = true;
            io.emit('polls:update', polls);
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