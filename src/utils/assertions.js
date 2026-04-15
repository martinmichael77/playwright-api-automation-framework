import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import logger from './logger.js';

const ajv = new Ajv();
addFormats(ajv);

/**
 * Validate response against JSON schema
 */
export const validateSchema = (data, schema, schemaName = 'Unknown') => {
  try {
    const validate = ajv.compile(schema);
    const isValid = validate(data);

    if (!isValid) {
      const errors = validate.errors.map((error) => ({
        path: error.instancePath,
        message: error.message,
        params: error.params,
      }));
      logger.error(
        `Schema validation failed for ${schemaName}: ${JSON.stringify(errors)}`
      );
      throw new Error(`Schema validation failed: ${JSON.stringify(errors)}`);
    }

    logger.info(`Schema validation passed for ${schemaName}`);
    return true;
  } catch (error) {
    logger.error(`Error validating schema: ${error.message}`);
    throw error;
  }
};

/**
 * Assert response status
 */
export const assertStatus = (response, expectedStatus) => {
  const actualStatus = response.status;
  if (actualStatus !== expectedStatus) {
    logger.error(
      `Status mismatch. Expected: ${expectedStatus}, Got: ${actualStatus}`
    );
    throw new Error(
      `Status mismatch. Expected: ${expectedStatus}, Got: ${actualStatus}`
    );
  }
  logger.info(`Status assertion passed: ${actualStatus}`);
  return true;
};

/**
 * Assert response contains expected data
 */
export const assertResponseContains = (response, expectedData) => {
  const data = response.data;
  for (const [key, value] of Object.entries(expectedData)) {
    if (data[key] !== value) {
      logger.error(
        `Data mismatch for key: ${key}. Expected: ${value}, Got: ${data[key]}`
      );
      throw new Error(
        `Data mismatch for key: ${key}. Expected: ${value}, Got: ${data[key]}`
      );
    }
  }
  logger.info(`Response data assertion passed`);
  return true;
};

/**
 * Assert response has required fields
 */
export const assertResponseHasFields = (response, requiredFields) => {
  const data = response.data;
  
  // Handle arrays - check first element
  const dataToCheck = Array.isArray(data) ? data[0] : data;
  
  if (!dataToCheck) {
    logger.error('Response data is empty or undefined');
    throw new Error('Response data is empty or undefined');
  }
  
  const missingFields = requiredFields.filter((field) => !(field in dataToCheck));

  if (missingFields.length > 0) {
    logger.error(`Missing required fields: ${missingFields.join(', ')}`);
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  logger.info(`All required fields present: ${requiredFields.join(', ')}`);
  return true;
};

/**
 * Compare two objects for equality
 */
export const assertObjectsEqual = (actual, expected) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    logger.error(
      `Objects not equal. Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}`
    );
    throw new Error('Objects are not equal');
  }
  logger.info(`Objects equality assertion passed`);
  return true;
};
