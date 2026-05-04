function TaskCard({ task, socket }) {
    const priorityLabels = { 1: '🟢 Basse', 2: '🟡 Moyenne', 3: '🔴 Haute' };
    const categoryIcons = { Bug: '🐛', Fonctionnalité: '✨', Amélioration: '🔧' };

    const handleToggle = () => {
        socket.emit('task:toggle', { taskId: task.id });
    };

    // Bonus 2 : supprimer la tâche
    const handleDelete = () => {
        socket.emit('task:delete', { taskId: task.id });
    };

    return (
        <div className={`task-card ${task.completed ? 'completed' : ''} priority-${task.priority}`}>
            <div className="task-header">
                <h4 className={task.completed ? 'strikethrough' : ''}>{task.title}</h4>
                <div className="badges">
                    <span className="badge-category">{categoryIcons[task.category] || ''} {task.category}</span>
                    <span className={`badge-priority priority-${task.priority}`}>{priorityLabels[task.priority]}</span>
                </div>
            </div>
            <p className="task-author">Créée par : {task.authorPseudo}</p>
            <div className="task-actions">
                <button className="btn-toggle" onClick={handleToggle}>
                    {task.completed ? '↩️ Remettre en cours' : '✅ Marquer complétée'}
                </button>
                {/* Bonus 2 : bouton supprimer (visible pour tous, mais seul l'auteur peut supprimer côté serveur) */}
                <button className="btn-delete" onClick={handleDelete}>🗑️ Supprimer</button>
            </div>
        </div>
    );
}

export default TaskCard;