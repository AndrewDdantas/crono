import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { supabase } from '../lib/supabase'

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

const Measurements = forwardRef(({ process, onMeasurementsChange }, ref) => {
    const [measurements, setMeasurements] = useState([])

    useEffect(() => {
        if (process) {
            loadMeasurements()
        } else {
            setMeasurements([])
        }
    }, [process])

    const loadMeasurements = async () => {
        if (!process) return

        try {
            const { data, error } = await supabase
                .from('measurements')
                .select('*')
                .eq('process_id', process.id)
                .order('recorded_at', { ascending: true })

            if (error) throw error
            setMeasurements(data || [])
            onMeasurementsChange?.(data || [])
        } catch (error) {
            console.error('Error loading measurements:', error)
        }
    }

    // Expose refresh method to parent
    useImperativeHandle(ref, () => ({
        refresh: loadMeasurements
    }))

    const handleDelete = async (id) => {
        try {
            const { error } = await supabase
                .from('measurements')
                .delete()
                .eq('id', id)

            if (error) throw error

            const newMeasurements = measurements.filter((m) => m.id !== id)
            setMeasurements(newMeasurements)
            onMeasurementsChange?.(newMeasurements)
        } catch (error) {
            console.error('Error deleting measurement:', error)
            alert('Erro ao excluir medição: ' + error.message)
        }
    }

    if (!process) {
        return (
            <section className="glass rounded-2xl p-5">
                <div className="text-center py-8 sm:py-12 text-gray-400">
                    <p className="text-4xl mb-3">📌</p>
                    <p className="text-base sm:text-lg">Selecione um processo</p>
                    <p className="text-sm text-gray-500 mt-1">para começar as medições</p>
                </div>
            </section>
        )
    }

    return (
        <section className="glass rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:border-primary-700/30">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 gap-3">
                <h2 className="text-lg sm:text-xl font-semibold timer-gradient truncate">{process.name}</h2>
            </div>

            {/* Measurements */}
            <div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                    <span>📊</span>
                    Medições
                    {measurements.length > 0 && (
                        <span className="bg-primary-600/30 text-primary-300 px-2 py-0.5 rounded-full text-[10px]">
                            {measurements.length}
                        </span>
                    )}
                </h3>

                <div className="max-h-48 sm:max-h-64 lg:max-h-72 overflow-y-auto">
                    {measurements.length === 0 ? (
                        <div className="text-center py-8 sm:py-10 text-gray-500 text-sm">
                            <p>Nenhuma medição registrada</p>
                            <p className="text-xs mt-1 text-gray-600">Inicie o cronômetro e clique em "Registrar"</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {measurements.map((measurement, index) => (
                                <div
                                    key={measurement.id}
                                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/5 border border-white/5
                             hover:bg-white/10 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500 w-6 text-right">#{index + 1}</span>
                                        <span className="font-mono text-sm sm:text-base tabular-nums font-medium">
                                            {formatTime(measurement.time_ms)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(measurement.id)}
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
})

Measurements.displayName = 'Measurements'

export default Measurements
