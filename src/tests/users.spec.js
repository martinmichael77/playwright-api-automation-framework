import { test, expect } from '@playwright/test';
import APIClient from '../clients/APIClient.js';
import logger from '../utils/logger.js';
import { validateSchema, assertStatus, assertResponseHasFields } from '../utils/assertions.js';
import { userArraySchema, userSchema } from '../schemas/user.schema.js';

test.describe('@regression User API Tests', () => {
  let apiClient;

  test.beforeAll(async () => {
    apiClient = new APIClient();
    logger.info('Test suite started: User API Tests');
  });

  test('@smoke GET /users - Retrieve all users', async () => {
    // Act
    const response = await apiClient.get('/users');

    // Assert
    assertStatus(response, 200);
    validateSchema(response.data, userArraySchema, 'User Array Schema');
    expect(response.data.length).toBeGreaterThan(0);
    logger.info('✓ Retrieved all users successfully');
  });

  test('@regression GET /users/:id - Retrieve specific user', async () => {
    // Arrange
    const userId = 1;

    // Act
    const response = await apiClient.get(`/users/${userId}`);

    // Assert
    assertStatus(response, 200);
    validateSchema(response.data, userSchema, 'User Schema');
    assertResponseHasFields(response, ['id', 'name', 'email', 'phone']);
    expect(response.data.id).toBe(userId);
    logger.info(`✓ Retrieved user ${userId} successfully`);
  });

  test('@regression GET /users/:id - Verify user data structure', async () => {
    // Arrange
    const userId = 2;

    // Act
    const response = await apiClient.get(`/users/${userId}`);

    // Assert
    assertStatus(response, 200);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('name');
    expect(response.data).toHaveProperty('email');
    expect(response.data).toHaveProperty('phone');
    expect(response.data).toHaveProperty('website');
    expect(response.data).toHaveProperty('company');
    logger.info('✓ User data structure verified');
  });

  test('@smoke GET /users - Response time check', async () => {
    // Act & timing
    const startTime = Date.now();
    const response = await apiClient.get('/users');
    const responseTime = Date.now() - startTime;

    // Assert
    assertStatus(response, 200);
    expect(responseTime).toBeLessThan(5000); // 5 second threshold
    logger.info(`✓ Response time: ${responseTime}ms (under 5s threshold)`);
  });
});
