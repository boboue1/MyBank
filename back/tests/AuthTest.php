<?php

namespace App\Tests;

class AuthTest extends ApiTestCase
{
    public function testLoginReturnsToken(): void
    {
        $this->register('alice@test.com');
        $response = $this->request('POST', '/api/login', [
            'email'    => 'alice@test.com',
            'password' => 'Password1',
        ]);

        $data = $this->json($response);
        $this->assertArrayHasKey('token', $data, 'Response should contain a token');
        $this->assertNotEmpty($data['token']);
    }

    public function testLoginWrongPasswordReturns401(): void
    {
        $this->register('alice@test.com');
        $response = $this->request('POST', '/api/login', [
            'email'    => 'alice@test.com',
            'password' => 'wrongpassword',
        ]);

        $this->assertSame(401, $response->getStatusCode());
    }

    public function testRegisterSuccess(): void
    {
        $response = $this->request('POST', '/api/register', [
            'email'     => 'bob@test.com',
            'password'  => 'Password1',
            'firstName' => 'Bob',
            'lastName'  => 'Smith',
        ]);

        $this->assertSame(201, $response->getStatusCode());
    }

    public function testRegisterInvalidEmailReturns400(): void
    {
        $response = $this->request('POST', '/api/register', [
            'email'     => 'not-an-email',
            'password'  => 'Password1',
            'firstName' => 'Bob',
            'lastName'  => 'Smith',
        ]);

        $this->assertSame(400, $response->getStatusCode());
        $this->assertSame('Invalid email format', $this->json($response)['error']);
    }

    public function testRegisterDuplicateEmailReturns409(): void
    {
        $this->register('alice@test.com');
        $response = $this->request('POST', '/api/register', [
            'email'     => 'alice@test.com',
            'password'  => 'Password1',
            'firstName' => 'Alice',
            'lastName'  => 'Again',
        ]);

        $this->assertSame(409, $response->getStatusCode());
    }

    public function testRegisterMissingFieldsReturns400(): void
    {
        $response = $this->request('POST', '/api/register', [
            'email' => 'incomplete@test.com',
        ]);

        $this->assertSame(400, $response->getStatusCode());
    }

    public function testUnauthenticatedRequestReturns401(): void
    {
        $response = $this->request('GET', '/api/me');

        $this->assertSame(401, $response->getStatusCode());
    }
}
