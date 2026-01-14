import { Tolerances, CronoResult, CapacityConfig, CapacityResult, TimeEntry } from '../types';

/**
 * Calcula a média dos tempos
 */
export function calculateMean(times: number[]): number {
    if (times.length === 0) return 0;
    const sum = times.reduce((acc, time) => acc + time, 0);
    return sum / times.length;
}

/**
 * Calcula o desvio padrão
 */
export function calculateStdDev(times: number[]): number {
    if (times.length < 2) return 0;
    const mean = calculateMean(times);
    const squaredDiffs = times.map(time => Math.pow(time - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / (times.length - 1);
    return Math.sqrt(avgSquaredDiff);
}

/**
 * Calcula o Tempo Normal
 * TN = Tempo Médio × Fator de Ritmo
 */
export function calculateNormalTime(meanTime: number, rhythmFactor: number): number {
    return meanTime * rhythmFactor;
}

/**
 * Calcula o Tempo Padrão
 * TP = TN × (1 + Tolerância Total)
 */
export function calculateStandardTime(normalTime: number, tolerances: Tolerances): number {
    const totalTolerance = (tolerances.fatigue + tolerances.personal + tolerances.delays) / 100;
    return normalTime * (1 + totalTolerance);
}

/**
 * Calcula o Coeficiente de Variação (%)
 */
export function calculateCV(stdDev: number, mean: number): number {
    if (mean === 0) return 0;
    return (stdDev / mean) * 100;
}

/**
 * Calcula todos os resultados da cronoanálise
 */
export function calculateCronoResults(
    times: number[],
    rhythmFactor: number,
    tolerances: Tolerances
): CronoResult {
    const meanTime = calculateMean(times);
    const stdDev = calculateStdDev(times);
    const normalTime = calculateNormalTime(meanTime, rhythmFactor);
    const standardTime = calculateStandardTime(normalTime, tolerances);
    const coefficientOfVariation = calculateCV(stdDev, meanTime);
    const totalTolerance = tolerances.fatigue + tolerances.personal + tolerances.delays;

    return {
        meanTime,
        stdDev,
        normalTime,
        standardTime,
        coefficientOfVariation,
        totalTolerance
    };
}

/**
 * Calcula a capacidade produtiva
 * Separa processos únicos (1x no ciclo) e contínuos
 */
export function calculateCapacity(
    entries: TimeEntry[],
    rhythmFactor: number,
    tolerances: Tolerances,
    config: CapacityConfig
): CapacityResult {
    // Separar entradas por tipo
    const singleEntries = entries.filter(e => e.processType === 'single' && e.time > 0);
    const continuousEntries = entries.filter(e => e.processType === 'continuous' && e.time > 0);

    // Calcular tempo total dos processos únicos (soma de todos)
    const singleTimes = singleEntries.map(e => e.time);
    const singleMean = calculateMean(singleTimes);
    const singleNormal = calculateNormalTime(singleMean, rhythmFactor);
    const singleTime = calculateStandardTime(singleNormal, tolerances) * singleEntries.length;

    // Calcular tempo padrão dos processos contínuos (média)
    const continuousTimes = continuousEntries.map(e => e.time);
    const continuousMean = calculateMean(continuousTimes);
    const continuousNormal = calculateNormalTime(continuousMean, rhythmFactor);
    const continuousTime = calculateStandardTime(continuousNormal, tolerances);

    // Calcular capacidade
    const secondsPerShift = config.hoursPerShift * 3600;
    const secondsPerDay = secondsPerShift * config.shiftsPerDay;

    let perHour = 0;
    let perShift = 0;
    let perDay = 0;

    if (continuousTime > 0) {
        // Capacidade por hora (apenas processos contínuos)
        perHour = Math.floor(3600 / continuousTime);

        // Capacidade por turno (descontando tempo único no início)
        const availableTimeShift = Math.max(0, secondsPerShift - singleTime);
        perShift = Math.floor(availableTimeShift / continuousTime);

        // Capacidade por dia (tempo único apenas 1x por dia ou por turno?)
        // Assumindo tempo único 1x por turno
        const availableTimeDay = Math.max(0, secondsPerDay - (singleTime * config.shiftsPerDay));
        perDay = Math.floor(availableTimeDay / continuousTime);
    }

    return {
        singleTime,
        continuousTime,
        perHour,
        perShift,
        perDay
    };
}

/**
 * Formata tempo em segundos para exibição
 */
export function formatTime(seconds: number): string {
    if (seconds < 60) {
        return `${seconds.toFixed(2)}s`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toFixed(2)}s`;
}

/**
 * Formata milissegundos para display do cronômetro
 */
export function formatStopwatchTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
}

/**
 * Gera um ID único
 */
export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
