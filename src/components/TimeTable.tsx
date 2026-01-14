import React from 'react';
import { TimeEntry, ProcessType } from '../types';
import { generateId } from '../utils/calculations';

interface TimeTableProps {
    entries: TimeEntry[];
    onEntriesChange: (entries: TimeEntry[]) => void;
}

export const TimeTable: React.FC<TimeTableProps> = ({ entries, onEntriesChange }) => {
    const handleAddEntry = (processType: ProcessType = 'continuous') => {
        const newEntry: TimeEntry = {
            id: generateId(),
            cycle: entries.length + 1,
            time: 0,
            processType,
            notes: ''
        };
        onEntriesChange([...entries, newEntry]);
    };

    const handleUpdateEntry = (id: string, field: keyof TimeEntry, value: number | string) => {
        onEntriesChange(
            entries.map(entry =>
                entry.id === id ? { ...entry, [field]: value } : entry
            )
        );
    };

    const handleDeleteEntry = (id: string) => {
        const filtered = entries.filter(entry => entry.id !== id);
        // Renumber cycles
        const renumbered = filtered.map((entry, index) => ({
            ...entry,
            cycle: index + 1
        }));
        onEntriesChange(renumbered);
    };

    const handleClearAll = () => {
        onEntriesChange([]);
    };

    // Contagem por tipo
    const singleCount = entries.filter(e => e.processType === 'single').length;
    const continuousCount = entries.filter(e => e.processType === 'continuous').length;

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">
                    <span className="card-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 3h18v18H3zM3 9h18M9 21V9" />
                        </svg>
                    </span>
                    Tempos Cronometrados
                    {entries.length > 0 && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 400, marginLeft: '0.5rem', color: 'var(--text-secondary)' }}>
                            ({singleCount} únicos, {continuousCount} contínuos)
                        </span>
                    )}
                </h2>
                <div className="flex gap-2">
                    <button className="btn btn-primary" onClick={() => handleAddEntry('continuous')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        + Contínuo
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleAddEntry('single')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        + Único
                    </button>
                    {entries.length > 0 && (
                        <button className="btn btn-secondary" onClick={handleClearAll}>
                            Limpar
                        </button>
                    )}
                </div>
            </div>

            {entries.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="3" y1="9" x2="21" y2="9" />
                            <line x1="9" y1="21" x2="9" y2="9" />
                        </svg>
                    </div>
                    <h3 className="empty-state-title">Nenhum tempo registrado</h3>
                    <p className="empty-state-text">
                        <strong>Contínuo:</strong> Processos repetidos a cada ciclo<br />
                        <strong>Único:</strong> Setup/preparação (1x por turno)
                    </p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>#</th>
                                <th style={{ width: '130px' }}>Tipo</th>
                                <th style={{ width: '120px' }}>Tempo (s)</th>
                                <th>Observações</th>
                                <th style={{ width: '60px' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map(entry => (
                                <tr key={entry.id}>
                                    <td className="text-center font-bold">
                                        {entry.cycle}
                                    </td>
                                    <td>
                                        <select
                                            className="table-input"
                                            value={entry.processType}
                                            onChange={(e) => handleUpdateEntry(entry.id, 'processType', e.target.value as ProcessType)}
                                            style={{
                                                backgroundColor: entry.processType === 'single' ? 'var(--warning-light)' : 'var(--success-light)',
                                                fontWeight: 500
                                            }}
                                        >
                                            <option value="continuous">🔄 Contínuo</option>
                                            <option value="single">⚡ Único</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="table-input"
                                            min="0"
                                            step="0.01"
                                            value={entry.time}
                                            onChange={(e) => handleUpdateEntry(entry.id, 'time', parseFloat(e.target.value) || 0)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="table-input"
                                            placeholder="Observações..."
                                            value={entry.notes || ''}
                                            onChange={(e) => handleUpdateEntry(entry.id, 'notes', e.target.value)}
                                        />
                                    </td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-icon btn-secondary"
                                            onClick={() => handleDeleteEntry(entry.id)}
                                            title="Remover"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
