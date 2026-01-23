import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for file:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),
    
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Product Image uploaded:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),

} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;
