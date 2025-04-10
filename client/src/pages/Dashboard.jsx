import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useExpenses } from '../context/ExpensesContext';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  TagIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
  const { expenses, categories, loading, error, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    categoryId: categories.length > 0 ? categories[0].id.toString() : '',
  });
  const [formError, setFormError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [chartType, setChartType] = useState('bar');

  // Gestion des dates pour le mois courant et précédent
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());
  const previousMonthStart = startOfMonth(subMonths(new Date(), 1));
  const previousMonthEnd = endOfMonth(subMonths(new Date(), 1));
  
  // Filtrage des dépenses
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= currentMonthStart && expenseDate <= currentMonthEnd;
  });

  const previousMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= previousMonthStart && expenseDate <= previousMonthEnd;
  });

  // Calcul des totaux
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const monthlyExpenses = currentMonthExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const previousMonthlyExpenses = previousMonthExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  
  // Calcul de la variation mensuelle
  const monthlyVariation = previousMonthlyExpenses > 0 
    ? ((monthlyExpenses - previousMonthlyExpenses) / previousMonthlyExpenses) * 100 
    : 0;

  // Dépenses par catégorie
  const expensesByCategory = categories.map(category => ({
    ...category,
    total: expenses
      .filter(expense => expense.categoryId === category.id)
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0),
    color: `#${Math.floor(Math.random()*16777215).toString(16)}` // Couleur aléatoire
  })).sort((a, b) => b.total - a.total);

  // Préparation des données pour les graphiques
  const chartData = {
    labels: expensesByCategory.map(cat => cat.title),
    datasets: [{
      label: 'Dépenses par catégorie',
      data: expensesByCategory.map(cat => cat.total),
      backgroundColor: expensesByCategory.map(cat => cat.color),
      borderWidth: 1
    }]
  };

  const monthlyComparisonData = {
    labels: ['Mois précédent', 'Ce mois-ci'],
    datasets: [{
      label: 'Dépenses mensuelles',
      data: [previousMonthlyExpenses, monthlyExpenses],
      backgroundColor: ['#4f46e5', '#10b981'],
      borderWidth: 1
    }]
  };

  // Tri des dépenses
  const sortedExpenses = [...expenses].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredExpenses = activeTab === 'month' 
    ? sortedExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= currentMonthStart && expenseDate <= currentMonthEnd;
      })
    : sortedExpenses;

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      const expenseData = {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        categoryId: parseInt(newExpense.categoryId),
      };

      if (editingExpense) {
        await updateExpense(editingExpense.id, expenseData);
      } else {
        await addExpense(expenseData);
      }

      resetForm();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Une erreur est survenue lors de l\'enregistrement');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setNewExpense({
      title: expense.title,
      amount: expense.amount.toString(),
      date: expense.date,
      categoryId: expense.categoryId.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      try {
        await deleteExpense(id);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  const resetForm = () => {
    setNewExpense({
      title: '',
      amount: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      categoryId: categories.length > 0 ? categories[0].id.toString() : '',
    });
    setEditingExpense(null);
    setShowForm(false);
    setFormError('');
  };

  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 rounded-full border-4 border-emerald-500 border-t-transparent"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-lg font-medium text-gray-700"
        >
          Chargement de vos données financières...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-red-200 mt-8"
      >
        <div className="text-red-500 font-medium text-lg mb-2">Erreur de chargement</div>
        <p className="text-gray-600 mb-4">{error}</p>
        <p className="text-gray-500 text-sm">Vérifiez votre connexion internet et rafraîchissez la page.</p>
      </motion.div>
    );
  }

  if (categories.length === 0) {
    return (
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100 mt-8 text-center"
      >
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TagIcon className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Commencez par créer des catégories</h2>
        <p className="text-gray-600 mb-6">
          Pour organiser vos dépenses, vous devez d'abord créer des catégories comme "Alimentation", "Transport", etc.
        </p>
        <Link 
          to="/categories" 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Créer des catégories
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mt-8">Tableau de Bord Financier</h1>
            <p className="text-gray-500 mt-1">
              {format(currentMonthStart, 'MMMM yyyy')} • Suivi de vos dépenses
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <PlusIcon className="h-5 w-5" />
            {showForm ? 'Masquer le formulaire' : 'Nouvelle dépense'}
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total des Dépenses" 
            value={totalExpenses.toFixed(2)} 
            currency="€"
            icon={<ChartBarIcon className="h-6 w-6" />}
            trend="neutral"
            percentage={null}
            className="bg-gradient-to-br from-white to-gray-50"
          />
          <StatCard 
            title="Dépenses ce Mois" 
            value={monthlyExpenses.toFixed(2)} 
            currency="€"
            icon={<ArrowUpIcon className="h-6 w-6" />}
            trend={monthlyVariation > 0 ? 'up' : 'down'}
            percentage={Math.abs(monthlyVariation).toFixed(1)}
            className="bg-gradient-to-br from-white to-blue-50"
          />
          <StatCard 
            title="Catégorie Principale" 
            value={expensesByCategory[0]?.title || 'Aucune'} 
            subValue={expensesByCategory[0] ? `${expensesByCategory[0].total.toFixed(2)}€` : ''}
            icon={<TagIcon className="h-6 w-6" />}
            trend="neutral"
            percentage={expensesByCategory[0] ? `${((expensesByCategory[0].total / totalExpenses) * 100).toFixed(1)}%` : null}
            className="bg-gradient-to-br from-white to-emerald-50"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Répartition par Catégorie</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 text-sm rounded-lg ${chartType === 'bar' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}
                >
                  Barres
                </button>
                <button 
                  onClick={() => setChartType('pie')}
                  className={`px-3 py-1 text-sm rounded-lg ${chartType === 'pie' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}
                >
                  Camembert
                </button>
              </div>
            </div>
            <div className="h-64">
              {chartType === 'bar' ? (
                <Bar 
                  data={chartData} 
                  options={{ 
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      }
                    }
                  }} 
                />
              ) : (
                <Pie 
                  data={chartData} 
                  options={{ 
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      }
                    }
                  }} 
                />
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Comparaison Mensuelle</h3>
            <div className="h-64">
              <Bar 
                data={monthlyComparisonData} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Historique des Dépenses</h2>
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'all' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Toutes
              </button>
              <button
                onClick={() => setActiveTab('month')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === 'month' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                Ce mois-ci
              </button>
            </div>
          </div>
          
          {expenses.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ChartBarIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Aucune dépense enregistrée</h3>
              <p className="mt-1 text-gray-500">Commencez à suivre vos dépenses en ajoutant votre première transaction.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Ajouter une dépense
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('title')}
                    >
                      <div className="flex items-center">
                        Titre
                        {sortConfig.key === 'title' && (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('amount')}
                    >
                      <div className="flex items-center">
                        Montant
                        {sortConfig.key === 'amount' && (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('categoryId')}
                    >
                      <div className="flex items-center">
                        Catégorie
                        {sortConfig.key === 'categoryId' && (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort('date')}
                    >
                      <div className="flex items-center">
                        Date
                        {sortConfig.key === 'date' && (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                            <ChevronDownIcon className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExpenses.map(expense => (
                    <motion.tr 
                      key={expense.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {expense.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-red-500 font-medium">
                          -{parseFloat(expense.amount).toFixed(2)}€
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className="px-3 py-1 text-xs rounded-full font-medium"
                          style={{ 
                            backgroundColor: `${categories.find(c => c.id === expense.categoryId)?.color || '#e5e7eb'}20`,
                            color: categories.find(c => c.id === expense.categoryId)?.color || '#6b7280'
                          }}
                        >
                          {categories.find(c => c.id === expense.categoryId)?.title || 'Inconnue'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {format(new Date(expense.date), 'dd MMM yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(expense)}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-full transition-colors"
                            title="Modifier"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(expense.id)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full transition-colors"
                            title="Supprimer"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Expense Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-md relative"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
              >
                <button
                  onClick={resetForm}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
                
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {editingExpense ? 'Modifier la dépense' : 'Nouvelle dépense'}
                  </h2>
                  <p className="text-gray-500 mb-6">
                    {editingExpense ? 'Mettez à jour les détails de votre dépense' : 'Ajoutez une nouvelle dépense à votre historique'}
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Titre*</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        value={newExpense.title}
                        onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                        required
                        placeholder="Ex: Courses, Essence..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Montant (€)*</label>
                        <div className="relative">
                          <input
                            type="number"
                            className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                            required
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">€</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date*</label>
                        <input
                          type="date"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          value={newExpense.date}
                          onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie*</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        value={newExpense.categoryId}
                        onChange={(e) => setNewExpense({ ...newExpense, categoryId: e.target.value })}
                        required
                      >
                        <option value="">Sélectionnez une catégorie</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {formError && (
                      <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {formError}
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={resetForm}
                        className="py-2 px-6 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium shadow-sm transition-all"
                      >
                        Annuler
                      </motion.button>
                      <motion.button 
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }} 
                        className="py-2 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow transition-all"
                      >
                        {editingExpense ? 'Mettre à jour' : 'Ajouter'}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Composant StatCard amélioré
function StatCard({ title, value, currency = '', subValue = '', icon, trend, percentage, className = '' }) {
  const trendColors = {
    up: 'text-red-500 bg-red-100',
    down: 'text-emerald-500 bg-emerald-100',
    neutral: 'text-gray-500 bg-gray-100'
  };

  const trendIcons = {
    up: <ArrowUpIcon className="h-4 w-4" />,
    down: <ArrowDownIcon className="h-4 w-4" />,
    neutral: null
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`rounded-xl shadow-md p-6 border border-gray-100 ${className}`}
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="mt-2 flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              {value}
            </span>
            {currency && (
              <span className="ml-1 text-sm font-medium text-gray-500">
                {currency}
              </span>
            )}
          </div>
          {subValue && (
            <p className="mt-1 text-sm text-gray-500">
              {subValue}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${trendColors[trend]}`}>
            {icon}
          </div>
          {percentage !== null && percentage !== undefined && (
            <div className={`mt-2 flex items-center ${trendColors[trend]} px-2 py-1 rounded-full text-xs font-medium`}>
              {trendIcons[trend]}
              <span className="ml-1">{percentage}%</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;