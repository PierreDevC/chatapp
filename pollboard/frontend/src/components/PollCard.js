function PollCard({ poll, socket, hasVoted, onVote }) {
    const totalVotes = poll.votes.reduce((a, b) => a + b, 0);

    const handleVote = (optionIndex) => {
        if (hasVoted || poll.closed) return;
        socket.emit('poll:vote', { pollId: poll.id, optionIndex });
        onVote();
    };

    // Bonus 2 : fermer le sondage
    const handleClose = () => {
        socket.emit('poll:close', { pollId: poll.id });
    };

    return (
        <div className={`poll-card ${poll.closed ? 'closed' : ''}`}>
            <h4>{poll.question}</h4>
            {poll.closed && <span className="badge-closed">🔒 Terminé</span>}

            {poll.options.map((option, i) => {
                const percent = totalVotes > 0 ? Math.round((poll.votes[i] / totalVotes) * 100) : 0;
                return (
                    <div key={i} className="option">
                        <button
                            onClick={() => handleVote(i)}
                            disabled={hasVoted || poll.closed}
                            className="btn-vote"
                        >
                            {option}
                        </button>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="vote-count">{poll.votes[i]} vote(s) — {percent}%</span>
                    </div>
                );
            })}

            <p className="total">Total : {totalVotes} vote(s)</p>

            {/* Bonus 2 : bouton fermer visible seulement pour l'auteur */}
            {!poll.closed && (
                <button className="btn-close" onClick={handleClose}>🔒 Fermer le sondage</button>
            )}
        </div>
    );
}

export default PollCard;