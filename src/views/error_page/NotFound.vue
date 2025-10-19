<script setup lang="ts">
import { FolderCode } from "lucide-vue-next"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { RouterLink } from "vue-router"
</script>

<template>
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <FolderCode />
      </EmptyMedia>
      <EmptyTitle>Page Not Found</EmptyTitle>
      <EmptyDescription>
        The page you are looking for doesn't exist or has been moved.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <div class="flex gap-2">
        <Button variant="outline">
          <RouterLink to="/">Home</RouterLink>
        </Button>
      </div>
    </EmptyContent>
  </Empty>
</template>