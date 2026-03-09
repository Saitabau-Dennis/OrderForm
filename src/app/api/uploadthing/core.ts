import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";

const f = createUploadthing();

// Shared auth gate for all upload routes.
const requireUserSession = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new UploadThingError("Unauthorized");
  }

  return { userId: session.user.id };
};

export const ourFileRouter = {
  // Single-image upload used for generic image fields.
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(requireUserSession)
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete for file:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),

  // Multi-image upload used by product gallery fields.
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(requireUserSession)
    .onUploadComplete(async ({ file }) => {
      console.log("Product Image uploaded:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
