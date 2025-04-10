<?php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Psr\Log\LoggerInterface;

class SecurityController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request, 
        UserPasswordHasherInterface $passwordHasher, 
        EntityManagerInterface $entityManager,
        LoggerInterface $logger
    ): JsonResponse {
        try {
            $content = $request->getContent();
            $logger->info('Contenu de la requête : ' . $content);

            $data = json_decode($content, true);
            
            if ($data === null) {
                $logger->error('Impossible de décoder le JSON');
                return $this->json([
                    'message' => 'Données JSON invalides'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Validation des données
            if (!isset($data['email']) || !isset($data['password']) || !isset($data['name'])) {
                return $this->json([
                    'message' => 'Données incomplètes'
                ], Response::HTTP_BAD_REQUEST);
            }

            // Validation de l'email
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                return $this->json([
                    'message' => 'Format d\'email invalide'
                ], Response::HTTP_BAD_REQUEST);
            }
    
            // Vérifier si l'utilisateur existe déjà
            $existingUser = $entityManager->getRepository(User::class)
                ->findOneBy(['email' => $data['email']]);
            
            if ($existingUser) {
                $logger->warning('Tentative d\'inscription avec un email existant : ' . $data['email']);
                return $this->json([
                    'message' => 'Un compte existe déjà avec cet email'
                ], Response::HTTP_CONFLICT);
            }
    
            // Créer le nouvel utilisateur
            $user = new User();
            $user->setEmail($data['email']);
            $user->setName($data['name']);
            
            // Hacher le mot de passe
            $hashedPassword = $passwordHasher->hashPassword(
                $user, 
                $data['password']
            );
            $user->setPassword($hashedPassword);
    
            // Sauvegarder l'utilisateur
            $entityManager->persist($user);
            $entityManager->flush();
    
            $logger->info('Utilisateur créé : ' . $data['email']);
    
            return $this->json([
                'message' => 'Utilisateur créé avec succès',
                'user' => [
                    'email' => $user->getEmail(),
                    'name' => $user->getName()
                ]
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            $logger->error('Erreur lors de l\'inscription : ' . $e->getMessage());
            return $this->json([
                'message' => 'Erreur serveur lors de la création du compte',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function customLogin(
        Request $request, 
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface $jwtManager,
        LoggerInterface $logger
    ): JsonResponse {
        try {
            // Récupérer les données de la requête
            $data = json_decode($request->getContent(), true);
            
            // Log des données reçues pour débogage
            $logger->info('Données de connexion reçues', $data ?? []);
    
            // Validation des données
            if (!isset($data['username']) || !isset($data['password'])) {
                $logger->warning('Données de connexion incomplètes');
                return $this->json([
                    'message' => 'Email et mot de passe requis'
                ], Response::HTTP_BAD_REQUEST);
            }
    
            // Rechercher l'utilisateur
            $user = $entityManager->getRepository(User::class)
                ->findOneBy(['email' => $data['username']]);
    
            // Vérifier si l'utilisateur existe
            if (!$user) {
                $logger->warning('Utilisateur non trouvé', ['email' => $data['username']]);
                return $this->json([
                    'message' => 'Utilisateur non trouvé'
                ], Response::HTTP_UNAUTHORIZED);
            }
    
            // Vérifier le mot de passe
            if (!$passwordHasher->isPasswordValid($user, $data['password'])) {
                $logger->warning('Mot de passe incorrect', ['email' => $data['username']]);
                return $this->json([
                    'message' => 'Mot de passe incorrect'
                ], Response::HTTP_UNAUTHORIZED);
            }
    
            // Générer le token JWT
            $token = $jwtManager->create($user);
    
            // Journalisation de la connexion
            $logger->info('Connexion réussie', ['email' => $user->getEmail()]);
    
            // Retourner les informations de l'utilisateur et le token
            return $this->json([
                'token' => $token,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'name' => $user->getName()
                ]
            ]);
    
        } catch (\Exception $e) {
            // Journalisation de l'erreur
            $logger->error('Erreur de connexion', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
    
            return $this->json([
                'message' => 'Erreur serveur lors de la connexion',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

}