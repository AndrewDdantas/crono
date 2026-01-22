import { useState, useEffect, useCallback } from 'react'
import Timer from './components/Timer'
import Config from './components/Config'
import ProcessList from './components/ProcessList'
import Measurements from './components/Measurements'
import Calculations from './components/Calculations'

// Generate unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

// Calculate work days in a month
const getWorkDaysInMonth = (year, month, includeSaturday, includeSunday) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    let workDays = 0

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        const dayOfWeek = date.getDay()

        // 0 = Sunday, 6 = Saturday
        if (dayOfWeek === 0) {
            if (includeSunday) workDays++
        } else if (dayOfWeek === 6) {
            if (includeSaturday) workDays++
        } else {
            workDays++ // Mon-Fri always counted
        }
    }

    return workDays
}

// Get month name in Portuguese
const getMonthName = (month) => {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    return months[month]
}

function App() {
    // Timer state
    const [isRunning, setIsRunning] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [startTime, setStartTime] = useState(0)

    // Processes state
    const [processes, setProcesses] = useState([])
    const [currentProcessId, setCurrentProcessId] = useState(null)

    // Config state
    const now = new Date()
    const [config, setConfig] = useState({
        fatigue: 10,
        shiftHours: 8,
        shiftsPerDay: 1,
        targetPieces: 1000,
        month: now.getMonth(),
        year: now.getFullYear(),
        includeSaturday: false,
        includeSunday: false
    })

    // Computed work days
    const [workDays, setWorkDays] = useState(22)

    // Update work days when config changes
    useEffect(() => {
        const days = getWorkDaysInMonth(
            config.year,
            config.month,
            config.includeSaturday,
            config.includeSunday
        )
        setWorkDays(days)
    }, [config.month, config.year, config.includeSaturday, config.includeSunday])

    // Load state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('cronoanalise')
        if (saved) {
            try {
                const data = JSON.parse(saved)
                if (data.processes) setProcesses(data.processes)
                if (data.currentProcessId) setCurrentProcessId(data.currentProcessId)
                if (data.config) setConfig(prev => ({ ...prev, ...data.config }))
            } catch (e) {
                console.error('Error loading state:', e)
            }
        }
    }, [])

    // Save state to localStorage
    useEffect(() => {
        const data = { processes, currentProcessId, config }
        localStorage.setItem('cronoanalise', JSON.stringify(data))
    }, [processes, currentProcessId, config])

    // Timer tick
    useEffect(() => {
        let intervalId
        if (isRunning) {
            intervalId = setInterval(() => {
                setElapsedTime(prev => prev + (Date.now() - startTime))
                setStartTime(Date.now())
            }, 10)
        }
        return () => clearInterval(intervalId)
    }, [isRunning, startTime])

    // Timer functions
    const handleStart = useCallback(() => {
        setIsRunning(true)
        setStartTime(Date.now())
    }, [])

    const handleStop = useCallback(() => {
        setIsRunning(false)
    }, [])

    const handleReset = useCallback(() => {
        setIsRunning(false)
        setElapsedTime(0)
        setStartTime(0)
    }, [])

    const handleLap = useCallback(() => {
        if (!currentProcessId || elapsedTime === 0) return

        setProcesses(prev => prev.map(process => {
            if (process.id === currentProcessId) {
                return {
                    ...process,
                    measurements: [
                        ...process.measurements,
                        {
                            id: generateId(),
                            time: elapsedTime,
                            timestamp: new Date().toISOString()
                        }
                    ]
                }
            }
            return process
        }))

        // Reset timer after recording
        handleReset()
    }, [currentProcessId, elapsedTime, handleReset])

    // Process functions
    const handleAddProcess = useCallback((name) => {
        const newProcess = {
            id: generateId(),
            name,
            measurements: [],
            createdAt: new Date().toISOString()
        }
        setProcesses(prev => [...prev, newProcess])
        setCurrentProcessId(newProcess.id)
    }, [])

    const handleSelectProcess = useCallback((id) => {
        setCurrentProcessId(id)
    }, [])

    const handleDeleteProcess = useCallback(() => {
        if (!currentProcessId) return
        setProcesses(prev => prev.filter(p => p.id !== currentProcessId))
        setCurrentProcessId(null)
    }, [currentProcessId])

    const handleDeleteMeasurement = useCallback((measurementId) => {
        setProcesses(prev => prev.map(process => {
            if (process.id === currentProcessId) {
                return {
                    ...process,
                    measurements: process.measurements.filter(m => m.id !== measurementId)
                }
            }
            return process
        }))
    }, [currentProcessId])

    // Config functions
    const handleConfigChange = useCallback((key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }))
    }, [])

    // Get current process
    const currentProcess = processes.find(p => p.id === currentProcessId)

    return (
        <div className="min-h-screen pb-6">
            {/* Timer Header */}
            <Timer
                elapsedTime={elapsedTime}
                isRunning={isRunning}
                canLap={!!currentProcessId}
                onStart={handleStart}
                onStop={handleStop}
                onReset={handleReset}
                onLap={handleLap}
            />

            {/* Main Content - Mobile First */}
            <main className="flex flex-col gap-4 p-4 max-w-7xl mx-auto lg:grid lg:grid-cols-[340px_1fr] lg:gap-6 lg:p-6">
                {/* On mobile: Process selection first */}
                <div className="lg:hidden">
                    <ProcessList
                        processes={processes}
                        currentProcessId={currentProcessId}
                        onAdd={handleAddProcess}
                        onSelect={handleSelectProcess}
                    />
                </div>

                {/* Sidebar - Desktop */}
                <aside className="hidden lg:flex lg:flex-col lg:gap-6">
                    <Config
                        config={config}
                        onChange={handleConfigChange}
                        workDays={workDays}
                        getMonthName={getMonthName}
                    />
                    <ProcessList
                        processes={processes}
                        currentProcessId={currentProcessId}
                        onAdd={handleAddProcess}
                        onSelect={handleSelectProcess}
                    />
                </aside>

                {/* Content Area */}
                <div className="flex flex-col gap-4 lg:gap-6">
                    <Measurements
                        process={currentProcess}
                        onDelete={handleDeleteMeasurement}
                        onDeleteProcess={handleDeleteProcess}
                    />

                    {/* Config on mobile - after measurements */}
                    <div className="lg:hidden">
                        <Config
                            config={config}
                            onChange={handleConfigChange}
                            workDays={workDays}
                            getMonthName={getMonthName}
                        />
                    </div>

                    <Calculations
                        measurements={currentProcess?.measurements || []}
                        config={{ ...config, workDays }}
                    />
                </div>
            </main>
        </div>
    )
}

export default App
