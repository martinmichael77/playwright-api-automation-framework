/**
 * Common Helper Functions
 */

/**
 * Retry a function with exponential backoff
 */
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  baseDelay = 1000
) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const delay = baseDelay * Math.pow(2, i);
      console.log(
        `Retry attempt ${i + 1}/${maxRetries} after ${delay}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

/**
 * Extract specific fields from an object
 */
export const extractFields = (obj, fields) => {
  return fields.reduce((result, field) => {
    if (field in obj) {
      result[field] = obj[field];
    }
    return result;
  }, {});
};

/**
 * Deep merge two objects
 */
export const mergeObjects = (target, source) => {
  const output = Object.assign({}, target);

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeObjects(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
};

/**
 * Check if value is an object
 */
export const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

/**
 * Convert response data to CSV format (useful for reporting)
 */
export const convertToCSV = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((field) => JSON.stringify(row[field])).join(',')
    ),
  ].join('\n');

  return csv;
};

/**
 * Parse response headers from axios response
 */
export const parseResponseHeaders = (response) => {
  return {
    contentType: response.headers['content-type'],
    contentLength: response.headers['content-length'],
    cacheControl: response.headers['cache-control'],
    setcookie: response.headers['set-cookie'],
  };
};

/**
 * Check if response is JSON
 */
export const isJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Generate unique ID for test runs
 */
export const generateTestId = () => {
  return `TEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
