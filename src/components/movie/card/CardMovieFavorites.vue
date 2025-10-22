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
  <div v-if="hasFavorites" class="space-y-4">
    <div class="flex items-center gap-2 border-b pb-2">
      <Star class="w-5 h-5 fill-yellow-400 text-yellow-400" />
      <h2 class="text-lg font-semibold">Favorites ({{ favoriteMovies.length }})</h2>
    </div>
    
    <CardMovieContent 
      v-for="movie in favoriteMovies"
      :key="movie.imdbID"
      :movie="movie"
    />
  </div>
</template>
