import React from 'react';
import { CronoParams, Tolerances } from '../types';

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
                    <span className="form-hint">Padrão: 1.0 | Ritmo lento: &lt;1 | Ritmo rápido: &gt;1</span>
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
                    <label className="form-label">Tolerância - Necessidades Pessoais (%)</label>
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
                    <label className="form-label">Tolerância - Atrasos Inevitáveis (%)</label>
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
        </div>
    );
};
