<?php

namespace App\Controller;

use App\Entity\Operation;
use App\Repository\CategoryRepository;
use App\Repository\OperationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class OperationController extends AbstractController
{
    #[Route('/api/operations', name: 'api_operations_list', methods: ['GET'])]
    public function list(OperationRepository $repo): JsonResponse
    {
        $operations = $repo->findBy(['user' => $this->getUser()]);

        return $this->json(array_map(fn($o) => $this->serialize($o), $operations));
    }

    #[Route('/api/operations', name: 'api_operations_create', methods: ['POST'])]
    public function create(
        Request $request,
        CategoryRepository $categoryRepo,
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['label'], $data['amount'], $data['date'], $data['categoryId'])) {
            return $this->json(['error' => 'Missing fields'], 400);
        }

        if (strlen((string) $data['label']) > 255) {
            return $this->json(['error' => 'Label too long'], 400);
        }

        if (!is_numeric($data['amount']) || (float) $data['amount'] === 0.0 || abs((float) $data['amount']) > 1_000_000) {
            return $this->json(['error' => 'Invalid amount'], 400);
        }

        $date = \DateTime::createFromFormat('Y-m-d', $data['date']);
        if (!$date || $date->format('Y-m-d') !== $data['date']) {
            return $this->json(['error' => 'Invalid date format, expected Y-m-d'], 400);
        }

        $category = $categoryRepo->findOneBy(['id' => $data['categoryId'], 'user' => $this->getUser()]);
        if (!$category) {
            return $this->json(['error' => 'Category not found'], 404);
        }

        $operation = new Operation();
        $operation->setLabel($data['label']);
        $operation->setAmount((float) $data['amount']);
        $operation->setDate($date);
        $operation->setUser($this->getUser());
        $operation->setCategory($category);

        $em->persist($operation);
        $em->flush();

        return $this->json($this->serialize($operation), 201);
    }

    #[Route('/api/operations/{id}', name: 'api_operations_update', methods: ['PUT'])]
    public function update(
        Operation $operation,
        Request $request,
        CategoryRepository $categoryRepo,
        EntityManagerInterface $em
    ): JsonResponse {
        if ($operation->getUser() !== $this->getUser()) {
            return $this->json(['error' => 'Access denied'], 403);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['label'])) {
            if (strlen((string) $data['label']) > 255) {
                return $this->json(['error' => 'Label too long'], 400);
            }
            $operation->setLabel($data['label']);
        }
        if (isset($data['amount'])) {
            if (!is_numeric($data['amount']) || (float) $data['amount'] === 0.0 || abs((float) $data['amount']) > 1_000_000) {
                return $this->json(['error' => 'Invalid amount'], 400);
            }
            $operation->setAmount((float) $data['amount']);
        }
        if (isset($data['date'])) {
            $date = \DateTime::createFromFormat('Y-m-d', $data['date']);
            if (!$date || $date->format('Y-m-d') !== $data['date']) {
                return $this->json(['error' => 'Invalid date format, expected Y-m-d'], 400);
            }
            $operation->setDate($date);
        }
        if (isset($data['categoryId'])) {
            $category = $categoryRepo->findOneBy(['id' => $data['categoryId'], 'user' => $this->getUser()]);
            if (!$category) {
                return $this->json(['error' => 'Category not found'], 404);
            }
            $operation->setCategory($category);
        }

        $em->flush();

        return $this->json($this->serialize($operation));
    }

    #[Route('/api/operations/{id}', name: 'api_operations_delete', methods: ['DELETE'])]
    public function delete(
        Operation $operation,
        EntityManagerInterface $em
    ): JsonResponse {
        if ($operation->getUser() !== $this->getUser()) {
            return $this->json(['error' => 'Access denied'], 403);
        }

        $em->remove($operation);
        $em->flush();

        return $this->json(null, 204);
    }

    private function serialize(Operation $o): array
    {
        return [
            'id'       => $o->getId(),
            'label'    => $o->getLabel(),
            'amount'   => $o->getAmount(),
            'date'     => $o->getDate()->format('Y-m-d'),
            'category' => [
                'id'    => $o->getCategory()->getId(),
                'title' => $o->getCategory()->getTitle(),
            ],
        ];
    }
}
