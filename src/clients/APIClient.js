import axios from 'axios';
import logger from '../utils/logger.js';
import config from '../../config/index.js';

/**
 * APIClient - Centralized API request handler
 * Supports GET, POST, PUT, DELETE with logging and retry logic
 */
class APIClient {
  constructor(baseURL = config.baseURL, customHeaders = {}) {
    this.baseURL = baseURL;
    this.headers = {
      ...config.headers,
      ...customHeaders,
    };
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: config.apiTimeout,
      headers: this.headers,
    });
  }

  /**
   * Set authorization token
   */
  setAuthToken(token) {
    this.headers.Authorization = `Bearer ${token}`;
    this.instance.defaults.headers.Authorization = `Bearer ${token}`;
    logger.info(`Auth token set for API client`);
  }

  /**
   * Log request details
   */
  logRequest(method, url, data = null, headers = {}) {
    const logData = {
      method,
      url: `${this.baseURL}${url}`,
      headers,
      ...(data && { payload: data }),
    };
    logger.info(`API Request: ${JSON.stringify(logData, null, 2)}`);
  }

  /**
   * Log response details
   */
  logResponse(method, url, status, responseTime, data = null) {
    const logData = {
      method,
      url: `${this.baseURL}${url}`,
      status,
      responseTime: `${responseTime}ms`,
      ...(data && { response: data }),
    };
    logger.info(`API Response: ${JSON.stringify(logData, null, 2)}`);
  }

  /**
   * GET request
   */
  async get(url, options = {}) {
    const startTime = Date.now();
    try {
      this.logRequest('GET', url, null, this.headers);
      const response = await this.instance.get(url, options);
      const responseTime = Date.now() - startTime;
      this.logResponse('GET', url, response.status, responseTime, response.data);
      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error(
        `API Error - GET ${url}: ${error.message} (${responseTime}ms)`
      );
      throw error;
    }
  }

  /**
   * POST request
   */
  async post(url, data, options = {}) {
    const startTime = Date.now();
    try {
      this.logRequest('POST', url, data, this.headers);
      const response = await this.instance.post(url, data, options);
      const responseTime = Date.now() - startTime;
      this.logResponse('POST', url, response.status, responseTime, response.data);
      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error(
        `API Error - POST ${url}: ${error.message} (${responseTime}ms)`
      );
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put(url, data, options = {}) {
    const startTime = Date.now();
    try {
      this.logRequest('PUT', url, data, this.headers);
      const response = await this.instance.put(url, data, options);
      const responseTime = Date.now() - startTime;
      this.logResponse('PUT', url, response.status, responseTime, response.data);
      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error(
        `API Error - PUT ${url}: ${error.message} (${responseTime}ms)`
      );
      throw error;
    }
  }

  /**
   * DELETE request
   */
  async delete(url, options = {}) {
    const startTime = Date.now();
    try {
      this.logRequest('DELETE', url, null, this.headers);
      const response = await this.instance.delete(url, options);
      const responseTime = Date.now() - startTime;
      this.logResponse(
        'DELETE',
        url,
        response.status,
        responseTime,
        response.data
      );
      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error(
        `API Error - DELETE ${url}: ${error.message} (${responseTime}ms)`
      );
      throw error;
    }
  }

  /**
   * PATCH request
   */
  async patch(url, data, options = {}) {
    const startTime = Date.now();
    try {
      this.logRequest('PATCH', url, data, this.headers);
      const response = await this.instance.patch(url, data, options);
      const responseTime = Date.now() - startTime;
      this.logResponse(
        'PATCH',
        url,
        response.status,
        responseTime,
        response.data
      );
      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error(
        `API Error - PATCH ${url}: ${error.message} (${responseTime}ms)`
      );
      throw error;
    }
  }
}

export default APIClient;
