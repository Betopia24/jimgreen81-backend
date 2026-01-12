/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import fs from "fs";
import { Readable } from "stream";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import config from "../config";
import { v4 as uuid } from "uuid";

interface UploadResponse {
  url: string;
}

// Define the expected file object structure
interface FileObject {
  originalname: string;
  path?: string; // Making path optional since it might not exist
  buffer?: Buffer; // Adding buffer for when path isn't available
  mimetype: string;
}

// AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: config.aws.AWS_ACCESS_KEY,
    secretAccessKey: config.aws.AWS_SECRET_KEY,
  },
});

// Upload file (general)
const uploadSingleToAWS = async (file: FileObject): Promise<UploadResponse> => {
  try {
    let fileBody: Buffer | Readable;

    if (file.path) {
      try {
        await fs.promises.access(file.path, fs.constants.F_OK);
        fileBody = fs.createReadStream(file.path);
      } catch (err) {
        console.error(`File path doesn't exist: ${file.path}`);
        throw new Error(`File not found at path: ${file.path}`);
      }
    } else if (file.buffer) {
      fileBody = file.buffer;
    } else {
      throw new Error("Neither file path nor buffer is available");
    }

    const fileKey = `${uuid()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: config.aws.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: fileBody,
      // ACL: "public-read",
      ContentType: file.mimetype,
    });

    await s3Client.send(command);

    const Location = `https://${config.aws.AWS_S3_BUCKET_NAME}.s3.${config.aws.AWS_REGION}.amazonaws.com/${fileKey}`;
    return { url: Location };
  } catch (error) {
    console.error(`Error uploading file: ${file.originalname}`, error);
    throw error;
  }
};

// Upload PDF buffer
const uploadPDFBufferToAWS = async (
  pdfBuffer: Uint8Array,
  fileName: string,
): Promise<UploadResponse> => {
  try {
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new AppError(400, "PDF buffer is empty");
    }

    const key = `${uuid()}-${fileName}.pdf`;

    const command = new PutObjectCommand({
      Bucket: config.aws.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: pdfBuffer,
      // ACL: "public-read",
      ContentType: "application/pdf",
    });

    await s3Client.send(command);

    const Location = `https://${config.aws.AWS_S3_BUCKET_NAME}.s3.${config.aws.AWS_REGION}.amazonaws.com/${key}`;
    return { url: Location };
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw new AppError(500, "Failed to upload PDF");
  }
};

// Delete single file
const deleteSingleFromAWS = async (fileUrl: string): Promise<void> => {
  try {
    const key = fileUrl.replace(
      `https://${config.aws.AWS_S3_BUCKET_NAME}.s3.${config.aws.AWS_REGION}.amazonaws.com/`,
      "",
    );

    const command = new DeleteObjectCommand({
      Bucket: config.aws.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    console.log(`Successfully deleted file: ${fileUrl}`);
  } catch (error: any) {
    console.error(`Error deleting file: ${fileUrl}`, error);
    throw new Error(`Failed to delete file: ${error?.message}`);
  }
};

// Delete multiple files
const deleteMultipleFromAWS = async (fileUrls: string[]): Promise<void> => {
  try {
    if (!Array.isArray(fileUrls) || fileUrls.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, "No file URLs provided");
    }

    const objectKeys = fileUrls.map((fileUrl) =>
      fileUrl.replace(
        `https://${config.aws.AWS_S3_BUCKET_NAME}.s3.${config.aws.AWS_REGION}.amazonaws.com/`,
        "",
      ),
    );

    const command = new DeleteObjectsCommand({
      Bucket: config.aws.AWS_S3_BUCKET_NAME!,
      Delete: {
        Objects: objectKeys.map((Key) => ({ Key })),
      },
    });

    await s3Client.send(command);
  } catch (error: any) {
    console.error(`Error deleting files:`, error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to delete files: ${error?.message}`,
    );
  }
};

export const UploadToAwsHelper = {
  uploadSingleToAWS,
  uploadPDFBufferToAWS,
  deleteSingleFromAWS,
  deleteMultipleFromAWS,
};
