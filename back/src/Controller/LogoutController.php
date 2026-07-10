<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class LogoutController extends AbstractController
{
    public function __construct(
        #[Autowire('%kernel.environment%')] private string $appEnv
    ) {}

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        $isProd = $this->appEnv === 'prod';

        $response = $this->json(null, 204);
        $response->headers->setCookie(
            Cookie::create('BEARER')
                ->withValue('')
                ->withExpires(1)
                ->withPath('/')
                ->withHttpOnly(true)
                ->withSameSite($isProd ? 'none' : 'strict')
                ->withSecure($isProd)
        );

        return $response;
    }
}
