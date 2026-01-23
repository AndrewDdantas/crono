import { useMemo } from 'react'

// Format number with comma (Brazilian format)
const formatNumber = (num, decimals = 2) => {
    return num.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    })
}

// Format seconds to readable time
const formatTimeShort = (ms) => {
    const totalSeconds = ms / 1000
    if (totalSeconds < 60) {
        return `${formatNumber(totalSeconds, 2)}s`
    }
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = formatNumber(totalSeconds % 60, 1)
    return `${minutes}m ${seconds}s`
}

function Calculations({ measurements, config }) {
    const calculations = useMemo(() => {
        if (!measurements || measurements.length === 0) {
            return null
        }

        const { fatigue, shiftHours, workDays, shiftsPerDay, targetPieces } = config

        // Average time (in milliseconds)
        const times = measurements.map(m => m.time)
        const avgTimeMs = times.reduce((a, b) => a + b, 0) / times.length
        const avgTimeSeconds = avgTimeMs / 1000

        // Average with fatigue
        const avgWithFatigueSeconds = avgTimeSeconds * (1 + fatigue / 100)

        // UPH (Units Per Hour) = 3600 / tempo médio com fadiga em segundos
        const uph = avgWithFatigueSeconds > 0 ? 3600 / avgWithFatigueSeconds : 0

        // Pieces per shift, day, month
        const piecesPerShift = uph * shiftHours
        const piecesPerDay = piecesPerShift * shiftsPerDay
        const piecesPerMonth = piecesPerDay * workDays

        // People needed for target
        const peopleShift = piecesPerShift > 0 ? targetPieces / piecesPerShift : 0
        const peopleDay = piecesPerDay > 0 ? targetPieces / piecesPerDay : 0
        const peopleMonth = piecesPerMonth > 0 ? targetPieces / piecesPerMonth : 0

        return {
            avgTime: formatTimeShort(avgTimeMs),
            avgFatigue: formatTimeShort(avgWithFatigueSeconds * 1000),
            uph: formatNumber(uph, 2),
            piecesPerShift: Math.floor(piecesPerShift).toLocaleString('pt-BR'),
            piecesPerDay: Math.floor(piecesPerDay).toLocaleString('pt-BR'),
            piecesPerMonth: Math.floor(piecesPerMonth).toLocaleString('pt-BR'),
            peopleShift: formatNumber(peopleShift, 2),
            peopleDay: formatNumber(peopleDay, 2),
            peopleMonth: formatNumber(peopleMonth, 2)
        }
    }, [measurements, config])

    return (
        <section className="glass rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:border-primary-700/30">
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                <span>📈</span> Resultados
            </h2>

            {!calculations ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                    <p>Adicione medições para ver os cálculos</p>
                </div>
            ) : (
                <>
                    {/* Time Calculations */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <CalcCard label="Média de Tempos" value={calculations.avgTime} />
                        <CalcCard
                            label="Média c/ Fadiga"
                            value={calculations.avgFatigue}
                            variant="highlight"
                        />
                    </div>

                    {/* UPH - Destacado */}
                    <div className="mb-4">
                        <div className="rounded-xl p-5 text-center border transition-all duration-300
                            bg-gradient-to-br from-emerald-500/20 to-emerald-400/10 border-emerald-500/40">
                            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                UPH (Unidades por Hora)
                            </span>
                            <span className="block text-3xl sm:text-4xl font-bold text-emerald-400 tabular-nums">
                                {calculations.uph}
                            </span>
                            <span className="block text-xs text-gray-500 mt-1">
                                peças/hora
                            </span>
                        </div>
                    </div>

                    {/* Production Cards */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
                        <CalcCard label="Peças/Turno" value={calculations.piecesPerShift} size="small" />
                        <CalcCard label="Peças/Dia" value={calculations.piecesPerDay} size="small" />
                        <CalcCard label="Peças/Mês" value={calculations.piecesPerMonth} size="small" />
                    </div>

                    {/* Personnel Section */}
                    <div className="border-t border-white/10 pt-4">
                        <h3 className="text-xs sm:text-sm font-semibold mb-3 flex items-center gap-2 text-gray-300">
                            <span>👥</span> Pessoas para meta ({config.targetPieces?.toLocaleString('pt-BR') || 0} peças)
                        </h3>
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                            <PersonnelCard label="Turno" value={calculations.peopleShift} />
                            <PersonnelCard label="Dia" value={calculations.peopleDay} />
                            <PersonnelCard label="Mês" value={calculations.peopleMonth} />
                        </div>
                    </div>
                </>
            )}
        </section>
    )
}

function CalcCard({ label, value, variant = 'default', size = 'normal' }) {
    const variantClasses = {
        default: 'bg-white/5 border-white/10 hover:border-white/20',
        highlight: 'bg-gradient-to-br from-primary-700/20 to-primary-500/10 border-primary-600/40'
    }

    const sizeClasses = {
        normal: 'p-4 sm:p-5',
        small: 'p-3 sm:p-4'
    }

    const valueSize = {
        normal: 'text-xl sm:text-2xl',
        small: 'text-lg sm:text-xl'
    }

    return (
        <div className={`rounded-xl text-center border transition-all duration-300 
                     ${variantClasses[variant]} ${sizeClasses[size]}`}>
            <span className="block text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                {label}
            </span>
            <span className={`block font-bold tabular-nums ${valueSize[size]}`}>
                {value}
            </span>
        </div>
    )
}

function PersonnelCard({ label, value }) {
    // Value is already formatted with comma by formatNumber
    return (
        <div className="rounded-xl p-3 sm:p-4 text-center border transition-all duration-300
                    bg-gradient-to-br from-blue-500/20 to-blue-400/10 border-blue-500/40">
            <span className="block text-[9px] sm:text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {label}
            </span>
            <span className="block text-2xl sm:text-3xl font-bold text-blue-400 tabular-nums">
                {value}
            </span>
        </div>
    )
}

export default Calculations
