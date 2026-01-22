function Config({ config, onChange, workDays, getMonthName }) {
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 5 }, (_, i) => currentYear + i)

    const handleBothWeekends = () => {
        const newValue = !(config.includeSaturday && config.includeSunday)
        onChange('includeSaturday', newValue)
        onChange('includeSunday', newValue)
    }

    return (
        <section className="glass rounded-2xl p-5 transition-all duration-300 hover:border-primary-700/30">
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                <span>⚙️</span> Configurações
            </h2>

            <div className="space-y-4">
                {/* Row 1: Fadiga + Horas */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            Fadiga (%)
                        </label>
                        <input
                            type="number"
                            value={config.fatigue}
                            onChange={(e) => onChange('fatigue', parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            step="1"
                            className="px-3 py-2.5 border border-white/10 rounded-lg bg-white/5 text-white text-sm font-medium
                         focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20
                         transition-all duration-150"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            Horas/Turno
                        </label>
                        <input
                            type="number"
                            value={config.shiftHours}
                            onChange={(e) => onChange('shiftHours', parseFloat(e.target.value) || 0)}
                            min="1"
                            max="24"
                            step="0.5"
                            className="px-3 py-2.5 border border-white/10 rounded-lg bg-white/5 text-white text-sm font-medium
                         focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20
                         transition-all duration-150"
                        />
                    </div>
                </div>

                {/* Row 2: Turnos + Meta */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            Turnos/Dia
                        </label>
                        <input
                            type="number"
                            value={config.shiftsPerDay}
                            onChange={(e) => onChange('shiftsPerDay', parseInt(e.target.value) || 1)}
                            min="1"
                            max="4"
                            className="px-3 py-2.5 border border-white/10 rounded-lg bg-white/5 text-white text-sm font-medium
                         focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20
                         transition-all duration-150"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            Meta de Peças
                        </label>
                        <input
                            type="number"
                            value={config.targetPieces}
                            onChange={(e) => onChange('targetPieces', parseInt(e.target.value) || 0)}
                            min="1"
                            className="px-3 py-2.5 border border-white/10 rounded-lg bg-white/5 text-white text-sm font-medium
                         focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20
                         transition-all duration-150"
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-4">
                    <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span>📅</span> Período de Cálculo
                    </h3>

                    {/* Row 3: Mês + Ano */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                Mês
                            </label>
                            <select
                                value={config.month}
                                onChange={(e) => onChange('month', parseInt(e.target.value))}
                                className="px-3 py-2.5 border border-white/10 rounded-lg bg-white/5 text-white text-sm font-medium
                           focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20
                           transition-all duration-150 appearance-none cursor-pointer"
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i} className="bg-dark-800 text-white">
                                        {getMonthName(i)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                Ano
                            </label>
                            <select
                                value={config.year}
                                onChange={(e) => onChange('year', parseInt(e.target.value))}
                                className="px-3 py-2.5 border border-white/10 rounded-lg bg-white/5 text-white text-sm font-medium
                           focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20
                           transition-all duration-150 appearance-none cursor-pointer"
                            >
                                {years.map(year => (
                                    <option key={year} value={year} className="bg-dark-800 text-white">
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Weekend toggles */}
                    <div className="space-y-2 mb-4">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                            Considerar fins de semana
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {/* Saturday */}
                            <button
                                onClick={() => onChange('includeSaturday', !config.includeSaturday)}
                                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-200
                           ${config.includeSaturday
                                        ? 'bg-primary-600/30 border-primary-500 text-primary-300'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                            >
                                Sábado
                            </button>

                            {/* Sunday */}
                            <button
                                onClick={() => onChange('includeSunday', !config.includeSunday)}
                                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-200
                           ${config.includeSunday
                                        ? 'bg-primary-600/30 border-primary-500 text-primary-300'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                            >
                                Domingo
                            </button>

                            {/* Both */}
                            <button
                                onClick={handleBothWeekends}
                                className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-200
                           ${config.includeSaturday && config.includeSunday
                                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                            >
                                Ambos
                            </button>
                        </div>
                    </div>

                    {/* Work days display */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-primary-700/20 to-primary-500/10 border border-primary-600/30">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">Dias úteis no mês:</span>
                            <span className="text-xl font-bold text-primary-400">{workDays} dias</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Config
