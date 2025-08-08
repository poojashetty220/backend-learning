const { test, expect } = require('@playwright/test');
const { handler } = require('../handlers/create');
const Category = require('../entities/Categories');

test.describe('Create Category API', () => {
  const randomAlias = Math.floor(Math.random() * 100000);
  
  test('Admin should create category successfully when valid data is provided', async () => {
    const validCategoryData = {
      name: `Electronics ${randomAlias}`
    };

    const event = {
      body: JSON.stringify(validCategoryData)
    };

    const response = await handler(event);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(201);
    expect(body.name).toBe(validCategoryData.name);
    expect(body._id).toBeDefined();
    expect(body.created_at).toBeDefined();
  });

  test('System should return 400 when invalid JSON is provided', async () => {
    const event = {
      body: '{}'
    };

    const response = await handler(event);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(body.message).toBeDefined();
  });

  test('System should return validation error when name is missing', async () => {
    const invalidCategoryData = {};

    const event = {
      body: JSON.stringify(invalidCategoryData)
    };

    const response = await handler(event);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(body.message).toContain('Name is required');
  });

  test('System should handle empty request body gracefully', async () => {
    const event = {
      body: ''
    };

    const response = await handler(event);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(body.message).toBeDefined();
  });

  test('System should handle invalid request body format', async () => {
    const event = {
      body: "invalid"
    };

    const response = await handler(event);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(body.message).toBeDefined();
  });

  test('Admin should not create duplicate category when name already exists', async () => {
    const categoryData = {
      name: `Duplicate${randomAlias}`
    };

    const event = {
      body: JSON.stringify(categoryData)
    };

    // Create first category
    await handler(event);
    
    // Try to create duplicate
    const response = await handler(event);
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(409);
    expect(body.message).toBe('Category with this name already exists');
  });
});