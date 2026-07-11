<?php

namespace App\EventListener;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

#[AsEventListener(event: KernelEvents::RESPONSE, priority: 9999)]
class CorsResponseListener
{
    public function __construct(
        #[Autowire('%env(CORS_ALLOW_ORIGIN)%')] private string $corsAllowOrigin
    ) {}

    public function __invoke(ResponseEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $origin = $request->headers->get('Origin');

        if (!$origin) {
            return;
        }

        $response = $event->getResponse();

        if ($response->headers->has('Access-Control-Allow-Origin')) {
            return;
        }

        if ($origin === $this->corsAllowOrigin) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        }
    }
}
