import { createContext, useContext, useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory, getExpenses, createExpense, updateExpense, deleteExpense as apiDeleteExpense } from '../services/api';

const ExpensesContext = createContext();

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les données depuis l'API au chargement
  useEffect(() => {
  // Dans la fonction fetchData de votre ExpensesContext.jsx
const fetchData = async () => {
  try {
    setLoading(true);
    
    // Charger les catégories
    const categoriesData = await getCategories();
    // S'assurer que categories est toujours un tableau
    setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    
    // Charger les dépenses
    const expensesData = await getExpenses();
    // S'assurer que expenses est toujours un tableau
    setExpenses(Array.isArray(expensesData) ? expensesData : []);
    
    setError(null);
  } catch (err) {
    console.error('Erreur lors du chargement des données:', err);
    // Si l'erreur est 404 et que c'est normal (pas de données), ne pas afficher d'erreur
    if (err.response && err.response.status === 404) {
      setCategories([]);
      setExpenses([]);
      setError(null);
    } else {
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
    }
  } finally {
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

  // Ajout une catégorie

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