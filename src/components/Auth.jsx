import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { signIn, signUp } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            if (isLogin) {
                await signIn(email, password)
            } else {
                await signUp(email, password)
                setError('Conta criada! Verifique seu email para confirmar.')
            }
        } catch (err) {
            setError(err.message || 'Erro ao processar requisição')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass rounded-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold timer-gradient mb-2">
                        ⏱️ Cronoanalise
                    </h1>
                    <p className="text-gray-400">
                        {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-white
                         focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20
                         transition-all duration-150"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Senha
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-white
                         focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20
                         transition-all duration-150"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className={`p-3 rounded-lg text-sm ${error.includes('Conta criada')
                                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                                : 'bg-red-500/20 border border-red-500/40 text-red-300'
                            }`}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 text-sm font-semibold uppercase tracking-wide rounded-xl
                       bg-gradient-to-r from-primary-700 to-primary-500 text-white
                       shadow-lg shadow-primary-700/40
                       hover:shadow-xl hover:shadow-primary-600/50
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
                    >
                        {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin)
                            setError(null)
                        }}
                        className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                    >
                        {isLogin ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Auth
