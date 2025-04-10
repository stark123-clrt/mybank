import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import BankHomePage from './pages/BankHomePage';
import { ExpensesProvider } from './context/ExpensesContext';
import { getCurrentUser } from './services/api';

function App() {
  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = () => {
    return getCurrentUser() !== null;
  };

  // Composant pour les routes protégées
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/home" replace />;
    }
    
    return children;
  };

  return (
    <Router>
      <ExpensesProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="py-6 sm:py-8">
            <Routes>
              {/* Page d'accueil accessible à tous */}
              <Route path="/home" element={<BankHomePage />} />
              
              {/* Page par défaut: redirection selon l'état de connexion */}
              <Route path="/" element={
                isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/home" replace />
              } />
              
              {/* Routes protégées */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/categories" element={
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>
              } />
              
              {/* Routes d'authentification */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Redirection pour toute autre route */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </main>
        </div>
      </ExpensesProvider>
    </Router>
  );
}

export default App;