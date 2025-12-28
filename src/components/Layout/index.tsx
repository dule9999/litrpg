import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetGameState } from '@utils';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  const handleNewGame = () => {
    resetGameState();
    window.location.href = '/';
  };

  return (
    <div className="layout">
      <header className="layout-header">
        <h1>LitRPG</h1>
        <nav>
          <button className="nav-button" onClick={() => navigate('/')}>
            Current Scene
          </button>
          <button className="nav-button" onClick={() => navigate('/diary')}>
            Diary
          </button>
          <button className="nav-button" onClick={handleNewGame}>
            New Game
          </button>
        </nav>
      </header>
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
}
