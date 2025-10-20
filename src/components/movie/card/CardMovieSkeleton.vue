<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"
</script>

<template>
  <div class="space-y-4">
    <Card v-for="index in 5" :key="index">
      <CardContent class="space-y-2">
        <Skeleton class="h-6 w-[200px] mb-4 rounded-full" />
        <Skeleton class="h-3 w-full mb-6 rounded-full" />
        <Skeleton class="h-4 w-full rounded-full" />
      </CardContent>
    </Card>
  </div>
</template>