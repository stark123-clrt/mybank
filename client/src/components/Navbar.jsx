import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/api';
import {
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  TagIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsMenuOpen(false);
    };

    checkUser();
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsProfileOpen(false);
    navigate('/home');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md py-2 shadow-lg' 
          : 'bg-white/90 backdrop-blur-sm py-3'
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo avec animation au hover */}
          <Link
            to="/home"
            className="text-xl md:text-2xl font-bold flex items-center gap-1 group"
            aria-label="Retour à l'accueil"
            onClick={closeMenu}
          >
            <span className="text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300">my</span>
            <span className="text-gray-900 group-hover:text-gray-800 transition-colors duration-300">Bank</span>
            <span className="block h-1 w-0 group-hover:w-full bg-emerald-600 transition-all duration-500 origin-left"></span>
          </Link>

          {/* Navigation desktop - Version Premium */}
          <nav className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <NavLink
                  to="/dashboard"
                  icon={<ChartBarIcon className="h-4 md:h-5 w-4 md:w-5" />}
                  label="Dashboard"
                />
                <NavLink
                  to="/categories"
                  icon={<TagIcon className="h-4 md:h-5 w-4 md:w-5" />}
                  label="Catégories"
                />
                
                {/* Menu profil premium */}
                <div className="relative ml-2">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <div className="relative">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-medium text-xs md:text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-2 md:w-3 h-2 md:h-3 bg-green-400 border-2 border-white rounded-full"></span>
                    </div>
                    <span className="hidden md:inline text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDownIcon className={`hidden md:block h-3 md:h-4 w-3 md:w-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown menu - Version Premium */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 md:w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-up z-50">
                      <div className="p-1">
                        <div className="px-3 md:px-4 py-2 md:py-3 border-b border-gray-100">
                          <p className="text-xs md:text-sm font-medium text-gray-900">Bonjour,</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                       
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 hover:bg-gray-50 rounded-lg mx-1"
                        >
                          <ArrowLeftOnRectangleIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 text-gray-400" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
          
                <NavLink
                  to="/login"
                  icon={<UserIcon className="h-4 md:h-5 w-4 md:w-5" />}
                  label="Connexion"
                  variant="secondary"
                />
                <NavLink
                  to="/signup"
                  label="S'inscrire"
                  variant="primary"
                />
              </>
            )}
          </nav>

          {/* Bouton menu mobile - Version améliorée */}
          <button
            className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <div className="relative w-6 h-6">
              <span className={`absolute block w-6 h-0.5 bg-gray-700 transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`}></span>
              <span className={`absolute block w-6 h-0.5 bg-gray-700 transform transition duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`absolute block w-6 h-0.5 bg-gray-700 transform transition duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`}></span>
            </div>
          </button>
        </div>

        {/* Menu mobile - Version Premium */}
        {isMenuOpen && (
          <div 
            className="md:hidden pb-4 pt-2 animate-fade-in fixed inset-x-0 top-16 bg-white shadow-lg"
            style={{ height: 'calc(100vh - 4rem)' }}
          >
            <div className="px-2 space-y-1 h-full overflow-y-auto">
              {user ? (
                <>
                  <MobileNavLink
                    to="/dashboard" 
                    icon={<ChartBarIcon className="h-5 w-5" />}
                    label="Dashboard"
                    onClick={closeMenu}
                  />
                  <MobileNavLink
                    to="/categories"
                    icon={<TagIcon className="h-5 w-5" />}
                    label="Catégories"
                    onClick={closeMenu}
                  />
               
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mx-1 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5 text-gray-500" />
                    Déconnexion
                  </button>
                  <div className="px-4 py-3 border-t border-gray-100 mt-2">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </>
              ) : (
                <>
                  <MobileNavLink
                    to="/login"
                    icon={<UserIcon className="h-5 w-5" />}
                    label="Connexion"
                    onClick={closeMenu}
                  />
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="w-full block text-center bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium py-3 px-4 rounded-lg mt-2 hover:opacity-90 transition-opacity"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// Composant NavLink amélioré avec variants
const NavLink = ({ to, icon, label, variant = 'default', className = '' }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const baseClasses = 'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium text-xs md:text-sm';
  
  const variants = {
    default: `${
      isActive 
        ? 'bg-emerald-50 text-emerald-600' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`,
    secondary: `${
      isActive
        ? 'text-emerald-600'
        : 'text-gray-600 hover:text-gray-900'
    }`,
    primary: `bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:opacity-90 shadow hover:shadow-md ${
      isActive ? 'ring-2 ring-emerald-400' : ''
    }`
  };

  return (
    <Link
      to={to}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {icon && (
        <span className={`${isActive && variant === 'default' ? 'text-emerald-500' : 'text-gray-400'}`}>
          {icon}
        </span>
      )}
      {label}
    </Link>
  );
};

// Composant MobileNavLink amélioré
const MobileNavLink = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-1 transition-colors duration-200 ${
        isActive 
          ? 'bg-emerald-50 text-emerald-600 font-medium' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon && (
        <span className={`${isActive ? 'text-emerald-500' : 'text-gray-500'}`}>
          {icon}
        </span>
      )}
      {label}
    </Link>
  );
};

export default Navbar;