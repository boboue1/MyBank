<?php

namespace App\Tests;

class CategoryTest extends ApiTestCase
{
    public function testCreateCategory(): void
    {
        $this->register('alice@test.com');
        $token = $this->login('alice@test.com');

        $response = $this->request('POST', '/api/categories', ['title' => 'Food'], $token);

        $this->assertSame(201, $response->getStatusCode());
        $this->assertSame('Food', $this->json($response)['title']);
    }

    public function testListReturnsOnlyOwnCategories(): void
    {
        $this->register('alice@test.com');
        $this->register('bob@test.com');

        $tokenA = $this->login('alice@test.com');
        $tokenB = $this->login('bob@test.com');

        $this->request('POST', '/api/categories', ['title' => 'Alice Cat'], $tokenA);
        $this->request('POST', '/api/categories', ['title' => 'Bob Cat'], $tokenB);

        $response = $this->request('GET', '/api/categories', [], $tokenA);
        $data = $this->json($response);

        $this->assertSame(200, $response->getStatusCode());
        $this->assertCount(1, $data);
        $this->assertSame('Alice Cat', $data[0]['title']);
    }

    public function testDeleteOtherUserCategoryReturns403(): void
    {
        $this->register('alice@test.com');
        $this->register('bob@test.com');

        $tokenA = $this->login('alice@test.com');
        $tokenB = $this->login('bob@test.com');

        $catResponse = $this->request('POST', '/api/categories', ['title' => 'Alice Cat'], $tokenA);
        $catId = $this->json($catResponse)['id'];

        $response = $this->request('DELETE', '/api/categories/' . $catId, [], $tokenB);

        $this->assertSame(403, $response->getStatusCode());
    }

    public function testUpdateOtherUserCategoryReturns403(): void
    {
        $this->register('alice@test.com');
        $this->register('bob@test.com');

        $tokenA = $this->login('alice@test.com');
        $tokenB = $this->login('bob@test.com');

        $catResponse = $this->request('POST', '/api/categories', ['title' => 'Alice Cat'], $tokenA);
        $catId = $this->json($catResponse)['id'];

        $response = $this->request('PUT', '/api/categories/' . $catId, ['title' => 'Hacked'], $tokenB);

        $this->assertSame(403, $response->getStatusCode());
    }

    public function testUnauthenticatedAccessReturns401(): void
    {
        $response = $this->request('GET', '/api/categories');

        $this->assertSame(401, $response->getStatusCode());
    }

    public function testEmptyTitleReturns400(): void
    {
        $this->register('alice@test.com');
        $token = $this->login('alice@test.com');

        $response = $this->request('POST', '/api/categories', ['title' => ''], $token);

        $this->assertSame(400, $response->getStatusCode());
    }
}
