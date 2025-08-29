import { createContext, useContext, useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory, getExpenses, createExpense, updateExpense, deleteExpense as apiDeleteExpense } from '../services/api';

const ExpensesContext = createContext();

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // AJOUT: Vérifier si l'utilisateur est connecté avant de faire les appels API
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Attendre que les DEUX appels API soient terminés
        const [categoriesData, expensesData] = await Promise.all([
          getCategories(),
          getExpenses()
        ]);
        
        // S'assurer que categories est toujours un tableau
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        
        // S'assurer que expenses est toujours un tableau
        setExpenses(Array.isArray(expensesData) ? expensesData : []);
        
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        
        // Si erreur d'authentification, rediriger vers login
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        
        // Pour les autres erreurs, définir des tableaux vides
        setCategories([]);
        setExpenses([]);
        setError('Erreur de connexion au serveur');
      } finally {
        // Toujours passer loading à false à la fin
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Ajouter une dépense
  const addExpense = async (expense) => {
    try {
      const newExpense = await createExpense(expense);
      setExpenses([newExpense, ...expenses]);
      return newExpense;
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la dépense:', err);
      throw err;
    }
  };

  const updateExpenseData = async (id, updatedExpense) => {
    try {
      const result = await updateExpense(id, updatedExpense);
      setExpenses(expenses.map(expense => 
        expense.id === id ? result : expense
      ));
      return result;
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la dépense:', err);
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await apiDeleteExpense(id);
      setExpenses(expenses.filter(expense => expense.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression de la dépense:', err);
      throw err;
    }
  };

  // Ajouter une catégorie
  const addCategory = async (category) => {
    try {
      console.log("Catégorie à ajouter:", category);
      const newCategory = await createCategory(category);
      console.log("Réponse de l'API:", newCategory);
      setCategories([...categories, newCategory]);
      return newCategory;
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la catégorie:', err);
      throw err;
    }
  };

  const deleteCategoryData = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(category => category.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression de la catégorie:', err);
      throw err;
    }
  };

  return (
    <ExpensesContext.Provider value={{
      expenses,
      categories,
      loading,
      error,
      addExpense,
      updateExpense: updateExpenseData,
      deleteExpense,
      addCategory,
      deleteCategory: deleteCategoryData,
    }}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  return useContext(ExpensesContext);
}