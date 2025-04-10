<?php

namespace App\Controller;

use Psr\Log\LoggerInterface;
use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/categories')]
class CategoryController extends AbstractController
{
    #[Route('', name: 'category_list', methods: ['GET'])]
    public function index(CategoryRepository $categoryRepository, LoggerInterface $logger): JsonResponse
    {
        try {
            $user = $this->getUser();
            
            if (!$user) {
                $logger->warning('Tentative d\'accès non authentifiée aux catégories');
                return $this->json(['message' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
            }
            
            // Récupérer l'ID de l'utilisateur et l'utiliser dans la requête
            $userId = $user->getId();
            $logger->info('Récupération des catégories pour l\'utilisateur ID: ' . $userId);
            
            // Utilisation directe du repository pour simplifier la requête
            $categories = $categoryRepository->findBy(['user' => $userId]);
            
            $data = [];
            foreach ($categories as $category) {
                $data[] = [
                    'id' => $category->getId(),
                    'title' => $category->getTitle()
                ];
            }
            
            $logger->info('Nombre de catégories récupérées: ' . count($data));
            return $this->json($data);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la récupération des catégories: ' . $e->getMessage());
            return $this->json(['message' => 'Erreur serveur lors de la récupération des catégories'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    #[Route('', name: 'category_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager, LoggerInterface $logger): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $user = $this->getUser();
            
            if (!$user) {
                $logger->warning('Tentative de création de catégorie sans authentification');
                return $this->json(['message' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
            }
            
            // Validation de base
            if (!isset($data['title']) || empty($data['title'])) {
                return $this->json(['message' => 'Le titre est requis'], Response::HTTP_BAD_REQUEST);
            }
            
            // Vérifier si la catégorie existe déjà pour cet utilisateur
            $existingCategory = $entityManager->getRepository(Category::class)->findOneBy([
                'title' => $data['title'],
                'user' => $user
            ]);
            
            if ($existingCategory) {
                return $this->json(['message' => 'Cette catégorie existe déjà'], Response::HTTP_CONFLICT);
            }
            
            // Créer la nouvelle catégorie
            $category = new Category();
            $category->setTitle($data['title']);
            $category->setUser($user);
            
            $entityManager->persist($category);
            $entityManager->flush();
            
            $logger->info('Catégorie créée: ID=' . $category->getId() . ', Titre=' . $category->getTitle() . ', UserID=' . $user->getId());
            
            return $this->json([
                'id' => $category->getId(),
                'title' => $category->getTitle()
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la création de la catégorie: ' . $e->getMessage());
            return $this->json(['message' => 'Erreur serveur lors de la création de la catégorie'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    #[Route('/{id}', name: 'category_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager, CategoryRepository $categoryRepository, LoggerInterface $logger): JsonResponse
    {
        try {
            $user = $this->getUser();
            
            if (!$user) {
                $logger->warning('Tentative de suppression de catégorie sans authentification');
                return $this->json(['message' => 'Utilisateur non authentifié'], Response::HTTP_UNAUTHORIZED);
            }
            
            $category = $categoryRepository->findOneBy(['id' => $id, 'user' => $user]);
            
            if (!$category) {
                $logger->warning('Tentative de suppression d\'une catégorie inexistante ou appartenant à un autre utilisateur: ID=' . $id);
                return $this->json(['message' => 'Catégorie non trouvée'], Response::HTTP_NOT_FOUND);
            }
            
            // Vérifier si la catégorie est utilisée par des dépenses
            if (!$category->getExpenses()->isEmpty()) {
                $logger->info('Impossible de supprimer la catégorie ID=' . $id . ' car elle est utilisée par des dépenses');
                return $this->json(['message' => 'Impossible de supprimer une catégorie utilisée par des dépenses'], Response::HTTP_BAD_REQUEST);
            }
            
            $entityManager->remove($category);
            $entityManager->flush();
            
            $logger->info('Catégorie supprimée: ID=' . $id);
            
            return $this->json(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            $logger->error('Erreur lors de la suppression de la catégorie: ' . $e->getMessage());
            return $this->json(['message' => 'Erreur serveur lors de la suppression de la catégorie'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}