import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    interface Result {
      secure_url: string;
      public_id: string;
    }

    const result = await new Promise<Result>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "profile" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as Result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    if (!result.secure_url) {
      return Response.json(
        { error: "Error uploading image to Cloudinary" },
        { status: 500 }
      );
    }

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        image: result.secure_url,
      },
    });

    return Response.json({ result, success: "Image uploaded" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error uploading image" }, { status: 500 });
  }
}
