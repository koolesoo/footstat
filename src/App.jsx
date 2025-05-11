import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LivePage from "./pages/LivePage";
import ScoresPage from "./pages/ScoresPage";
import MyTeamPage from "./pages/MyTeamPage";
import TabBar from "./components/TabBar";
import ChampionshipList from "./components/ChampionshipList";
import CompetitionTable from "./components/CompetitionTable";
import LeagueMatchesPage from "./pages/LeagueMatchesPage";
import Header from "./components/Header"; // Импортируем хедер
import TablesCard from "./components/TablesCard";
import LoginPage from "./pages/LoginPage";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header /> {/* Хедер добавлен здесь */}
        <Routes>
          <Route path="/matches" element={<ScoresPage />} />
          <Route path="/matches/:leagueId" element={<LeagueMatchesPage />} />
          <Route path="/" element={<MyTeamPage />} />
          <Route path="/tables" element={<ChampionshipList />} />
          <Route path="/tables/:id" element={<CompetitionTable />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <TabBar />
      </div>
    </Router>
  );
};

export default App;