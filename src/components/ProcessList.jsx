import { useState } from 'react'

function ProcessList({ processes, currentProcessId, onAdd, onSelect }) {
    const [newName, setNewName] = useState('')

    const handleAdd = () => {
        if (newName.trim()) {
            onAdd(newName.trim())
            setNewName('')
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleAdd()
    }

    return (
        <section className="glass rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:border-primary-700/30">
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                <span>📋</span> Processos
            </h2>

            {/* Add Process */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nome do processo..."
                    className="flex-1 min-w-0 px-3 py-2.5 border border-white/10 rounded-lg bg-white/5 text-white text-sm
                     placeholder:text-gray-500
                     focus:outline-none focus:border-primary-600
                     transition-all duration-150"
                />
                <button
                    onClick={handleAdd}
                    disabled={!newName.trim()}
                    className="px-3 sm:px-4 py-2.5 text-xs font-semibold uppercase tracking-wide rounded-lg whitespace-nowrap
                     bg-gradient-to-r from-primary-700 to-primary-500 text-white
                     shadow-md shadow-primary-700/30
                     hover:shadow-lg hover:shadow-primary-600/40
                     disabled:opacity-40 disabled:cursor-not-allowed
                     active:scale-95 transition-all duration-200"
                >
                    <span className="sm:hidden">+</span>
                    <span className="hidden sm:inline">+ Adicionar</span>
                </button>
            </div>

            {/* Process List */}
            <ul className="flex flex-col gap-2 max-h-48 sm:max-h-64 lg:max-h-72 overflow-y-auto">
                {processes.length === 0 ? (
                    <li className="text-center text-gray-500 py-6 sm:py-8 text-sm">
                        <p>Nenhum processo criado</p>
                        <p className="text-xs mt-1 text-gray-600">Adicione um processo para começar</p>
                    </li>
                ) : (
                    processes.map((process) => (
                        <li
                            key={process.id}
                            onClick={() => onSelect(process.id)}
                            className={`flex justify-between items-center px-3 sm:px-4 py-3 rounded-lg cursor-pointer
                          border transition-all duration-150 active:scale-[0.98]
                          ${process.id === currentProcessId
                                    ? 'bg-primary-700/20 border-primary-600 shadow-lg shadow-primary-700/20'
                                    : 'bg-white/5 border-white/10 hover:bg-primary-700/10 hover:border-primary-600'
                                }`}
                        >
                            <span className="font-medium text-sm truncate mr-2">{process.name}</span>
                            <span className="text-[10px] sm:text-xs text-gray-400 bg-dark-800 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                                {process.measurements.length}
                            </span>
                        </li>
                    ))
                )}
            </ul>
        </section>
    )
}

export default ProcessList
