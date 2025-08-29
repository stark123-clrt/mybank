import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Services d'authentification

export const login = async (credentials) => {
  try {
    const response = await api.post('/login', {  
      username: credentials.email,
      password: credentials.password
    });

    // Stocker le token
    localStorage.setItem('token', response.data.token);
    
    // Récupérer les données utilisateur depuis la réponse
    const user = response.data.user || {
      email: credentials.email,
      name: credentials.email 
    };
    
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  } catch (error) {
    console.error('Erreur de connexion:', error.response ? error.response.data : error);
    throw error;
  }
};

export const register = async (userData) => {
  return api.post('/register', userData);
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Récupérer l'utilisateur courant
export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // Récupère directement les données du localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    return JSON.parse(userStr);
  } catch (error) {
    // En cas d'erreur
    logout();
    return null;
  }
};

// Services pour les catégories
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    // Retourner un tableau vide en cas d'erreur 404
    if (error.response && error.response.status === 404) {
      return [];
    }
    throw error;
  }
};

export const createCategory = async (category) => {
  try {
    const response = await api.post('/categories', category);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    await api.delete(`/categories/${id}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    throw error;
  }
};

// Services pour les dépenses
export const getExpenses = async () => {
  try {
    const response = await api.get('/expenses');
    return response.data || []; // Retourner un tableau vide si pas de données
  } catch (error) {
    // Si l'erreur est 404, retourner un tableau vide plutôt que de lancer une erreur
    if (error.response && error.response.status === 404) {
      return [];
    }
    console.error('Erreur lors de la récupération des dépenses:', error);
    throw error;
  }
};

export const createExpense = async (expense) => {
  try {
    const response = await api.post('/expenses', expense);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la dépense:', error);
    throw error;
  }
};


export const updateExpense = async (id, expense) => {
  try {
    const response = await api.put(`/expenses/${id}`, expense);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la dépense:', error);
    throw error;
  }
};


export const deleteExpense = async (id) => {
  try {
    await api.delete(`/expenses/${id}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de la dépense:', error);
    throw error;
  }
};

export default api;