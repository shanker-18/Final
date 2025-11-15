import React, { useEffect } from 'react';
import { ChakraProvider, Box, CSSReset } from '@chakra-ui/react';
import { 
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  Navigate
} from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Insights from './components/Insights';
import Article from './components/Article';
import Projects from './pages/Projects';
import ChatRoom from './components/ChatRoom';
import Contact from './components/Contact';
import theme from './theme';
import HubDetails from './pages/HubDetails';
import Jobs from './pages/Jobs';
import AboutHub from './pages/AboutHub';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import UserMenu from './components/UserMenu';
import Features from './pages/Features';
import Notifications from './pages/Notifications';
import SavedProjects from './pages/SavedProjects';
import RecentActivity from './pages/RecentActivity';
import ChatBot from './components/ChatBot';
import { AnimatePresence } from 'framer-motion';
import ChatAssistant from './pages/ChatAssistant';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import AddProject from './components/AddProject';
import Welcome from './pages/Welcome';
import { UserProvider } from './contexts/UserContext';
import Header from './components/Header';
import MyProjects from './components/MyProjects';
import ProjectDetails from './pages/ProjectDetails';
import AnimatedBackground from './components/AnimatedBackground';
import EditProject from './pages/EditProject';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/NotFound';
import LearnMore from './components/LearnMore';
import DevReels from './pages/DevReels';
import SeekerSurvey from './pages/SeekerSurvey';
import { initVideoCacheService } from './services/videoCacheService';

function App() {
  // Initialize video cache service
  useEffect(() => {
    initVideoCacheService();
  }, []);

  const Layout = () => (
    <AnimatePresence mode="wait">
      <AnimatedBackground>
        <Box position="relative" overflowX="hidden" w="100%">
          <Box position="relative" zIndex={1000}>
            <Navbar />
            <UserMenu />
          </Box>
          <Box w="100%">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </Box>
          <ChatBot />
        </Box>
      </AnimatedBackground>
    </AnimatePresence>
  );

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="insights" element={<Insights />} />
        <Route path="article/:id" element={<Article />} />
        <Route 
          path="projects" 
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          } 
        />
        {/* Backwards compatibility: redirect /my-projects to /projects */}
        <Route path="my-projects" element={<Navigate to="/projects" replace />} />
        <Route 
          path="project/:id" 
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="chat-room"
          element={
            <ProtectedRoute>
              <ChatRoom />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="chat-assistant" 
          element={
            <ProtectedRoute>
              <ChatAssistant />
            </ProtectedRoute>
          } 
        />
        <Route path="contact" element={<Contact />} />
        <Route path="learn-more" element={<LearnMore />} />
        <Route path="welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
        <Route path="seeker-survey" element={<ProtectedRoute><SeekerSurvey /></ProtectedRoute>} />
        <Route path="add-project" element={<ProtectedRoute><AddProject /></ProtectedRoute>} />
        <Route path="dev-reels" element={<DevReels />} />
        <Route path="edit-project/:projectId" element={<EditProject />} />
        <Route
          path="edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="saved-projects"
          element={
            <ProtectedRoute>
              <SavedProjects />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ChakraProvider>
  );
}

export default App;