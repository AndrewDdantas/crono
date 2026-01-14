import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ParameterForm } from './components/ParameterForm';
import { Stopwatch } from './components/Stopwatch';
import { TimeTable } from './components/TimeTable';
import { StatsCard } from './components/StatsCard';
import { CronoParams, TimeEntry } from './types';
import { calculateCronoResults, generateId } from './utils/calculations';

const defaultParams: CronoParams = {
    operationName: '',
    description: '',
    rhythmFactor: 1.0,
    tolerances: {
        fatigue: 5,
        personal: 3,
        delays: 2
    }
};

function App() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [params, setParams] = useState<CronoParams>(defaultParams);
    const [entries, setEntries] = useState<TimeEntry[]>([]);

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Calculate results whenever entries or params change
    const results = useMemo(() => {
        const times = entries.map(e => e.time).filter(t => t > 0);
        if (times.length === 0) return null;
        return calculateCronoResults(times, params.rhythmFactor, params.tolerances);
    }, [entries, params.rhythmFactor, params.tolerances]);

    const handleThemeToggle = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLapRecord = (timeInSeconds: number) => {
        const newEntry: TimeEntry = {
            id: generateId(),
            cycle: entries.length + 1,
            time: parseFloat(timeInSeconds.toFixed(2)),
            notes: ''
        };
        setEntries(prev => [...prev, newEntry]);
    };

    return (
        <div className="app-container">
            <Header theme={theme} onThemeToggle={handleThemeToggle} />

            <main className="main-content">
                {/* Stats Overview */}
                <StatsCard results={results} entriesCount={entries.length} />

                {/* Parameters and Stopwatch */}
                <div className="section-grid">
                    <ParameterForm params={params} onParamsChange={setParams} />
                    <Stopwatch onLapRecord={handleLapRecord} />
                </div>

                {/* Time Entries Table */}
                <TimeTable entries={entries} onEntriesChange={setEntries} />
            </main>
        </div>
    );
}

export default App;
