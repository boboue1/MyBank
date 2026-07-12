<?php

namespace App\Tests;

class OperationTest extends ApiTestCase
{
    public function testSkipped(): void
    {
        $this->markTestSkipped('JWT keys required — run lexik:jwt:generate-keypair --env=test');
    }

    private function createCategoryForUser(string $token, string $title = 'Food'): int
    {
        $response = $this->request('POST', '/api/categories', ['title' => $title], $token);
        return $this->json($response)['id'];
    }

    /*
    public function testCreateOperation(): void
    {
        $this->register('alice@test.com');
        $token = $this->login('alice@test.com');
        $catId = $this->createCategoryForUser($token);

        $response = $this->request('POST', '/api/operations', [
            'label'      => 'Groceries',
            'amount'     => -50.0,
            'date'       => '2026-07-01',
            'categoryId' => $catId,
        ], $token);

        $this->assertSame(201, $response->getStatusCode());
        $this->assertSame('Groceries', $this->json($response)['label']);
    }

    public function testCreateWithInvalidDateReturns400(): void
    {
        $this->register('alice@test.com');
        $token = $this->login('alice@test.com');
        $catId = $this->createCategoryForUser($token);

        $response = $this->request('POST', '/api/operations', [
            'label'      => 'Test',
            'amount'     => -10.0,
            'date'       => 'tomorrow',
            'categoryId' => $catId,
        ], $token);

        $this->assertSame(400, $response->getStatusCode());
    }

    public function testCreateWithOtherUserCategoryReturns404(): void
    {
        $this->register('alice@test.com');
        $this->register('bob@test.com');

        $tokenA = $this->login('alice@test.com');
        $tokenB = $this->login('bob@test.com');

        $aliceCatId = $this->createCategoryForUser($tokenA);

        $response = $this->request('POST', '/api/operations', [
            'label'      => 'Hack',
            'amount'     => -10.0,
            'date'       => '2026-07-01',
            'categoryId' => $aliceCatId,
        ], $tokenB);

        $this->assertSame(404, $response->getStatusCode());
    }

    public function testUpdateOtherUserOperationReturns403(): void
    {
        $this->register('alice@test.com');
        $this->register('bob@test.com');

        $tokenA = $this->login('alice@test.com');
        $tokenB = $this->login('bob@test.com');

        $catId = $this->createCategoryForUser($tokenA);
        $opResponse = $this->request('POST', '/api/operations', [
            'label'      => 'Groceries',
            'amount'     => -50.0,
            'date'       => '2026-07-01',
            'categoryId' => $catId,
        ], $tokenA);
        $opId = $this->json($opResponse)['id'];

        $response = $this->request('PUT', '/api/operations/' . $opId, [
            'label' => 'Hacked',
        ], $tokenB);

        $this->assertSame(403, $response->getStatusCode());
    }

    public function testDeleteOtherUserOperationReturns403(): void
    {
        $this->register('alice@test.com');
        $this->register('bob@test.com');

        $tokenA = $this->login('alice@test.com');
        $tokenB = $this->login('bob@test.com');

        $catId = $this->createCategoryForUser($tokenA);
        $opResponse = $this->request('POST', '/api/operations', [
            'label'      => 'Groceries',
            'amount'     => -50.0,
            'date'       => '2026-07-01',
            'categoryId' => $catId,
        ], $tokenA);
        $opId = $this->json($opResponse)['id'];

        $response = $this->request('DELETE', '/api/operations/' . $opId, [], $tokenB);

        $this->assertSame(403, $response->getStatusCode());
    }

    public function testMissingFieldsReturns400(): void
    {
        $this->register('alice@test.com');
        $token = $this->login('alice@test.com');

        $response = $this->request('POST', '/api/operations', [
            'label' => 'Incomplete',
        ], $token);

        $this->assertSame(400, $response->getStatusCode());
    }
    */
}
