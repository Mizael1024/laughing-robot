import { storageActions } from "~~/server/services/storage";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const id = getRouterParam(event, "id");
  const image = await storageActions.findImageById(id);
  if (!image || image.userId !== user.id) {
    throw new Error("Image not found or you are not authorized.");
  }
  await storageActions.deleteImage(image.id);
  await hubBlob().del(image.pathname);
  return sendNoContent(event);
});
