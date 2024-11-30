import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req: Request) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const imgUrl = formData.get("imgUrl") as string;

    if (!imgUrl) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    // Extract the public ID by stripping off unnecessary parts
    const parts = imgUrl.split("image/upload/")[1].split("/");
    const publicId = parts.slice(1).join("/").split(".")[0]; // Remove version and file extension

    // Logging for debugging purposes
    console.log("Public ID:", publicId);

    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);

    if (result.result === "ok") {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          image: null,
        },
      });
      return Response.json(
        { success: "Image deleted successfully" },
        { status: 200 }
      );
    } else {
      return Response.json(
        { error: "Failed to delete image" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
