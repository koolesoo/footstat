import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LivePage from './pages/LivePage';
import ScoresPage from './pages/ScoresPage';
import ProfilePage from './pages/ProfilePage'; 
import TabBar from './components/TabBar';
import ChampionshipList from "./components/ChampionshipList";
import CompetitionTable from "./components/CompetitionTable";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LivePage />} />
          <Route path="/matches" element={<ScoresPage />} />
          <Route path="/profile" element={<ProfilePage />} /> 
          <Route path="/tables" element={<ChampionshipList />} /> {/* Список чемпионатов */}
          <Route path="/tables/:id" element={<CompetitionTable />} /> {/* Таблица чемпионата */}
        </Routes>
        <TabBar />
      </div>
    </Router>
  );
};

export default App;