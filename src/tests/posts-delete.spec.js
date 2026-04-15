import { test, expect } from '@playwright/test';
import APIClient from '../clients/APIClient.js';
import logger from '../utils/logger.js';
import { assertStatus } from '../utils/assertions.js';

test.describe('@regression Post Delete API Tests', () => {
  let apiClient;

  test.beforeAll(async () => {
    apiClient = new APIClient();
    logger.info('Test suite started: Post Delete API Tests');
  });

  test('@smoke DELETE /posts/:id - Delete existing post', async () => {
    // Arrange
    const postId = 1;

    // Act
    const response = await apiClient.delete(`/posts/${postId}`);

    // Assert
    assertStatus(response, 200);
    // Most APIs return the deleted object or empty object
    expect(response.data).toBeDefined();
    logger.info(`✓ Post ${postId} deleted successfully`);
  });

  test('@regression DELETE /posts/:id - Delete post with various IDs', async () => {
    // Test deletion with multiple post IDs
    const postIds = [2, 3, 4];

    for (const postId of postIds) {
      // Act
      const response = await apiClient.delete(`/posts/${postId}`);

      // Assert
      assertStatus(response, 200);
      logger.info(`✓ Post ${postId} deleted`);
    }

    logger.info('✓ All posts deleted successfully');
  });

  test('@smoke DELETE /posts/:id - Verify delete response', async () => {
    // Arrange
    const postId = 5;

    // Act
    const response = await apiClient.delete(`/posts/${postId}`);

    // Assert
    assertStatus(response, 200);
    expect(response.status).toBe(200);
    logger.info(`✓ Delete response verified for post ${postId}`);
  });

  test('@regression DELETE /posts/:id - Delete non-existent post', async () => {
    // Arrange
    const nonExistentPostId = 99999;

    // Act & Assert - JSONPlaceholder returns 200 even for non-existent resources
    const response = await apiClient.delete(`/posts/${nonExistentPostId}`);
    assertStatus(response, 200);
    logger.info('✓ Delete non-existent post handled gracefully');
  });
});
