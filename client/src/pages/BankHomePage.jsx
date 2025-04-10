import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/api';

const BankHomePage = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();

  return (
    <div className="font-sans bg-gray-50">
      {/* Hero Section - Responsive Version */}
      <div className="relative bg-gradient-to-r from-emerald-900 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-32 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 animate-fade-in">
              <span className="block mb-2">Bienvenue chez</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-white">My Bank</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
              Votre partenaire financier pour une gestion <span className="font-semibold">simplifiée</span> et <span className="font-semibold">sécurisée</span>
            </p>
            
            {user ? (
              <Link 
                to="/dashboard" 
                className="inline-flex items-center justify-center bg-white text-emerald-800 font-bold py-3 md:py-4 px-6 md:px-10 rounded-full hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                Accéder à mon espace
                <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-5 px-4">
                <Link 
                  to="/signup" 
                  className="inline-flex items-center justify-center bg-white text-emerald-800 font-bold py-3 md:py-4 px-6 md:px-10 rounded-full hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl text-sm md:text-base"
                >
                  Créer un compte
                </Link>
                <Link 
                  to="/login" 
                  className="inline-flex items-center justify-center border-2 border-white text-white font-bold py-2 md:py-3 px-6 md:px-10 rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-300 transform hover:-translate-y-1 text-sm md:text-base"
                >
                  Se connecter
                  <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 hidden md:block">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,106.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Features Section - Responsive Version */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nos solutions bancaires</h2>
          <div className="w-16 md:w-24 h-1 bg-emerald-500 mx-auto"></div>
          <p className="text-gray-600 mt-4 md:mt-6 max-w-2xl mx-auto px-4">
            Découvrez une gamme complète de services financiers conçus pour répondre à tous vos besoins
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 px-4 md:px-0">
          {[
            {
              icon: (
                <svg className="w-8 md:w-10 h-8 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Comptes courants",
              description: "Gérez votre argent au quotidien avec nos solutions flexibles et avantageuses"
            },
            {
              icon: (
                <svg className="w-8 md:w-10 h-8 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              ),
              title: "Épargne & Investissement",
              description: "Faites fructifier votre argent avec des solutions adaptées à vos objectifs"
            },
            {
              icon: (
                <svg className="w-8 md:w-10 h-8 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              ),
              title: "Mobile Banking",
              description: "Accédez à vos comptes 24/7 depuis notre application primée"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="bg-gradient-to-r from-emerald-100 to-emerald-50 w-16 md:w-20 h-16 md:h-20 mx-auto rounded-full flex items-center justify-center mb-4 md:mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-gray-800 text-center">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-center text-sm md:text-base">{feature.description}</p>
              <div className="mt-4 md:mt-6 text-center">
                <Link 
                  to={user ? "/dashboard" : "/signup"} 
                  className="text-emerald-600 font-medium inline-flex items-center hover:text-emerald-800 transition-colors text-sm md:text-base"
                >
                  En savoir plus
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Section - Responsive Version */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 lg:order-1 px-4 md:px-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-8 text-gray-900 leading-tight">
              Une expérience bancaire <span className="text-emerald-600">réinventée</span>
            </h2>
            <p className="text-gray-600 mb-4 md:mb-6 text-base md:text-lg leading-relaxed">
              Chez My Bank, nous combinons technologie de pointe et service personnalisé pour répondre à tous vos besoins bancaires.
            </p>
            <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg leading-relaxed">
              Nos conseillers experts sont disponibles pour vous accompagner dans tous vos projets financiers, de l'ouverture de compte à la gestion de patrimoine.
            </p>
            {user ? (
              <Link 
                to="/categories" 
                className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-emerald-800 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                Gérer mes catégories
                <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            ) : (
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-emerald-800 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                Découvrir nos services
                <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            )}
          </div>
          <div className="order-1 lg:order-2 relative px-4 md:px-0">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://imgur.com/7o6asZJ.jpg"
                alt="Interface bancaire moderne"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            <div className="absolute -bottom-4 md:-bottom-6 -left-4 md:-left-6 bg-white p-3 md:p-4 rounded-lg shadow-lg hidden lg:block">
              <div className="flex items-center">
                <div className="bg-emerald-100 p-2 md:p-3 rounded-full mr-2 md:mr-3">
                  <svg className="w-4 h-4 md:w-6 md:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm md:text-base">+2M</p>
                  <p className="text-xs md:text-sm text-gray-600">Clients satisfaits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - Responsive Version */}
      <div className="bg-emerald-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            {[
              { number: "99.9%", label: "Disponibilité" },
              { number: "24/7", label: "Support client" },
              { number: "256-bit", label: "Sécurité" },
              { number: "4.9/5", label: "Satisfaction" }
            ].map((stat, index) => (
              <div key={index} className="p-4 md:p-6">
                <p className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">{stat.number}</p>
                <p className="text-emerald-200 text-xs md:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Responsive Version */}
      <div className="relative bg-gradient-to-r from-emerald-800 to-emerald-600 text-white py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-48 md:w-64 h-48 md:h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">Prêt à rejoindre My Bank ?</h2>
          <p className="text-base md:text-xl mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Ouvrez un compte en quelques minutes et bénéficiez de tous nos services exclusifs.
          </p>
          
          {user ? (
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-5">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center justify-center bg-white text-emerald-700 font-bold py-3 md:py-4 px-6 md:px-10 rounded-full hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                Accéder à mon tableau de bord
                <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-5">
              <Link 
                to="/signup" 
                className="inline-flex items-center justify-center bg-white text-emerald-700 font-bold py-3 md:py-4 px-6 md:px-10 rounded-full hover:bg-emerald-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                Créer un compte
              </Link>
              <Link 
                to="/login" 
                className="inline-flex items-center justify-center border-2 border-white text-white font-bold py-2 md:py-3 px-6 md:px-10 rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-300 transform hover:-translate-y-1 text-sm md:text-base"
              >
                Se connecter
                <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Responsive Version */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="px-4 md:px-0">
              <h3 className="text-white text-lg font-semibold mb-4">My Bank</h3>
              <p className="mb-4 text-sm md:text-base">Une application de gestion financière personnelle nouvelle génération.</p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                  <a key={social} href="#" className="text-gray-400 hover:text-white transition-colors">
                    <span className="sr-only">{social}</span>
                    <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d={`M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z`} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div className="px-4 md:px-0">
              <h3 className="text-white text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {['Comptes courants', 'Épargne', 'Prêts', 'Cartes bancaires'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors text-sm md:text-base">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-4 md:px-0">
              <h3 className="text-white text-lg font-semibold mb-4">Aide</h3>
              <ul className="space-y-2">
                {['Centre d\'aide', 'Contact', 'FAQ', 'Sécurité'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors text-sm md:text-base">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-4 md:px-0">
              <h3 className="text-white text-lg font-semibold mb-4">Légal</h3>
              <ul className="space-y-2">
                {['CGU', 'Confidentialité', 'Cookies', 'Mentions légales'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors text-sm md:text-base">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm md:text-base">&copy; {new Date().getFullYear()} My Bank. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BankHomePage;