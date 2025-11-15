import { Request, Response } from "express";
import multer from "multer";
import { storagePut } from "./storage";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes"));
    }
  },
});

export const uploadImageHandler = upload.single("file");

export async function handleImageUpload(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se proporcionó ningún archivo" });
    }

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = req.file.originalname.split(".").pop();
    const fileKey = `productos/${timestamp}-${randomStr}.${extension}`;

    const { url } = await storagePut(
      fileKey,
      req.file.buffer,
      req.file.mimetype
    );

    res.json({ url });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    res.status(500).json({ error: "Error al subir la imagen" });
  }
}
