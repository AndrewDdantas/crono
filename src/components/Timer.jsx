import { useMemo } from 'react'

// Format time from milliseconds to display format
const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const milliseconds = ms % 1000

    const pad = (num, size = 2) => num.toString().padStart(size, '0')

    return {
        main: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
        ms: `.${pad(milliseconds, 3)}`
    }
}

function Timer({ elapsedTime, isRunning, canLap, onStart, onStop, onReset, onLap }) {
    const time = useMemo(() => formatTime(elapsedTime), [elapsedTime])

    return (
        <header className="glass border-b border-white/10 py-6 sm:py-8 lg:py-10 px-4 text-center">
            {/* Timer Display */}
            <div className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 sm:mb-8 ${isRunning ? 'animate-pulse-glow' : ''}`}>
                <span className="timer-gradient">{time.main}</span>
                <span className="timer-gradient opacity-70 text-[0.35em] sm:text-[0.4em]">{time.ms}</span>
            </div>

            {/* Controls - Mobile optimized */}
            <div className="grid grid-cols-2 sm:flex sm:justify-center gap-2 sm:gap-3 max-w-md sm:max-w-none mx-auto">
                <button
                    onClick={onStart}
                    disabled={isRunning}
                    className="flex items-center justify-center gap-2 px-4 py-3 sm:px-6 text-xs sm:text-sm font-semibold uppercase tracking-wide rounded-xl
                     bg-gradient-to-r from-primary-700 to-primary-500 text-white
                     shadow-lg shadow-primary-700/40
                     hover:shadow-xl hover:shadow-primary-600/50 active:scale-95
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200"
                >
                    <span className="text-base sm:text-lg">▶</span>
                    <span className="hidden sm:inline">Iniciar</span>
                    <span className="sm:hidden">Start</span>
                </button>

                <button
                    onClick={onStop}
                    disabled={!isRunning}
                    className="flex items-center justify-center gap-2 px-4 py-3 sm:px-6 text-xs sm:text-sm font-semibold uppercase tracking-wide rounded-xl
                     bg-gradient-to-r from-amber-500 to-amber-400 text-dark-900
                     shadow-lg shadow-amber-500/40
                     hover:shadow-xl hover:shadow-amber-500/50 active:scale-95
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200"
                >
                    <span className="text-base sm:text-lg">⏸</span>
                    <span className="hidden sm:inline">Pausar</span>
                    <span className="sm:hidden">Pause</span>
                </button>

                <button
                    onClick={onReset}
                    className="flex items-center justify-center gap-2 px-4 py-3 sm:px-6 text-xs sm:text-sm font-semibold uppercase tracking-wide rounded-xl
                     bg-white/5 text-white border border-white/10
                     hover:bg-white/10 hover:border-white/20 active:scale-95
                     transition-all duration-200"
                >
                    <span className="text-base sm:text-lg">↺</span>
                    <span className="hidden sm:inline">Resetar</span>
                    <span className="sm:hidden">Reset</span>
                </button>

                <button
                    onClick={onLap}
                    disabled={!canLap || elapsedTime === 0}
                    className="flex items-center justify-center gap-2 px-4 py-3 sm:px-6 text-xs sm:text-sm font-semibold uppercase tracking-wide rounded-xl
                     bg-gradient-to-r from-emerald-500 to-emerald-400 text-white
                     shadow-lg shadow-emerald-500/40
                     hover:shadow-xl hover:shadow-emerald-500/50 active:scale-95
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200"
                >
                    <span className="text-base sm:text-lg">⏱</span>
                    <span className="hidden sm:inline">Registrar</span>
                    <span className="sm:hidden">Lap</span>
                </button>
            </div>

            {/* Mobile hint */}
            {!canLap && (
                <p className="mt-4 text-xs text-gray-500 sm:hidden">
                    Selecione um processo para registrar medições
                </p>
            )}
        </header>
    )
}

export default Timer
