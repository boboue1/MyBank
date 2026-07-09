<?php

namespace App\Tests;

use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

abstract class ApiTestCase extends WebTestCase
{
    protected KernelBrowser $client;

    protected function setUp(): void
    {
        parent::setUp();
        $this->client = static::createClient();

        $em = static::getContainer()->get('doctrine')->getManager();
        $schemaTool = new SchemaTool($em);
        $metadata = $em->getMetadataFactory()->getAllMetadata();
        $schemaTool->dropSchema($metadata);
        $schemaTool->createSchema($metadata);
    }

    protected function register(string $email, string $password = 'Password1'): void
    {
        $this->request('POST', '/api/register', [
            'email'     => $email,
            'password'  => $password,
            'firstName' => 'Test',
            'lastName'  => 'User',
        ]);
    }

    protected function login(string $email, string $password = 'Password1'): string
    {
        $response = $this->request('POST', '/api/login', [
            'email'    => $email,
            'password' => $password,
        ]);

        return json_decode($response->getContent(), true)['token'];
    }

    protected function request(
        string $method,
        string $uri,
        array $data = [],
        string $token = null
    ): Response {
        $headers = ['CONTENT_TYPE' => 'application/json', 'HTTP_ACCEPT' => 'application/json'];

        if ($token) {
            $headers['HTTP_AUTHORIZATION'] = 'Bearer ' . $token;
        }

        $this->client->request($method, $uri, [], [], $headers, $data ? json_encode($data) : null);

        return $this->client->getResponse();
    }

    protected function json(Response $response): array
    {
        return json_decode($response->getContent(), true) ?? [];
    }
}
