<template>
  <NuxtLoadingIndicator />
  <Toaster position="top-center" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { Toaster } from "vue-sonner";

useSeoMeta({
  title: useAppConfig().seo.title,
  description: useAppConfig().seo.description,
});
</script>
