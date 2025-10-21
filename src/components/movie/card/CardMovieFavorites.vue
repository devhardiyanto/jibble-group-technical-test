<script setup lang="ts">
import { computed } from 'vue'
import { useMovieStore } from '@/stores/index'
import { CardMovieContent } from '.'
import { Star } from 'lucide-vue-next'

const movieStore = useMovieStore()
const favoriteMovies = computed(() => movieStore.favoriteMovies)
const hasFavorites = computed(() => favoriteMovies.value.length > 0)
</script>

<template>
  <div v-if="hasFavorites" class="space-y-4 sticky top-0 z-20 bg-background pb-4 pt-2">
    <div class="flex items-center gap-2 border-b pb-2">
      <Star class="w-5 h-5 fill-yellow-400 text-yellow-400" />
      <h2 class="text-lg font-semibold">Favorites ({{ favoriteMovies.length }})</h2>
    </div>
    
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <CardMovieContent 
        v-for="movie in favoriteMovies"
        :key="movie.imdbID"
        :movie="movie"
      />
    </div>
  </div>
</template>
