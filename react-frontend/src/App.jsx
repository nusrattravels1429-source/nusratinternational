import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CardsList from './pages/CardsList';
import CardDetail from './pages/CardDetail';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CardsList />} />
            <Route path="/cards/:id" element={<CardDetail />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; 2024 Nusrat International. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
