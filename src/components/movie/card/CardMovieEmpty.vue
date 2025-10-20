<script setup lang="ts">
defineProps<{
  searchQuery?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="rounded-full bg-muted p-6 mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-muted-foreground"
      >
        <path d="m21 21-4.3-4.3" />
        <circle cx="11" cy="11" r="8" />
        <path d="m9 11 2 2 4-4" />
      </svg>
    </div>
    
    <h3 class="text-lg font-semibold mb-2">No Movies Found</h3>
    
    <p v-if="searchQuery" class="text-sm text-muted-foreground max-w-md">
      We couldn't find any movies matching <span class="font-medium text-foreground">"{{ searchQuery }}"</span>. 
      Try searching with different keywords.
    </p>
    <p v-else class="text-sm text-muted-foreground max-w-md">
      No movies available at the moment. Please try again later.
    </p>
  </div>
</template>
