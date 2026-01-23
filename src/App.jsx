import { useState, useEffect, useCallback, useRef } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Timer from './components/Timer'
import Config from './components/Config'
import OperationList from './components/OperationList'
import ProcessList from './components/ProcessList'
import Measurements from './components/Measurements'
import Calculations from './components/Calculations'

// Get month name in Portuguese
const getMonthName = (month) => {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    return months[month]
}

// Calculate work days in a month
const getWorkDaysInMonth = (year, month, includeSaturday, includeSunday) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    let workDays = 0

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        const dayOfWeek = date.getDay()

        if (dayOfWeek === 0) {
            if (includeSunday) workDays++
        } else if (dayOfWeek === 6) {
            if (includeSaturday) workDays++
        } else {
            workDays++
        }
    }

    return workDays
}

function AppContent() {
    const { user, signOut } = useAuth()

    // Refs
    const measurementsRef = useRef(null)

    // Timer state
    const [isRunning, setIsRunning] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [startTime, setStartTime] = useState(0)

    // Hierarchy state
    const [currentOperation, setCurrentOperation] = useState(null)
    const [currentProcess, setCurrentProcess] = useState(null)
    const [measurements, setMeasurements] = useState([])

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

    const [workDays, setWorkDays] = useState(22)

    // Load config from current operation
    useEffect(() => {
        if (currentOperation?.config) {
            setConfig(prev => ({ ...prev, ...currentOperation.config }))
        }
    }, [currentOperation])

    // Update work days
    useEffect(() => {
        const days = getWorkDaysInMonth(
            config.year,
            config.month,
            config.includeSaturday,
            config.includeSunday
        )
        setWorkDays(days)
    }, [config.month, config.year, config.includeSaturday, config.includeSunday])

    // Save config to operation
    useEffect(() => {
        if (currentOperation) {
            const updateConfig = async () => {
                try {
                    await supabase
                        .from('operations')
                        .update({ config })
                        .eq('id', currentOperation.id)
                } catch (error) {
                    console.error('Error saving config:', error)
                }
            }
            const timeoutId = setTimeout(updateConfig, 500) // Debounce
            return () => clearTimeout(timeoutId)
        }
    }, [config, currentOperation])

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

    const handleLap = useCallback(async () => {
        if (!currentProcess || elapsedTime === 0) return

        try {
            const { error } = await supabase
                .from('measurements')
                .insert([
                    {
                        process_id: currentProcess.id,
                        time_ms: elapsedTime,
                    },
                ])

            if (error) throw error

            // Refresh measurements list
            if (measurementsRef.current) {
                measurementsRef.current.refresh()
            }

            // Reset timer after recording
            handleReset()
        } catch (error) {
            console.error('Error recording measurement:', error)
            alert('Erro ao registrar medição: ' + error.message)
        }
    }, [currentProcess, elapsedTime, handleReset])

    const handleConfigChange = useCallback((key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }))
    }, [])

    const handleOperationSelect = (operation) => {
        setCurrentOperation(operation)
        setCurrentProcess(null)
        setMeasurements([]) // Clear measurements from previous operation
    }

    const handleProcessSelect = (process) => {
        setCurrentProcess(process)
        if (!process) {
            setMeasurements([]) // Clear measurements when no process selected
        }
    }

    const handleMeasurementsChange = (newMeasurements) => {
        setMeasurements(newMeasurements)
    }

    return (
        <div className="min-h-screen pb-6">
            {/* Timer Header */}
            <div className="glass border-b border-white/10">
                <div className="flex justify-between items-center px-4 py-3">
                    <h1 className="text-lg font-bold timer-gradient">⏱️ Cronoanalise</h1>
                    <button
                        onClick={signOut}
                        className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                    >
                        Sair
                    </button>
                </div>
                <Timer
                    elapsedTime={elapsedTime}
                    isRunning={isRunning}
                    canLap={!!currentProcess}
                    onStart={handleStart}
                    onStop={handleStop}
                    onReset={handleReset}
                    onLap={handleLap}
                />
            </div>

            {/* Main Content - Mobile First */}
            <main className="flex flex-col gap-4 p-4 max-w-7xl mx-auto lg:grid lg:grid-cols-[340px_1fr] lg:gap-6 lg:p-6">
                {/* On mobile: Operations and Processes first */}
                <div className="lg:hidden space-y-4">
                    <OperationList
                        currentOperationId={currentOperation?.id}
                        onSelect={handleOperationSelect}
                    />
                    <ProcessList
                        operationId={currentOperation?.id}
                        currentProcessId={currentProcess?.id}
                        onSelect={handleProcessSelect}
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
                    <OperationList
                        currentOperationId={currentOperation?.id}
                        onSelect={handleOperationSelect}
                    />
                    <ProcessList
                        operationId={currentOperation?.id}
                        currentProcessId={currentProcess?.id}
                        onSelect={handleProcessSelect}
                    />
                </aside>

                {/* Content Area */}
                <div className="flex flex-col gap-4 lg:gap-6">
                    <Measurements
                        ref={measurementsRef}
                        process={currentProcess}
                        onMeasurementsChange={handleMeasurementsChange}
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
                        measurements={measurements.map(m => ({ time: m.time_ms }))}
                        config={{ ...config, workDays }}
                    />
                </div>
            </main>
        </div>
    )
}

function App() {
    return (
        <AuthProvider>
            <AuthWrapper />
        </AuthProvider>
    )
}

function AuthWrapper() {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4 timer-gradient">⏱️</div>
                    <p className="text-gray-400">Carregando...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Auth />
    }

    return <AppContent />
}

export default App
