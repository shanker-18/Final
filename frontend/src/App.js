import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { UserProvider } from './config/UserContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';

// Components
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Verification from './components/Verification';
import NotFound from './components/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import Article from './components/Article';
import LearnMore from './components/LearnMore';
import Projects from './components/Projects';
import EditProject from './components/EditProject';
import CreateProject from './components/CreateProject';
import EditProfile from './pages/EditProfile';
import Insights from './components/Insights';
import DetailedArticle from './components/DetailedArticle';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser;
  if (!user) {
    return <Navigate to="/auth" />;
  }
  return children;
};

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <UserProvider>
        <Router>
          <ErrorBoundary>
            <Header />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/verify" element={<Verification />} />
              <Route path="/learn-more" element={<LearnMore />} />
              <Route path="/article/:id" element={<Article />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/articles/:id" element={<DetailedArticle />} />

              {/* Protected Routes */}
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } />
              <Route path="/create-project" element={
                <ProtectedRoute>
                  <CreateProject />
                </ProtectedRoute>
              } />
              <Route path="/edit-project/:projectId" element={
                <ProtectedRoute>
                  <EditProject />
                </ProtectedRoute>
              } />
              <Route path="/edit-profile" element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </Router>
      </UserProvider>
    </ChakraProvider>
  );
};

export default App; 