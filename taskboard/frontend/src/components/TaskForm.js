import { useState } from 'react';

function TaskForm({ socket }) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Bug');
    const [priority, setPriority] = useState(2);

    const handleSubmit = () => {
        // Validation : titre non vide
        if (!title.trim()) return;

        socket.emit('task:create', { title, category, priority });

        // Réinitialiser le formulaire
        setTitle('');
        setCategory('Bug');
        setPriority(2);
    };

    return (
        <div className="task-form">
            <h3>➕ Créer une tâche</h3>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de la tâche"
                className="title-input"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <div className="form-row">
                <label>
                    Catégorie :
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Bug">🐛 Bug</option>
                        <option value="Fonctionnalité">✨ Fonctionnalité</option>
                        <option value="Amélioration">🔧 Amélioration</option>
                    </select>
                </label>
                <label>
                    Priorité :
                    <select value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
                        <option value={1}>🟢 Basse</option>
                        <option value={2}>🟡 Moyenne</option>
                        <option value={3}>🔴 Haute</option>
                    </select>
                </label>
            </div>
            <button className="btn-create" onClick={handleSubmit}>Créer la tâche</button>
        </div>
    );
}

export default TaskForm;