export interface CronoParams {
    operationName: string;
    description: string;
    rhythmFactor: number; // Fator de ritmo (0.5 - 1.5)
    tolerances: Tolerances;
}

export interface Tolerances {
    fatigue: number;       // % fadiga
    personal: number;      // % necessidades pessoais
    delays: number;        // % atrasos inevitáveis
}

export interface TimeEntry {
    id: string;
    cycle: number;
    time: number; // em segundos
    notes?: string;
}

export interface CronoResult {
    meanTime: number;          // Tempo Médio
    stdDev: number;            // Desvio Padrão
    normalTime: number;        // Tempo Normal
    standardTime: number;      // Tempo Padrão
    coefficientOfVariation: number; // Coeficiente de Variação (%)
    totalTolerance: number;    // Tolerância Total (%)
}
