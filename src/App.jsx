import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LivePage from "./pages/LivePage";
import ScoresPage from "./pages/ScoresPage";
import MyTeamPage from "./pages/MyTeamPage";
import TabBar from "./components/TabBar";
import ChampionshipList from "./components/ChampionshipList";
import CompetitionTable from "./components/CompetitionTable";
import LeagueMatchesPage from "./pages/LeagueMatchesPage"; // Импортируем новую страницу

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/matches" element={<ScoresPage />} />
          <Route path="/matches/:leagueId" element={<LeagueMatchesPage />} /> {/* Новый маршрут */}
          <Route path="/" element={<MyTeamPage />} />
          <Route path="/tables" element={<ChampionshipList />} />
          <Route path="/tables/:id" element={<CompetitionTable />} />
        </Routes>
        <TabBar />
      </div>
    </Router>
  );
};

export default App;