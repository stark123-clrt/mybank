import { useState } from 'react';
import { useExpenses } from '../context/ExpensesContext';
import { TrashIcon, PlusIcon, TagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

function Categories() {
  const { categories, expenses, loading, error, addCategory, deleteCategory } = useExpenses();
  const [newCategory, setNewCategory] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (newCategory.trim()) {
      try {
        // Vérifie si la catégorie existe déjà
        if (categories.some(cat => cat.title.toLowerCase() === newCategory.trim().toLowerCase())) {
          setFormError('Cette catégorie existe déjà');
          return;
        }
        
        await addCategory({ title: newCategory.trim() });
        setNewCategory('');
      } catch (err) {
        setFormError(err.response?.data?.message || 'Erreur lors de la création de la catégorie');
      }
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      // Vérifie si la catégorie est utilisée dans des dépenses
      if (expenses.some(expense => expense.categoryId === categoryId)) {
        setFormError('Impossible de supprimer une catégorie utilisée par des dépenses');
        setConfirmDelete(null);
        return;
      }
      
      await deleteCategory(categoryId);
      setFormError('');
      setConfirmDelete(null);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Erreur lors de la suppression de la catégorie');
      setConfirmDelete(null);
    }
  };

  // Indicateur de chargement animé
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
          Chargement de vos catégories...
        </motion.p>
      </div>
    );
  }

  // Affichage des erreurs
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* En-tête */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mt-5">Gestion des Catégories</h1>
              <p className="text-gray-500 mt-1">
                Organisez vos dépenses avec des catégories personnalisées
              </p>
            </div>
          </motion.div>
        </div>

        {/* Formulaire d'ajout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajouter une catégorie</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TagIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Ex: Alimentation, Transport, Loisirs..."
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit" 
                className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <PlusIcon className="h-5 w-5" />
                Ajouter
              </motion.button>
            </div>
            {formError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-red-50 text-red-600 rounded-lg text-sm"
              >
                {formError}
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Liste des catégories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Vos Catégories</h2>
            <p className="text-gray-500 text-sm mt-1">
              {categories.length} catégorie{categories.length !== 1 ? 's' : ''} enregistrée{categories.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {categories.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <TagIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">Aucune catégorie enregistrée</h3>
              <p className="mt-1 text-gray-500">Commencez par ajouter votre première catégorie pour organiser vos dépenses.</p>
            </motion.div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {categories.map(category => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <span 
                          className="inline-flex items-center justify-center h-10 w-10 rounded-full"
                          style={{ 
                            backgroundColor: `${category.color || '#e5e7eb'}20`,
                            color: category.color || '#6b7280'
                          }}
                        >
                          <TagIcon className="h-5 w-5" />
                        </span>
                        <div>
                          <span className="text-gray-900 font-medium">{category.title}</span>
                          <p className="text-xs text-gray-500">
                            {expenses.filter(e => e.categoryId === category.id).length} dépense{expenses.filter(e => e.categoryId === category.id).length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setConfirmDelete(category.id)}
                        className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full transition-colors"
                        title="Supprimer la catégorie"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Confirmation de suppression */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md relative"
            >
              <button
                onClick={() => setConfirmDelete(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              
              <div className="p-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrashIcon className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Confirmer la suppression</h3>
                <p className="text-gray-500 text-center mb-6">
                  Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.
                </p>
                
                <div className="flex justify-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setConfirmDelete(null)}
                    className="py-2 px-6 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium shadow-sm transition-all"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleDelete(confirmDelete)}
                    className="py-2 px-6 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium rounded-lg shadow transition-all"
                  >
                    Supprimer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Categories;