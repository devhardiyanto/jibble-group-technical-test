<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import { ProgressProvider } from "@bprogress/vue";
import { Progress } from "@/components/ui/bprogress";
</script>

<template>
  <ProgressProvider class="relative">
    <Progress />
    <router-view/>
    <Toaster position="top-right" rich-colors class="pointer-events-auto" />
  </ProgressProvider>
</template>
