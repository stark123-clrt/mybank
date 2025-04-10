<?php
// src/Controller/ExpenseController.php
namespace App\Controller;

use Psr\Log\LoggerInterface;
use App\Entity\Expense;
use App\Repository\CategoryRepository;
use App\Repository\ExpenseRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/expenses')]
class ExpenseController extends AbstractController
{
    #[Route('', name: 'expense_list', methods: ['GET'])]
    public function index(ExpenseRepository $expenseRepository, LoggerInterface $logger): JsonResponse
    {
        try {
            $user = $this->getUser();
            
            if (!$user) {
                $logger->warning('Tentative d\'accès non authentifiée aux dépenses');
                return $this->json(['message' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
            }
            
            // Récupérer l'ID de l'utilisateur et l'utiliser dans la requête
            $userId = $user->getId();
            $logger->info('Récupération des dépenses pour l\'utilisateur ID: ' . $userId);
            
            // Utilisation directe du repository pour simplifier la requête
            $expenses = $expenseRepository->findBy(['user' => $userId], ['date' => 'DESC']);
            
            $data = [];
            foreach ($expenses as $expense) {
                $data[] = [
                    'id' => $expense->getId(),
                    'title' => $expense->getTitle(),
                    'amount' => $expense->getAmount() / 100, // Convertir les centimes en euros
                    'date' => $expense->getDate()->format('Y-m-d'),
                    'categoryId' => $expense->getCategory()->getId()
                ];
            }
            
            $logger->info('Nombre de dépenses récupérées: ' . count($data));
            return $this->json($data);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la récupération des dépenses: ' . $e->getMessage());
            return $this->json(['message' => 'Erreur serveur lors de la récupération des dépenses'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    #[Route('', name: 'expense_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager, CategoryRepository $categoryRepository, LoggerInterface $logger): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $user = $this->getUser();
            
            if (!$user) {
                $logger->warning('Tentative de création de dépense sans authentification');
                return $this->json(['message' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
            }
            
            // Validation de base
            if (!isset($data['title']) || !isset($data['amount']) || !isset($data['date']) || !isset($data['categoryId'])) {
                return $this->json(['message' => 'Données incomplètes'], Response::HTTP_BAD_REQUEST);
            }
            
            // Récupérer la catégorie
            $category = $categoryRepository->findOneBy(['id' => $data['categoryId'], 'user' => $user]);
            if (!$category) {
                $logger->warning('Tentative d\'utilisation d\'une catégorie inexistante ou appartenant à un autre utilisateur: CategoryID=' . $data['categoryId']);
                return $this->json(['message' => 'Catégorie non trouvée'], Response::HTTP_BAD_REQUEST);
            }
            
            // Créer la nouvelle dépense
            $expense = new Expense();
            $expense->setTitle($data['title']);
            $expense->setAmount((int)($data['amount'] * 100)); // Convertir les euros en centimes
            $expense->setDate(new \DateTime($data['date']));
            $expense->setCategory($category);
            $expense->setUser($user);
            
            $entityManager->persist($expense);
            $entityManager->flush();
            
            $logger->info('Dépense créée: ID=' . $expense->getId() . ', Titre=' . $expense->getTitle() . ', UserID=' . $user->getId());
            
            return $this->json([
                'id' => $expense->getId(),
                'title' => $expense->getTitle(),
                'amount' => $expense->getAmount() / 100,
                'date' => $expense->getDate()->format('Y-m-d'),
                'categoryId' => $expense->getCategory()->getId()
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la création de la dépense: ' . $e->getMessage());
            return $this->json(['message' => 'Erreur serveur lors de la création de la dépense'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    #[Route('/{id}', name: 'expense_update', methods: ['PUT'])]
    public function update(int $id, Request $request, EntityManagerInterface $entityManager, ExpenseRepository $expenseRepository, CategoryRepository $categoryRepository, LoggerInterface $logger): JsonResponse
    {
        try {
            $user = $this->getUser();
            
            if (!$user) {
                $logger->warning('Tentative de mise à jour de dépense sans authentification');
                return $this->json(['message' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
            }
            
            $expense = $expenseRepository->findOneBy(['id' => $id, 'user' => $user]);
            
            if (!$expense) {
                $logger->warning('Tentative de mise à jour d\'une dépense inexistante ou appartenant à un autre utilisateur: ID=' . $id);
                return $this->json(['message' => 'Dépense non trouvée'], Response::HTTP_NOT_FOUND);
            }
            
            $data = json_decode($request->getContent(), true);
            
            // Validation de base
            if (!isset($data['title']) || !isset($data['amount']) || !isset($data['date']) || !isset($data['categoryId'])) {
                return $this->json(['message' => 'Données incomplètes'], Response::HTTP_BAD_REQUEST);
            }
            
            // Récupérer la catégorie
            $category = $categoryRepository->findOneBy(['id' => $data['categoryId'], 'user' => $user]);
            if (!$category) {
                $logger->warning('Tentative d\'utilisation d\'une catégorie inexistante ou appartenant à un autre utilisateur: CategoryID=' . $data['categoryId']);
                return $this->json(['message' => 'Catégorie non trouvée'], Response::HTTP_BAD_REQUEST);
            }
            
            // Mettre à jour la dépense
            $expense->setTitle($data['title']);
            $expense->setAmount((int)($data['amount'] * 100)); // Convertir les euros en centimes
            $expense->setDate(new \DateTime($data['date']));
            $expense->setCategory($category);
            $expense->setUpdatedAt(new \DateTimeImmutable());
            
            $entityManager->flush();
            
            $logger->info('Dépense mise à jour: ID=' . $expense->getId());
            
            return $this->json([
                'id' => $expense->getId(),
                'title' => $expense->getTitle(),
                'amount' => $expense->getAmount() / 100,
                'date' => $expense->getDate()->format('Y-m-d'),
                'categoryId' => $expense->getCategory()->getId()
            ]);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la mise à jour de la dépense: ' . $e->getMessage());
            return $this->json(['message' => 'Erreur serveur lors de la mise à jour de la dépense'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    #[Route('/{id}', name: 'expense_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager, ExpenseRepository $expenseRepository, LoggerInterface $logger): JsonResponse
    {
        try {
            $user = $this->getUser();
            
            if (!$user) {
                $logger->warning('Tentative de suppression de dépense sans authentification');
                return $this->json(['message' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
            }
            
            $expense = $expenseRepository->findOneBy(['id' => $id, 'user' => $user]);
            
            if (!$expense) {
                $logger->warning('Tentative de suppression d\'une dépense inexistante ou appartenant à un autre utilisateur: ID=' . $id);
                return $this->json(['message' => 'Dépense non trouvée'], Response::HTTP_NOT_FOUND);
            }
            
            $entityManager->remove($expense);
            $entityManager->flush();
            
            $logger->info('Dépense supprimée: ID=' . $id);
            
            return $this->json(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la suppression de la dépense: ' . $e->getMessage());
            return $this->json(['message' => 'Erreur serveur lors de la suppression de la dépense'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}