import {
  DeleteObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import multer from "multer";
import * as fs from "fs";
import ApiError from "../errors/ApiError";
const path = require("path");
const uuid = require("uuid");
require('dotenv').config();

// Set up AWS configuration
const region = process.env.REGION;
const endpoint = process.env.END_POINT;
const s3 = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID ? process.env.ACCESS_KEY_ID : "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY ? process.env.SECRET_ACCESS_KEY : "",
  },
});

const SpaceName = process.env.SPACE_NAME;

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    const uniqueSuffix = uuid.v4();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const ImageUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const supportedImage = /png|jpg|webp|jpeg|PNG|JPG|WEBP|JPEG/;
    const extension = path.extname(file.originalname);

    if (supportedImage.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Must be a png|jpg|webp|jpeg image"));
    }
  },
  limits: {
    fileSize: 3000000,
  },
});

// Upload image to DigitalOcean Spaces
const uploadToSpaces = async (file: any) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: SpaceName,
    Key: `classic_furniture_image/${file.filename}`,
    Body: fileStream,
    ACL: "public-read" as ObjectCannedACL,
  };

  try {
    const data = await s3.send(new PutObjectCommand(uploadParams));
    const httpStatusCode = data?.$metadata?.httpStatusCode;
    const { Bucket, Key } = uploadParams;
    const Location = `${process.env.LOCATION}/${Key}`;
    const sendData = {
      Location,
      Key,
    };
    fs.unlinkSync(file.path);
    if (httpStatusCode == 200) return sendData;
    else throw new ApiError(400, "Image upload failed");
  } catch (error) {
    throw error;
  }
};

const deleteFromSpaces = async (key: any) => {
  const deleteParams = {
    Bucket: SpaceName,
    Key: key,
  };

  try {
    const data = await s3.send(new DeleteObjectCommand(deleteParams));
    const httpStatusCode = data?.$metadata?.httpStatusCode;
    if (httpStatusCode == 204) return true;
    else throw new ApiError(400, "Image Delete failed");
  } catch (error) {
    throw error;
  }
};

// Define storage settings
const videoStorage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    const uniqueSuffix = uuid.v4();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Initialize multer with the storage settings
const VideoUpload = multer({
  storage: videoStorage,
  fileFilter: (req, file, cb) => {
    const supportedVideo = /mp4/;
    const extension = path.extname(file.originalname);

    // Check if the file extension is mp4
    if (supportedVideo.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Must be an MP4 video"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});

const VideoUploader = async (file: any) => {
  const fileStream = fs.createReadStream(file.path); // Assuming file is a multer file object

  const uploadParams = {
    Bucket: SpaceName,
    Key: `classic_furniture_video/${file.filename}`,
    Body: fileStream,
    ACL: "public-read" as ObjectCannedACL,
  };

  try {
    const data = await s3.send(new PutObjectCommand(uploadParams));
    const httpStatusCode = data?.$metadata?.httpStatusCode;
    const { Bucket, Key } = uploadParams;
    const Location = `${process.env.LOCATION}/${Key}`;
    fs.unlinkSync(file.path);
    const sendData = {
      Location,
      Key,
    };
    if (httpStatusCode == 200) return sendData;
    else throw new ApiError(400, "Image upload failed");
  } catch (error) {
    throw error; // Rethrow the error to handle it further up the call stack
  }
};

export const FileUploadHelper = {
  ImageUpload,
  uploadToSpaces,
  deleteFromSpaces,
  VideoUploader,
  VideoUpload,
};

