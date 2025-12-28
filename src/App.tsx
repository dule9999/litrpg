import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components';
import { ScenePage, DiaryPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ScenePage />} />
          <Route path="/diary" element={<DiaryPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
