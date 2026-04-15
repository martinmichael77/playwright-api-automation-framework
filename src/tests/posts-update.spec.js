import { test, expect } from '@playwright/test';
import APIClient from '../clients/APIClient.js';
import logger from '../utils/logger.js';
import { validateSchema, assertStatus, assertResponseHasFields } from '../utils/assertions.js';
import { postSchema } from '../schemas/post.schema.js';

test.describe('@regression Post Update API Tests', () => {
  let apiClient;
  const postId = 1;

  test.beforeAll(async () => {
    apiClient = new APIClient();
    logger.info('Test suite started: Post Update API Tests');
  });

  test('@smoke PUT /posts/:id - Update existing post', async () => {
    // Arrange
    const updateData = {
      id: postId,
      title: 'Updated Post Title',
      body: 'This is the updated post body',
      userId: 1,
    };

    // Act
    const response = await apiClient.put(`/posts/${postId}`, updateData);

    // Assert
    assertStatus(response, 200);
    validateSchema(response.data, postSchema, 'Post Schema');
    expect(response.data.title).toBe(updateData.title);
    expect(response.data.body).toBe(updateData.body);
    logger.info(`✓ Post ${postId} updated successfully`);
  });

  test('@regression PUT /posts/:id - Partial update', async () => {
    // Arrange
    const updateData = {
      title: 'Partially Updated Title',
      body: 'Partially updated body',
      userId: 1,
    };

    // Act
    const response = await apiClient.put(`/posts/${postId}`, updateData);

    // Assert
    assertStatus(response, 200);
    expect(response.data.title).toBe(updateData.title);
    logger.info(`✓ Post ${postId} partially updated`);
  });

  test('@regression PUT /posts/:id - Verify all fields preserved', async () => {
    // Arrange
    const updateData = {
      title: 'New Title',
      body: 'New Body Content',
      userId: 1,
    };

    // Act
    const response = await apiClient.put(`/posts/${postId}`, updateData);

    // Assert
    assertStatus(response, 200);
    assertResponseHasFields(response, ['id', 'title', 'body', 'userId']);
    expect(response.data.id).toBe(postId);
    logger.info('✓ All fields preserved after update');
  });

  test('@smoke PATCH /posts/:id - Patch post (partial update)', async () => {
    // Arrange
    const patchData = {
      title: 'Patched Title Only',
    };

    // Act
    const response = await apiClient.patch(`/posts/${postId}`, patchData);

    // Assert
    assertStatus(response, 200);
    expect(response.data.title).toBe(patchData.title);
    logger.info(`✓ Post ${postId} patched successfully`);
  });
});
