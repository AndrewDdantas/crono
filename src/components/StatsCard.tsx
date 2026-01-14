import React from 'react';
import { CronoResult } from '../types';

interface StatsCardProps {
    results: CronoResult | null;
    entriesCount: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ results, entriesCount }) => {
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
                    <div className="stat-label">Tempo Normal</div>
                    <div className="stat-value">--</div>
                </div>
                <div className="stat-card highlight">
                    <div className="stat-label">Tempo Padrão</div>
                    <div className="stat-value">--</div>
                </div>
            </div>
        );
    }

    return (
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
                    {results.stdDev.toFixed(3)}
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
                <div className="stat-label">Tempo Normal (TN)</div>
                <div className="stat-value">
                    {results.normalTime.toFixed(2)}
                    <span className="stat-unit">s</span>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-label">Tolerância Total</div>
                <div className="stat-value">
                    {results.totalTolerance.toFixed(0)}
                    <span className="stat-unit">%</span>
                </div>
            </div>

            <div className="stat-card highlight" style={{ gridColumn: 'span 2' }}>
                <div className="stat-label">⏱ Tempo Padrão (TP)</div>
                <div className="stat-value">
                    {results.standardTime.toFixed(2)}
                    <span className="stat-unit">s</span>
                </div>
            </div>
        </div>
    );
};
