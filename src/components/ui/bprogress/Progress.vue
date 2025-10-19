<script setup lang="ts">
import { toRef } from "vue";
import { useRoute } from "vue-router";
import { useAnchorProgress } from "@bprogress/vue";

const route = useRoute();
const fullPath = toRef(route, "fullPath"); // ✅ reactive ref

useAnchorProgress(
  {
    startPosition: 0.25,
    delay: 100,
    stopDelay: 200,
    forcedStopDelay: 500,
    disableSameURL: true, // hindari flicker saat push ke URL yang sama
  },
  [fullPath] // ✅ watch source sekarang ref, bukan string
);
</script>

<template></template>
