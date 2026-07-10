<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\Cookie;

#[AsEventListener(event: 'lexik_jwt_authentication.on_authentication_success')]
class AuthenticationSuccessListener
{
    public function __invoke(AuthenticationSuccessEvent $event): void
    {
        $data  = $event->getData();
        $token = $data['token'] ?? null;

        if (!$token) {
            return;
        }

        $event->getResponse()->headers->setCookie(
            Cookie::create('BEARER')
                ->withValue($token)
                ->withExpires(time() + 3600)
                ->withPath('/')
                ->withSecure(false)
                ->withHttpOnly(true)
                ->withSameSite('strict')
        );

        unset($data['token']);
        $event->setData($data);
    }
}
