import React from 'react';
import { CronoResult, CapacityResult } from '../types';

interface StatsCardProps {
    results: CronoResult | null;
    capacity: CapacityResult | null;
    entriesCount: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ results, capacity, entriesCount }) => {
    if (!results || entriesCount === 0) {
        return (
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Amostras</div>
                    <div className="stat-value">0</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Tempo Médio</div>
                    <div className="stat-value">--</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Tempo Padrão</div>
                    <div className="stat-value">--</div>
                </div>
                <div className="stat-card highlight">
                    <div className="stat-label">📦 Capacidade/Turno</div>
                    <div className="stat-value">--</div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Estatísticas de Tempo */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Amostras</div>
                    <div className="stat-value">{entriesCount}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Tempo Médio</div>
                    <div className="stat-value">
                        {results.meanTime.toFixed(2)}
                        <span className="stat-unit">s</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Desvio Padrão</div>
                    <div className="stat-value">
                        {results.stdDev.toFixed(2)}
                        <span className="stat-unit">s</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Coef. Variação</div>
                    <div className="stat-value">
                        {results.coefficientOfVariation.toFixed(1)}
                        <span className="stat-unit">%</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Tempo Normal</div>
                    <div className="stat-value">
                        {results.normalTime.toFixed(2)}
                        <span className="stat-unit">s</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">Tolerância</div>
                    <div className="stat-value">
                        {results.totalTolerance.toFixed(0)}
                        <span className="stat-unit">%</span>
                    </div>
                </div>

                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)', color: 'white', border: 'none' }}>
                    <div className="stat-label" style={{ color: 'rgba(255,255,255,0.9)' }}>⏱ Tempo Padrão</div>
                    <div className="stat-value">
                        {results.standardTime.toFixed(2)}
                        <span className="stat-unit">s</span>
                    </div>
                </div>

                {capacity && capacity.continuousTime > 0 && (
                    <div className="stat-card highlight">
                        <div className="stat-label">🔄 Tempo Contínuo</div>
                        <div className="stat-value">
                            {capacity.continuousTime.toFixed(2)}
                            <span className="stat-unit">s</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Capacidade Produtiva */}
            {capacity && capacity.continuousTime > 0 && (
                <div style={{ marginTop: 'var(--space-4)' }}>
                    <h3 style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        marginBottom: 'var(--space-3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        📊 Capacidade Produtiva
                    </h3>
                    <div className="stats-grid">
                        {capacity.singleTime > 0 && (
                            <div className="stat-card" style={{ background: 'var(--warning-light)' }}>
                                <div className="stat-label">⚡ Setup (1x)</div>
                                <div className="stat-value" style={{ color: 'var(--warning)' }}>
                                    {capacity.singleTime.toFixed(1)}
                                    <span className="stat-unit">s</span>
                                </div>
                            </div>
                        )}

                        <div className="stat-card">
                            <div className="stat-label">Peças/Hora</div>
                            <div className="stat-value">
                                {capacity.perHour.toLocaleString()}
                                <span className="stat-unit">un</span>
                            </div>
                        </div>

                        <div className="stat-card highlight">
                            <div className="stat-label">📦 Peças/Turno</div>
                            <div className="stat-value">
                                {capacity.perShift.toLocaleString()}
                                <span className="stat-unit">un</span>
                            </div>
                        </div>

                        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)', color: 'white', border: 'none' }}>
                            <div className="stat-label" style={{ color: 'rgba(255,255,255,0.9)' }}>🏭 Peças/Dia</div>
                            <div className="stat-value">
                                {capacity.perDay.toLocaleString()}
                                <span className="stat-unit">un</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
