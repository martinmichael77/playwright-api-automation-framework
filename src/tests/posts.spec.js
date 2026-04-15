import { test, expect } from '@playwright/test';
import APIClient from '../clients/APIClient.js';
import logger from '../utils/logger.js';
import { validateSchema, assertStatus, assertResponseHasFields } from '../utils/assertions.js';
import { generatePostData, randomNumber } from '../utils/dataGenerator.js';
import { postSchema, postArraySchema, postCreateSchema } from '../schemas/post.schema.js';

test.describe('@regression Post API Tests', () => {
  let apiClient;

  test.beforeAll(async () => {
    apiClient = new APIClient();
    logger.info('Test suite started: Post API Tests');
  });

  test('@smoke GET /posts - Retrieve all posts', async () => {
    // Act
    const response = await apiClient.get('/posts');

    // Assert
    assertStatus(response, 200);
    validateSchema(response.data, postArraySchema, 'Post Array Schema');
    expect(response.data.length).toBeGreaterThan(0);
    logger.info('✓ Retrieved all posts successfully');
  });

  test('@regression GET /posts/:id - Retrieve specific post', async () => {
    // Arrange
    const postId = 1;

    // Act
    const response = await apiClient.get(`/posts/${postId}`);

    // Assert
    assertStatus(response, 200);
    validateSchema(response.data, postSchema, 'Post Schema');
    expect(response.data.id).toBe(postId);
    assertResponseHasFields(response, ['id', 'title', 'body', 'userId']);
    logger.info(`✓ Retrieved post ${postId} successfully`);
  });

  test('@regression GET /posts - Filter posts by userId', async () => {
    // Arrange
    const userId = 1;

    // Act
    const response = await apiClient.get('/posts', { params: { userId } });

    // Assert
    assertStatus(response, 200);
    validateSchema(response.data, postArraySchema, 'Post Array Schema');
    expect(response.data.every((post) => post.userId === userId)).toBe(true);
    logger.info(`✓ Retrieved posts filtered by userId ${userId}`);
  });

  test('@smoke POST /posts - Create new post', async () => {
    // Arrange
    const postData = generatePostData(1);

    // Act
    const response = await apiClient.post('/posts', postData);

    // Assert
    assertStatus(response, 201);
    validateSchema(response.data, postCreateSchema, 'Post Create Schema');
    expect(response.data.title).toBe(postData.title);
    expect(response.data.body).toBe(postData.body);
    expect(response.data.userId).toBe(postData.userId);
    logger.info('✓ Post created successfully');
  });

  test('@regression POST /posts - Create post with random user', async () => {
    // Arrange
    const userId = randomNumber(1, 10);
    const postData = generatePostData(userId);

    // Act
    const response = await apiClient.post('/posts', postData);

    // Assert
    assertStatus(response, 201);
    expect(response.data.userId).toBe(userId);
    logger.info(`✓ Post created with userId ${userId}`);
  });

  test('@smoke POST /posts - Verify required fields', async () => {
    // Arrange
    const postData = generatePostData(1);

    // Act
    const response = await apiClient.post('/posts', postData);

    // Assert
    assertStatus(response, 201);
    assertResponseHasFields(response, ['id', 'title', 'body', 'userId']);
    expect(response.data.id).toBeDefined();
    logger.info('✓ Post created with all required fields');
  });
});
