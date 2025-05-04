import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LiveScoresPage from './pages/LiveScoresPage';
import profilePage from './pages/profilePage'; 
import TabBar from './components/TabBar';
import TablesPage from './pages/TablesPage';
import ChampionshipList from "./components/ChampionshipList";
import CompetitionTable from "./components/CompetitionTable";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/matches" element={<LiveScoresPage />} />
          <Route path="/profile" element={<profilePage />} /> 
          <Route path="/tables" element={<ChampionshipList />} /> {/* Список чемпионатов */}
          <Route path="/tables/:id" element={<CompetitionTable />} /> {/* Таблица чемпионата */}
        </Routes>
        <TabBar />
      </div>
    </Router>
  );
};

export default App;