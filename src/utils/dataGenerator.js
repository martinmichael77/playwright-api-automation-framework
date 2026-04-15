import { faker } from '@faker-js/faker';

/**
 * Generate test data for user creation
 */
export const generateUserData = () => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    website: faker.internet.url(),
    company: {
      name: faker.company.name(),
      catchPhrase: faker.company.catchPhrase(),
    },
  };
};

/**
 * Generate test data for post creation
 */
export const generatePostData = (userId = 1) => {
  return {
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    userId: userId,
  };
};

/**
 * Generate test data for comment creation
 */
export const generateCommentData = (postId = 1) => {
  return {
    name: faker.lorem.sentence(),
    email: faker.internet.email(),
    body: faker.lorem.paragraph(),
    postId: postId,
  };
};

/**
 * Generate a random number within range
 */
export const randomNumber = (min = 1, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate a random string
 */
export const randomString = (length = 10) => {
  return faker.string.alphaNumeric(length);
};

/**
 * Generate a random email
 */
export const randomEmail = () => {
  return faker.internet.email();
};

/**
 * Wait for specified milliseconds
 */
export const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
