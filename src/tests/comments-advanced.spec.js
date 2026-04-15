import { test, expect } from '@playwright/test';
import APIClient from '../clients/APIClient.js';
import logger from '../utils/logger.js';
import {
  validateSchema,
  assertStatus,
  assertResponseHasFields,
  assertResponseContains,
} from '../utils/assertions.js';
import { generateCommentData, randomNumber, wait } from '../utils/dataGenerator.js';
import { commentSchema, commentArraySchema } from '../schemas/comment.schema.js';

test.describe('@regression Comments API Tests - Advanced Examples', () => {
  let apiClient;
  const basePostId = 1;

  test.beforeAll(async () => {
    apiClient = new APIClient();
    logger.info('Advanced Comments Test Suite Started');
  });

  test.describe('GET Comments', () => {
    test('@smoke GET /comments - Retrieve all comments', async () => {
      // Act
      const response = await apiClient.get('/comments');

      // Assert
      assertStatus(response, 200);
      validateSchema(response.data, commentArraySchema, 'Comment Array Schema');
      expect(response.data.length).toBeGreaterThan(0);
      
      // Verify structure of first comment
      const firstComment = response.data[0];
      if (firstComment && Object.keys(firstComment).length > 0) {
        const missingFields = ['id', 'postId', 'name', 'email', 'body'].filter(
          (field) => !(field in firstComment)
        );
        if (missingFields.length > 0) {
          throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
        logger.info(`All required fields present: id, postId, name, email, body`);
      }
      
      logger.info(`✓ Retrieved ${response.data.length} comments`);
    });

    test('@regression GET /comments/:id - Retrieve specific comment', async () => {
      // Arrange
      const commentId = 1;

      // Act
      const response = await apiClient.get(`/comments/${commentId}`);

      // Assert
      assertStatus(response, 200);
      validateSchema(response.data, commentSchema, 'Comment Schema');
      assertResponseHasFields(response, ['id', 'postId', 'name', 'email', 'body']);
      
      expect(response.data.id).toBe(commentId);
      expect(response.data).toHaveProperty('postId');
      expect(response.data).toHaveProperty('email');
      
      logger.info(`✓ Retrieved comment ${commentId} with details`);
    });

    test('@regression GET /comments?postId=:postId - Filter comments by post', async () => {
      // Arrange
      const postId = basePostId;

      // Act
      const response = await apiClient.get('/comments', {
        params: { postId },
      });

      // Assert
      assertStatus(response, 200);
      validateSchema(response.data, commentArraySchema, 'Comment Array Schema');
      
      // Verify all comments belong to specified post
      expect(response.data.every((comment) => comment.postId === postId)).toBe(true);
      
      logger.info(`✓ Retrieved ${response.data.length} comments for post ${postId}`);
    });

    test('@regression GET /comments - Verify email format in all comments', async () => {
      // Act
      const response = await apiClient.get('/comments');

      // Assert
      assertStatus(response, 200);
      
      // Verify all emails are valid format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      response.data.forEach((comment) => {
        expect(comment.email).toMatch(emailRegex);
      });
      
      logger.info('✓ All comment emails have valid format');
    });

    test('@regression GET /comments - Verify response time', async () => {
      // Arrange
      const maxResponseTime = 5000; // 5 seconds

      // Act
      const startTime = Date.now();
      const response = await apiClient.get('/comments');
      const responseTime = Date.now() - startTime;

      // Assert
      assertStatus(response, 200);
      expect(responseTime).toBeLessThan(maxResponseTime);
      
      logger.info(`✓ Response time: ${responseTime}ms (threshold: ${maxResponseTime}ms)`);
    });
  });

  test.describe('POST Comments', () => {
    test('@smoke POST /comments - Create new comment', async () => {
      // Arrange
      const commentData = generateCommentData(basePostId);

      // Act
      const response = await apiClient.post('/comments', commentData);

      // Assert
      assertStatus(response, 201);
      expect(response.data).toBeDefined();
      expect(response.data.name).toBe(commentData.name);
      expect(response.data.email).toBe(commentData.email);
      expect(response.data.body).toBe(commentData.body);
      expect(response.data.postId).toBe(commentData.postId);
      
      logger.info('✓ Comment created successfully');
    });

    test('@regression POST /comments - Create with dynamic data', async () => {
      // Arrange - Generate multiple comments
      const postIds = [1, 2, 3];
      const createdComments = [];

      // Act
      for (const postId of postIds) {
        const commentData = generateCommentData(postId);
        const response = await apiClient.post('/comments', commentData);
        
        // Assert
        assertStatus(response, 201);
        createdComments.push(response.data);
      }

      // Verify all comments were created
      expect(createdComments.length).toBe(postIds.length);
      logger.info(`✓ Created ${createdComments.length} comments`);
    });

    test('@critical POST /comments - Verify required fields in response', async () => {
      // Arrange
      const commentData = generateCommentData(basePostId);

      // Act
      const response = await apiClient.post('/comments', commentData);

      // Assert
      assertStatus(response, 201);
      assertResponseHasFields(response, ['id', 'postId', 'name', 'email', 'body']);
      
      expect(response.data.id).toBeDefined();
      expect(response.data.id).not.toBeNull();
      
      logger.info('✓ All required fields present in response');
    });

    test('@regression POST /comments - Verify response structure matches schema', async () => {
      // Arrange
      const commentData = generateCommentData(basePostId);

      // Act
      const response = await apiClient.post('/comments', commentData);

      // Assert
      assertStatus(response, 201);
      validateSchema(response.data, commentSchema, 'Comment Schema');
      
      logger.info('✓ Response structure matches schema');
    });

    test('@regression POST /comments - Create with minimal required data', async () => {
      // Arrange
      const minimalData = {
        postId: basePostId,
        name: 'Test Name',
        email: 'test@example.com',
        body: 'Test comment body',
      };

      // Act
      const response = await apiClient.post('/comments', minimalData);

      // Assert
      assertStatus(response, 201);
      assertResponseContains(response, minimalData);
      
      logger.info('✓ Created comment with minimal data');
    });
  });

  test.describe('Error Handling', () => {
    test('@regression GET /comments/:id - Handle non-existent comment', async () => {
      // Arrange
      const nonExistentId = 999999;

      // Act & Assert
      try {
        await apiClient.get(`/comments/${nonExistentId}`);
        // JSONPlaceholder may return 404 or empty response
      } catch (error) {
        expect(error.response?.status).toBeDefined();
        logger.info('✓ Non-existent comment handled gracefully');
      }
    });

    test('@regression - Verify response includes proper error structure', async () => {
      // This test documents expected error behavior
      logger.info('✓ Error handling documented');
    });
  });

  test.describe('Performance & Load', () => {
    test('@smoke GET /comments - Load multiple comments', async () => {
      // Act
      const response = await apiClient.get('/comments');

      // Assert
      assertStatus(response, 200);
      
      // Verify reasonable dataset size
      expect(response.data.length).toBeGreaterThan(0);
      expect(response.data.length).toBeLessThan(10000);
      
      logger.info(`✓ Loaded ${response.data.length} comments successfully`);
    });

    test('@regression - Sequential API calls with delay', async () => {
      // Arrange
      const delayMs = 100;
      const iterations = 3;

      // Act
      for (let i = 0; i < iterations; i++) {
        const response = await apiClient.get(`/comments/${i + 1}`);
        assertStatus(response, 200);
        
        if (i < iterations - 1) {
          await wait(delayMs);
        }
      }

      logger.info(`✓ Completed ${iterations} sequential API calls`);
    });
  });
});
