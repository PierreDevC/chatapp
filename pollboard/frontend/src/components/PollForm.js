import { useState } from 'react';

function PollForm({ socket }) {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length < 4) {
            setOptions([...options, '']);
        }
    };

    const removeOption = (index) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = () => {
        // Validation : question non vide + min. 2 options non vides
        if (!question.trim()) return;
        const validOptions = options.filter(o => o.trim() !== '');
        if (validOptions.length < 2) return;

        socket.emit('poll:create', { question, options: validOptions });

        // Réinitialiser le formulaire
        setQuestion('');
        setOptions(['', '']);
    };

    return (
        <div className="poll-form">
            <h3>📝 Créer un sondage</h3>
            <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Votre question"
                className="question-input"
            />
            {options.map((opt, i) => (
                <div key={i} className="option-row">
                    <input
                        value={opt}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                        placeholder={`Option ${i + 1}`}
                    />
                    {options.length > 2 && (
                        <button className="btn-remove" onClick={() => removeOption(i)}>✕</button>
                    )}
                </div>
            ))}
            {options.length < 4 && (
                <button className="btn-add" onClick={addOption}>+ Ajouter une option</button>
            )}
            <button className="btn-create" onClick={handleSubmit}>Créer le sondage</button>
        </div>
    );
}

export default PollForm;