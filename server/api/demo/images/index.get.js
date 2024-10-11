import { storageActions } from "~~/server/services/storage";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const images = await storageActions.findImagesByUserId(user.id);
  return images;
});
