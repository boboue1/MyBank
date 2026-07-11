<?php

namespace App;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    public function getCacheDir(): string
    {
        // En production sur Railway, on utilise /tmp qui autorise l'écriture
        if ($this->getEnvironment() === 'prod') {
            return '/tmp/symfony/cache/' . $this->getEnvironment();
        }

        return parent::getCacheDir();
    }

    public function getLogDir(): string
    {
        // On fait de même pour les logs en production
        if ($this->getEnvironment() === 'prod') {
            return '/tmp/symfony/log';
        }

        return parent::getLogDir();
    }
}