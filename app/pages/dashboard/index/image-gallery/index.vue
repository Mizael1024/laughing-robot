<template>
  <AppPageContainer
    title="Image Gallery"
    description="A demo page to showcase image gallery with file storage"
  >
    <div class="flex items-center gap-2 mb-4">
      <UButton
        :loading="loading"
        label="Upload image"
        color="black"
        size="md"
        @click="openFilePicker"
      />
    </div>
    <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <div v-for="image in images" :key="image.id" class="relative group">
        <img
          class="rounded-lg aspect-square w-full h-auto object-cover ring-1 ring-gray-200 dark:ring-white/20"
          :src="`/images/${image.pathname}`"
          :alt="image.pathname"
        />
        <UButton
          class="absolute top-2 right-2 opacity-20 group-hover:opacity-100"
          icon="i-ph-trash-duotone"
          color="rose"
          variant="soft"
          size="xs"
          :loading="imageDeletionLoading[image.id]"
          @click="deleteImage(image.id)"
        />
      </div>
    </div>
  </AppPageContainer>
</template>

<script setup>
import { useFileDialog } from "@vueuse/core";
import { toast } from "vue-sonner";
const loading = ref(false);
const imageDeletionLoading = ref({});
const { data: images, refresh } = await useFetch("/api/demo/images");
const { open: openFilePicker, onChange: onFileChange } = useFileDialog({
  accept: "image/*",
  multiple: false,
});

onFileChange(async (files) => {
  if (!files.length) return;

  const file = files[0];
  const formData = new FormData();
  formData.append("image", file);

  try {
    loading.value = true;
    await $fetch("/api/demo/images", {
      method: "POST",
      body: formData,
    });
    await refresh();
    toast.success("Image uploaded successfully");
  } catch (error) {
    console.error(error);
    toast.error(error.data?.message || "Failed to upload image");
  } finally {
    loading.value = false;
  }
});

async function deleteImage(imageId) {
  try {
    imageDeletionLoading.value = {
      ...imageDeletionLoading.value,
      [imageId]: true,
    };
    await $fetch(`/api/demo/images/${imageId}`, { method: "DELETE" });
    await refresh();
    toast.success("Image deleted successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete image");
  } finally {
    imageDeletionLoading.value = {
      ...imageDeletionLoading.value,
      [imageId]: false,
    };
  }
}
</script>
