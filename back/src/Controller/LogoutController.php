<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class LogoutController extends AbstractController
{
    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        $response = $this->json(null, 204);
        $response->headers->setCookie(
            Cookie::create('BEARER')
                ->withValue('')
                ->withExpires(1)
                ->withPath('/')
                ->withHttpOnly(true)
                ->withSameSite('strict')
        );

        return $response;
    }
}
