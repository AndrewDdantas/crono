import React from 'react';

interface HeaderProps {
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle }) => {
    return (
        <header className="header">
            <div className="header-content">
                <div className="header-logo">
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="white" fillOpacity="0.2" />
                        <circle cx="20" cy="20" r="12" stroke="white" strokeWidth="3" fill="none" />
                        <line x1="20" y1="20" x2="20" y2="10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        <line x1="20" y1="20" x2="28" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="20" cy="20" r="2" fill="white" />
                    </svg>
                    <div>
                        <h1 className="header-title">CronoAnalise</h1>
                        <p className="header-subtitle">Estudo de Tempos e Movimentos</p>
                    </div>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-ghost btn-icon tooltip"
                        onClick={onThemeToggle}
                        data-tooltip={theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
                        aria-label="Alternar tema"
                    >
                        {theme === 'light' ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="5" />
                                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};
