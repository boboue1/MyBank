<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\Cookie;

#[AsEventListener(event: 'lexik_jwt_authentication.on_authentication_success')]
class AuthenticationSuccessListener
{
    public function __construct(
        #[Autowire('%kernel.environment%')] private string $appEnv
    ) {}

    public function __invoke(AuthenticationSuccessEvent $event): void
    {
        $data  = $event->getData();
        $token = $data['token'] ?? null;

        if (!$token) {
            return;
        }

        $isProd = $this->appEnv === 'prod';

        $event->getResponse()->headers->setCookie(
            Cookie::create('BEARER')
                ->withValue($token)
                ->withExpires(time() + 3600)
                ->withPath('/')
                ->withSecure($isProd)
                ->withHttpOnly(true)
                ->withSameSite($isProd ? 'none' : 'strict')
        );

        unset($data['token']);
        $event->setData($data);
    }
}
