import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components';
import { ScenePage, DiaryPage, CharacterPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ScenePage />} />
          <Route path="/diary" element={<DiaryPage />} />
          <Route path="/character" element={<CharacterPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
