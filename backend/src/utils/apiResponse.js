'use strict';

/**
 * Standardised API response helpers.
 * Every API response has the shape: { success, message, data?, error? }
 */

class ApiResponse {
  /**
   * @param {number} statusCode
   * @param {string} message
   * @param {*} data
   */
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    if (data !== null) this.data = data;
  }
}

/**
 * Success helper — sends a standardised success response.
 */
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json(new ApiResponse(statusCode, message, data));
};

/**
 * Error helper — sends a standardised error response.
 */
const sendError = (res, message, statusCode = 500, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};

module.exports = { ApiResponse, sendSuccess, sendError };
