'use strict';

const ImageKit = require('@imagekit/nodejs');
const logger = require('../utils/logger');

// FIX: was `const imageKit = require('imagekit')` then `const imageKit = new imageKit(...)` — duplicate const crash
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const ALLOWED_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

/**
 * Uploads a file buffer to ImageKit.
 * @param {Buffer} fileBuffer — raw file buffer from multer memoryStorage
 * @param {string} fileName   — unique filename (UUID)
 * @param {string} mimeType   — file's MIME type
 * @returns {Promise<{url: string, fileId: string}>}
 */
async function uploadFile(fileBuffer, fileName, mimeType) {
  if (!fileBuffer) {
    throw new Error('No file buffer provided for upload.');
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw Object.assign(new Error(`Invalid file type: ${mimeType}. Only MP4, WebM, and MOV are allowed.`), { statusCode: 415 });
  }

  if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
    throw Object.assign(new Error('File exceeds 100 MB limit.'), { statusCode: 413 });
  }

  try {
    const result = await imagekit.upload({
      file: fileBuffer.toString('base64'),
      fileName,
      useUniqueFileName: true,
      folder: '/food-reels',
    });

    logger.info(`[Storage] Uploaded file: ${result.url}`);
    return { url: result.url, fileId: result.fileId };
  } catch (err) {
    logger.error('[Storage] ImageKit upload failed:', err);
    throw Object.assign(new Error('File upload failed. Please try again.'), { statusCode: 502 });
  }
}

/**
 * Deletes a file from ImageKit by fileId.
 * @param {string} fileId
 */
async function deleteFile(fileId) {
  try {
    await imagekit.deleteFile(fileId);
    logger.info(`[Storage] Deleted file: ${fileId}`);
  } catch (err) {
    logger.warn(`[Storage] Failed to delete file ${fileId}:`, err);
  }
}

module.exports = { uploadFile, deleteFile };