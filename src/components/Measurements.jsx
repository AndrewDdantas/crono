// Format time from milliseconds to display format
const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const milliseconds = ms % 1000

    const pad = (num, size = 2) => num.toString().padStart(size, '0')

    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`
    }
    return `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`
}

function Measurements({ process, onDelete, onDeleteProcess }) {
    if (!process) {
        return (
            <section className="glass rounded-2xl p-5">
                <div className="text-center py-8 sm:py-12 text-gray-400">
                    <p className="text-4xl mb-3">📌</p>
                    <p className="text-base sm:text-lg">Selecione ou crie um processo</p>
                    <p className="text-sm text-gray-500 mt-1">para começar as medições</p>
                </div>
            </section>
        )
    }

    const handleDeleteProcess = () => {
        if (window.confirm('Tem certeza que deseja excluir este processo e todas as suas medições?')) {
            onDeleteProcess()
        }
    }

    return (
        <section className="glass rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:border-primary-700/30">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 gap-3">
                <h2 className="text-lg sm:text-xl font-semibold timer-gradient truncate">{process.name}</h2>
                <button
                    onClick={handleDeleteProcess}
                    className="px-2.5 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wide rounded-lg whitespace-nowrap
                     bg-gradient-to-r from-red-500 to-red-400 text-white flex-shrink-0
                     hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                >
                    <span className="sm:hidden">🗑️</span>
                    <span className="hidden sm:inline">🗑️ Excluir</span>
                </button>
            </div>

            {/* Measurements */}
            <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                    <span>📊</span>
                    Medições
                    {process.measurements.length > 0 && (
                        <span className="bg-primary-600/30 text-primary-300 px-2 py-0.5 rounded-full text-[10px]">
                            {process.measurements.length}
                        </span>
                    )}
                </h3>

                <div className="max-h-48 sm:max-h-64 lg:max-h-72 overflow-y-auto">
                    {process.measurements.length === 0 ? (
                        <div className="text-center py-8 sm:py-10 text-gray-500 text-sm">
                            <p>Nenhuma medição registrada</p>
                            <p className="text-xs mt-1 text-gray-600">Inicie o cronômetro e clique em "Registrar"</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {process.measurements.map((measurement, index) => (
                                <div
                                    key={measurement.id}
                                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/5 border border-white/5
                             hover:bg-white/10 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500 w-6 text-right">#{index + 1}</span>
                                        <span className="font-mono text-sm sm:text-base tabular-nums font-medium">
                                            {formatTime(measurement.time)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => onDelete(measurement.id)}
                                        className="text-gray-500 hover:text-red-400 hover:bg-red-400/20 
                               px-2 py-1 rounded text-sm transition-colors opacity-50 group-hover:opacity-100"
                                        title="Remover"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Measurements
