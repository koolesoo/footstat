import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ScoresPage from "./pages/ScoresPage";
import MyTeamPage from "./pages/MyTeamPage";
import TabBar from "./components/TabBar";
import ChampionshipList from "./components/ChampionshipList";
import CompetitionTable from "./components/CompetitionTable";
import LeagueMatchesPage from "./pages/LeagueMatchesPage";
import Header from "./components/Header";
import TablesCard from "./components/TablesCard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Защищенные маршруты */}
            <Route path="/" element={
              <ProtectedRoute>
                <MyTeamPage />
              </ProtectedRoute>
            } />
            <Route path="/matches" element={
              <ProtectedRoute>
                <ScoresPage />
              </ProtectedRoute>
            } />
            <Route path="/matches/:leagueId" element={
              <ProtectedRoute>
                <LeagueMatchesPage />
              </ProtectedRoute>
            } />
            <Route path="/tables" element={
              <ProtectedRoute>
                <ChampionshipList />
              </ProtectedRoute>
            } />
            <Route path="/tables/:id" element={
              <ProtectedRoute>
                <CompetitionTable />
              </ProtectedRoute>
            } />
            
            {/* Перенаправление для неизвестных маршрутов */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <TabBar />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;