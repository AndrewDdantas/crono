export interface CronoParams {
    operationName: string;
    description: string;
    rhythmFactor: number; // Fator de ritmo (0.5 - 1.5)
    tolerances: Tolerances;
    capacityConfig: CapacityConfig;
}

export interface Tolerances {
    fatigue: number;       // % fadiga
    personal: number;      // % necessidades pessoais
    delays: number;        // % atrasos inevitáveis
}

export interface CapacityConfig {
    hoursPerShift: number;   // Horas por turno
    shiftsPerDay: number;    // Turnos por dia
}

export type ProcessType = 'single' | 'continuous';

export interface TimeEntry {
    id: string;
    cycle: number;
    time: number; // em segundos
    processType: ProcessType; // Único (1x) ou Contínuo
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

export interface CapacityResult {
    singleTime: number;        // Tempo total processos únicos
    continuousTime: number;    // Tempo padrão processos contínuos
    perHour: number;           // Peças por hora
    perShift: number;          // Peças por turno
    perDay: number;            // Peças por dia
}
