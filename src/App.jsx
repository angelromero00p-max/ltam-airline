import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Passengers from './pages/Passengers';
import Assistance from './pages/Assistance';
import Payment from './pages/Payment';
import { ROUTES } from './routes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.HOME} replace />} />
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.RESULTS} element={<SearchResults key="outbound" />} />
        <Route path={ROUTES.RETURN_RESULTS} element={<SearchResults key="return" />} />
        <Route path={ROUTES.PASSENGERS} element={<Passengers />} />
        <Route path={ROUTES.ASSISTANCE} element={<Assistance />} />
        <Route path={ROUTES.PAYMENT} element={<Payment />} />
      </Routes>
    </Router>
  );
}

export default App;
