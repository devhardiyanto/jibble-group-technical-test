<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import { ProgressProvider } from "@bprogress/vue";
import { Progress } from "@/components/ui/bprogress";
import { Simplebar } from "@/components/ui/scrolling";
</script>

<template>
  <ProgressProvider class="relative">
    <Progress />
    <Simplebar class="h-dvh">
      <router-view />
    </Simplebar>
    <Toaster position="top-right" rich-colors class="pointer-events-auto" />
  </ProgressProvider>
</template>
