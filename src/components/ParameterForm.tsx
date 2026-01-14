import React from 'react';
import { CronoParams, Tolerances, CapacityConfig } from '../types';

interface ParameterFormProps {
    params: CronoParams;
    onParamsChange: (params: CronoParams) => void;
}

export const ParameterForm: React.FC<ParameterFormProps> = ({ params, onParamsChange }) => {
    const handleChange = (field: keyof CronoParams, value: string | number) => {
        onParamsChange({
            ...params,
            [field]: value
        });
    };

    const handleToleranceChange = (field: keyof Tolerances, value: number) => {
        onParamsChange({
            ...params,
            tolerances: {
                ...params.tolerances,
                [field]: value
            }
        });
    };

    const handleCapacityChange = (field: keyof CapacityConfig, value: number) => {
        onParamsChange({
            ...params,
            capacityConfig: {
                ...params.capacityConfig,
                [field]: value
            }
        });
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">
                    <span className="card-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                    </span>
                    Parâmetros da Operação
                </h2>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Nome da Operação</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Ex: Montagem de peça A"
                        value={params.operationName}
                        onChange={(e) => handleChange('operationName', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Descrição</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Descrição detalhada da operação"
                        value={params.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Fator de Ritmo</label>
                    <input
                        type="number"
                        className="form-input"
                        min="0.5"
                        max="1.5"
                        step="0.05"
                        value={params.rhythmFactor}
                        onChange={(e) => handleChange('rhythmFactor', parseFloat(e.target.value) || 1)}
                    />
                    <span className="form-hint">Padrão: 1.0 | Lento: &lt;1 | Rápido: &gt;1</span>
                </div>

                <div className="form-group">
                    <label className="form-label">Tolerância - Fadiga (%)</label>
                    <input
                        type="number"
                        className="form-input"
                        min="0"
                        max="50"
                        step="1"
                        value={params.tolerances.fatigue}
                        onChange={(e) => handleToleranceChange('fatigue', parseFloat(e.target.value) || 0)}
                    />
                    <span className="form-hint">Típico: 4% a 10%</span>
                </div>

                <div className="form-group">
                    <label className="form-label">Tolerância - Necessidades (%)</label>
                    <input
                        type="number"
                        className="form-input"
                        min="0"
                        max="20"
                        step="1"
                        value={params.tolerances.personal}
                        onChange={(e) => handleToleranceChange('personal', parseFloat(e.target.value) || 0)}
                    />
                    <span className="form-hint">Típico: 2% a 5%</span>
                </div>

                <div className="form-group">
                    <label className="form-label">Tolerância - Atrasos (%)</label>
                    <input
                        type="number"
                        className="form-input"
                        min="0"
                        max="20"
                        step="1"
                        value={params.tolerances.delays}
                        onChange={(e) => handleToleranceChange('delays', parseFloat(e.target.value) || 0)}
                    />
                    <span className="form-hint">Típico: 1% a 5%</span>
                </div>
            </div>

            {/* Configuração de Capacidade */}
            <div style={{
                marginTop: 'var(--space-5)',
                paddingTop: 'var(--space-5)',
                borderTop: '1px solid var(--border-color)'
            }}>
                <h3 style={{
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 600,
                    marginBottom: 'var(--space-4)',
                    color: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    Configuração de Capacidade
                </h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Horas por Turno</label>
                        <input
                            type="number"
                            className="form-input"
                            min="1"
                            max="24"
                            step="0.5"
                            value={params.capacityConfig.hoursPerShift}
                            onChange={(e) => handleCapacityChange('hoursPerShift', parseFloat(e.target.value) || 8)}
                        />
                        <span className="form-hint">Ex: 8 horas</span>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Turnos por Dia</label>
                        <input
                            type="number"
                            className="form-input"
                            min="1"
                            max="4"
                            step="1"
                            value={params.capacityConfig.shiftsPerDay}
                            onChange={(e) => handleCapacityChange('shiftsPerDay', parseInt(e.target.value) || 1)}
                        />
                        <span className="form-hint">Ex: 1, 2 ou 3 turnos</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
