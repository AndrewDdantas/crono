import React, { useState, useRef, useCallback } from 'react';
import { formatStopwatchTime } from '../utils/calculations';

interface StopwatchProps {
    onLapRecord: (timeInSeconds: number) => void;
}

export const Stopwatch: React.FC<StopwatchProps> = ({ onLapRecord }) => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const intervalRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const accumulatedTimeRef = useRef<number>(0);

    const start = useCallback(() => {
        if (!isRunning) {
            setIsRunning(true);
            startTimeRef.current = Date.now();
            intervalRef.current = window.setInterval(() => {
                setTime(accumulatedTimeRef.current + (Date.now() - startTimeRef.current));
            }, 10);
        }
    }, [isRunning]);

    const stop = useCallback(() => {
        if (isRunning) {
            setIsRunning(false);
            accumulatedTimeRef.current += Date.now() - startTimeRef.current;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, [isRunning]);

    const reset = useCallback(() => {
        stop();
        setTime(0);
        accumulatedTimeRef.current = 0;
        setLaps([]);
    }, [stop]);

    const lap = useCallback(() => {
        if (isRunning && time > 0) {
            const lapTime = time / 1000; // Convert to seconds
            setLaps(prev => [...prev, lapTime]);
            onLapRecord(lapTime);
            // Reset for next lap
            accumulatedTimeRef.current = 0;
            startTimeRef.current = Date.now();
            setTime(0);
        }
    }, [isRunning, time, onLapRecord]);

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">
                    <span className="card-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </span>
                    Cronômetro
                </h2>
            </div>

            <div className="stopwatch">
                <div className={`stopwatch-display ${isRunning ? 'running' : ''}`}>
                    {formatStopwatchTime(time)}
                </div>

                <div className="stopwatch-buttons">
                    {!isRunning ? (
                        <button className="btn btn-success btn-lg" onClick={start}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            Iniciar
                        </button>
                    ) : (
                        <button className="btn btn-danger btn-lg" onClick={stop}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                            </svg>
                            Pausar
                        </button>
                    )}

                    <button
                        className="btn btn-primary btn-lg"
                        onClick={lap}
                        disabled={!isRunning || time === 0}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Registrar Volta
                    </button>

                    <button className="btn btn-secondary" onClick={reset}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                        Resetar
                    </button>
                </div>

                {laps.length > 0 && (
                    <div className="stopwatch-lap">
                        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Voltas Registradas ({laps.length})
                        </h4>
                        {laps.map((lapTime, index) => (
                            <div key={index} className="lap-item">
                                <span className="lap-number">Volta {index + 1}</span>
                                <span className="lap-time">{lapTime.toFixed(2)}s</span>
                            </div>
                        )).reverse()}
                    </div>
                )}
            </div>
        </div>
    );
};
