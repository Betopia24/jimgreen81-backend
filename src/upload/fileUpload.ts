import multer from "multer";
import AppError from "../errors/AppError";
import { UploadToAwsHelper } from "./uploadToAwsS3";

// =========================
//    File Upload
// =========================
// Memory storage configuration
const storage = multer.memoryStorage();

export const uploadFile = multer({
  storage: storage,
  limits: { fileSize: 6 * 1024 * 1024 },
});

// =========================
//    File Upload
// =========================
/**
 * Upload a file using Cloud
 * @param file - Express.Multer.File
 * @param fileName - Friendly name for error messages
 * @returns url of uploaded file
 */
export const uploadFileToCloud = async (
  file: Express.Multer.File,
  fileName: string,
) => {
  if (!file) {
    throw new AppError(400, `${fileName} image is required`);
  }

  const result = await UploadToAwsHelper.uploadSingleToAWS(file);
  return result;
};

/**
 * Delete a file form Cloud
 * @param url - the cloud image url
 */
export const deleteFileFromCloud = async (url: string) => {
  if (!url) {
    throw new AppError(400, `${url} is required`);
  }

  await UploadToAwsHelper.deleteSingleFromAWS(url);
};
