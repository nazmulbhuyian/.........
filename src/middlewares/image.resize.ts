import { Request, Response, NextFunction } from "express";
import gm from "gm";

export const resizeImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.files && "category_logo" in req.files) {
      if (!req.files || !req.files["category_logo"]) {
        return res.status(400).json({
          success: false,
          message: "No image file uploaded",
          errorMessages: [{ path: "", message: "No image file uploaded" }],
        });
      }

      const categoryLogo = req.files["category_logo"][0]; // Assuming maxCount is 1

      if (categoryLogo.size <= 500000) {
        // If image is already <= 500 KB, no need to resize
        console.log("success", categoryLogo);
        return next();
      }

      // Resize image to fit within 500 KB
      if (req.files["category_logo"][0]) {
        const categoryLogoFile = req.files[
          "category_logo"
        ][0] as Express.Multer.File; // Type assertion

        const imagePath = categoryLogoFile.path; // Get the path to the uploaded image
        console.log(imagePath);

        gm(imagePath)
          .resize(1024, 1024)
          .toBuffer("JPEG", async (err, buffer) => {
            if (err) {
              throw new Error("Error resizing image: " + err.message);
            }
            // Update the request file with resized image data
            console.log("buffer:", buffer);
            categoryLogoFile.buffer = buffer; // Uncomment if you want to assign buffer to the file object
            categoryLogoFile.size = buffer.length; // Uncomment if you want to assign size to the file object
            return next();
          });
      }
    }
  } catch (error: any) {
    next(new Error("Error resizing image: " + error.message));
  }
};
