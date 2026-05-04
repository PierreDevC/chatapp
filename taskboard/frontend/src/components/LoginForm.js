import { useState } from 'react';

function LoginForm({ socket, onJoin }) {
    const [pseudo, setPseudo] = useState('');

    const handleSubmit = () => {
        if (!pseudo.trim()) return; // Validation : pseudo non vide
        socket.emit('user:join', { pseudo });
        onJoin(pseudo);
    };

    return (
        <div className="login-container">
            <h1>📋 TaskBoard</h1>
            <h2>Rejoindre la session</h2>
            <input
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="Votre pseudo"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button onClick={handleSubmit}>Rejoindre</button>
        </div>
    );
}

export default LoginForm;