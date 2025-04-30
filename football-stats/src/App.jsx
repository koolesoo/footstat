import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LiveScoresPage from './pages/LiveScoresPage';
import ProfilePage from './pages/ProfilePage'; 
import TabBar from './components/TabBar';
import Tables from './pages/Tables';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/matches" element={<LiveScoresPage />} />
          <Route path="/profile" element={<ProfilePage />} /> 
          <Route path="/tables" element={<Tables />} />
        </Routes>
        <TabBar />
      </div>
    </Router>
  );
};

export default App;