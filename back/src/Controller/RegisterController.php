<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Routing\Attribute\Route;

class RegisterController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $em,
        UserRepository $userRepository,
        RateLimiterFactory $apiRegistrationLimiter
    ): JsonResponse {
        $limiter = $apiRegistrationLimiter->create($request->getClientIp());
        if (!$limiter->consume(1)->isAccepted()) {
            return $this->json(['error' => 'Too many registration attempts'], 429);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'], $data['password'], $data['firstName'], $data['lastName'])) {
            return $this->json(['error' => 'Missing fields'], 400);
        }

        if (strlen($data['email']) > 180 || strlen($data['firstName']) > 100 || strlen($data['lastName']) > 100) {
            return $this->json(['error' => 'Field too long'], 400);
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return $this->json(['error' => 'Invalid email format'], 400);
        }

        if (strlen($data['password']) < 8 || !preg_match('/[A-Z]/', $data['password']) || !preg_match('/[0-9]/', $data['password'])) {
            return $this->json(['error' => 'Password must be at least 8 characters, include one uppercase letter and one digit'], 400);
        }

        if ($userRepository->findOneBy(['email' => $data['email']])) {
            return $this->json(['error' => 'Email already in use'], 409);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setFirstName($data['firstName']);
        $user->setLastName($data['lastName']);
        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setRoles(['ROLE_USER']);

        $hashed = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashed);

        $em->persist($user);
        $em->flush();

        return $this->json([
            'message' => 'User created successfully',
            'email' => $user->getEmail()
        ], 201);
    }
}