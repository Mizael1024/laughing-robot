import { storageActions } from "~~/server/services/storage";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const form = await readFormData(event);
  const image = form.get("image");
  if (!(image instanceof Blob)) {
    throw new Error("Image is not a Blob");
  }
  ensureBlob(image, {
    maxSize: "1MB",
    types: ["image/png", "image/jpeg", "image/webp"],
  });

  const file = await hubBlob().put(image.name, image, {
    addRandomSuffix: false,
  });
  
  const payload = {
    userId: user.id,
    contentType: file.contentType,
    pathname: file.pathname,
    size: file.size,
    uploadedAt: file.uploadedAt,
  };
  const record = await storageActions.createImage(payload);
  return record;
});
