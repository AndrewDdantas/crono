import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

function OperationList({ currentOperationId, onSelect }) {
    const { user } = useAuth()
    const [operations, setOperations] = useState([])
    const [newName, setNewName] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) {
            loadOperations()
        }
    }, [user])

    const loadOperations = async () => {
        try {
            const { data, error } = await supabase
                .from('operations')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setOperations(data || [])

            // Auto-select first operation if none selected
            if (data && data.length > 0 && !currentOperationId) {
                onSelect(data[0])
            }
        } catch (error) {
            console.error('Error loading operations:', error)
        }
    }

    const handleAdd = async () => {
        if (!newName.trim()) return

        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('operations')
                .insert([
                    {
                        name: newName.trim(),
                        user_id: user.id,
                    },
                ])
                .select()
                .single()

            if (error) throw error

            setOperations([data, ...operations])
            setNewName('')
            onSelect(data)
        } catch (error) {
            console.error('Error creating operation:', error)
            alert('Erro ao criar operação: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta operação e todos os seus processos?')) {
            return
        }

        try {
            const { error } = await supabase
                .from('operations')
                .delete()
                .eq('id', id)

            if (error) throw error

            setOperations(operations.filter((op) => op.id !== id))
            if (currentOperationId === id) {
                const remaining = operations.filter((op) => op.id !== id)
                onSelect(remaining[0] || null)
            }
        } catch (error) {
            console.error('Error deleting operation:', error)
            alert('Erro ao excluir operação: ' + error.message)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleAdd()
    }

    return (
        <section className="glass rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:border-primary-700/30">
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                <span>📦</span> Operações
            </h2>

            {/* Add Operation */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nome da operação..."
                    className="flex-1 min-w-0 px-3 py-2.5 border border-white/10 rounded-lg bg-white/5 text-white text-sm
                     placeholder:text-gray-500
                     focus:outline-none focus:border-primary-600
                     transition-all duration-150"
                />
                <button
                    onClick={handleAdd}
                    disabled={!newName.trim() || loading}
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

            {/* Operation List */}
            <ul className="flex flex-col gap-2 max-h-48 sm:max-h-64 overflow-y-auto">
                {operations.length === 0 ? (
                    <li className="text-center text-gray-500 py-6 sm:py-8 text-sm">
                        <p>Nenhuma operação criada</p>
                        <p className="text-xs mt-1 text-gray-600">Crie uma operação para começar</p>
                    </li>
                ) : (
                    operations.map((operation) => (
                        <li
                            key={operation.id}
                            className={`flex justify-between items-center px-3 sm:px-4 py-3 rounded-lg
                          border transition-all duration-150 group
                          ${currentOperationId === operation.id
                                    ? 'bg-primary-700/20 border-primary-600 shadow-lg shadow-primary-700/20'
                                    : 'bg-white/5 border-white/10 hover:bg-primary-700/10 hover:border-primary-600'
                                }`}
                        >
                            <button
                                onClick={() => onSelect(operation)}
                                className="flex-1 text-left font-medium text-sm truncate mr-2"
                            >
                                {operation.name}
                            </button>
                            <button
                                onClick={() => handleDelete(operation.id)}
                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300
                           px-2 py-1 rounded text-sm transition-all"
                                title="Excluir"
                            >
                                ✕
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </section>
    )
}

export default OperationList
