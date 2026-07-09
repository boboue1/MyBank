<?php

namespace App\Controller;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class CategoryController extends AbstractController
{
    #[Route('/api/categories', name: 'api_categories_list', methods: ['GET'])]
    public function list(CategoryRepository $repo): JsonResponse
    {
        $categories = $repo->findBy(['user' => $this->getUser()]);

        return $this->json(array_map(fn($c) => [
            'id'    => $c->getId(),
            'title' => $c->getTitle(),
        ], $categories));
    }

    #[Route('/api/categories', name: 'api_categories_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['title'])) {
            return $this->json(['error' => 'Title is required'], 400);
        }

        $category = new Category();
        $category->setTitle($data['title']);
        $category->setUser($this->getUser());

        $em->persist($category);
        $em->flush();

        return $this->json([
            'id'    => $category->getId(),
            'title' => $category->getTitle(),
        ], 201);
    }

    #[Route('/api/categories/{id}', name: 'api_categories_update', methods: ['PUT'])]
    public function update(Category $category, Request $request, EntityManagerInterface $em): JsonResponse
    {
        if ($category->getUser() !== $this->getUser()) {
            return $this->json(['error' => 'Access denied'], 403);
        }

        $data = json_decode($request->getContent(), true);

        if (empty($data['title'])) {
            return $this->json(['error' => 'Title is required'], 400);
        }

        $category->setTitle($data['title']);
        $em->flush();

        return $this->json([
            'id'    => $category->getId(),
            'title' => $category->getTitle(),
        ]);
    }

    #[Route('/api/categories/{id}', name: 'api_categories_delete', methods: ['DELETE'])]
    public function delete(Category $category, EntityManagerInterface $em): JsonResponse
    {
        if ($category->getUser() !== $this->getUser()) {
            return $this->json(['error' => 'Access denied'], 403);
        }

        $em->remove($category);
        $em->flush();

        return $this->json(null, 204);
    }
}
