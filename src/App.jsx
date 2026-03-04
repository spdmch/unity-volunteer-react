// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { AuthProvider, useAuth } from './Context/AuthContext';
import { db } from './firebase';

import Header            from './components/Header';
import Footer            from './components/Footer';
import RegistrationForm  from './components/RegistrationForm';

import AboutPage          from './pages/AboutPage';
import ProjectsPage       from './pages/ProjectsPage';
import MyProjectsPage     from './pages/MyProjectsPage';
import FavoritesPage      from './pages/FavoritesPage';
import FormInitiativePage from './pages/FormInitiativePage';
import NewsPage           from './pages/NewsPage';
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';

import allInitiatives from './data/initiatives';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { currentUser } = useAuth();

  const [joinedIds,       setJoinedIds]       = useState([]);
  const [volunteersCount, setVolunteersCount] = useState({});
  const [favoriteIds,     setFavoriteIds]     = useState([]);
  const [dataLoaded,      setDataLoaded]      = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setJoinedIds([]);
      setFavoriteIds([]);
      setVolunteersCount({});
      setDataLoaded(false);
      return;
    }
    async function loadUserData() {
      const ref  = doc(db, 'users', currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setJoinedIds(data.joinedIds         || []);
        setFavoriteIds(data.favoriteIds     || []);
        setVolunteersCount(data.volunteersCount || {});
      }
      setDataLoaded(true);
    }
    loadUserData();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !dataLoaded) return;
    const ref = doc(db, 'users', currentUser.uid);
    setDoc(ref, { joinedIds, favoriteIds, volunteersCount }, { merge: true });
  }, [joinedIds, favoriteIds, volunteersCount, currentUser, dataLoaded]);

  const handleJoin = (initiativeId) => {
    if (joinedIds.includes(initiativeId)) return;
    setJoinedIds((prev) => [...prev, initiativeId]);
    const initiative = allInitiatives.find((i) => i.id === initiativeId);
    setVolunteersCount((prev) => ({
      ...prev,
      [initiativeId]: Math.max(
        0,
        (prev[initiativeId] !== undefined ? prev[initiativeId] : initiative.volunteers) - 1
      ),
    }));
  };

  const handleLeave = (initiativeId) => {
    setJoinedIds((prev) => prev.filter((id) => id !== initiativeId));
    const initiative = allInitiatives.find((i) => i.id === initiativeId);
    setVolunteersCount((prev) => ({
      ...prev,
      [initiativeId]:
        (prev[initiativeId] !== undefined ? prev[initiativeId] : initiative.volunteers) + 1,
    }));
  };

  const handleToggleFav = (initiativeId) => {
    setFavoriteIds((prev) =>
      prev.includes(initiativeId)
        ? prev.filter((id) => id !== initiativeId)
        : [...prev, initiativeId]
    );
  };

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<AboutPage />} />

        <Route
          path="/projects"
          element={
            <ProjectsPage
              joinedIds={joinedIds}
              volunteersCount={volunteersCount}
              favoriteIds={favoriteIds}
              onToggleFav={handleToggleFav}
            />
          }
        />

        {/* Захищені маршрути — без акаунту редірект на /login */}
        <Route
          path="/my-projects"
          element={
            <PrivateRoute>
              <MyProjectsPage
                joinedIds={joinedIds}
                volunteersCount={volunteersCount}
                onLeave={handleLeave}
              />
            </PrivateRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <PrivateRoute>
              <FavoritesPage
                favoriteIds={favoriteIds}
                joinedIds={joinedIds}
                volunteersCount={volunteersCount}
                onToggleFav={handleToggleFav}
              />
            </PrivateRoute>
          }
        />

        <Route
          path="/form-registr"
          element={
            <PrivateRoute>
              <RegistrationForm onJoin={handleJoin} />
            </PrivateRoute>
          }
        />

        <Route path="/form-initiative" element={<FormInitiativePage />} />
        <Route path="/news"            element={<NewsPage />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;