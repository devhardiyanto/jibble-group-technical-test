<script setup lang="ts">
import { computed, onBeforeMount } from "vue"

import { CardMovieContent, CardMovieSkeleton, CardMoviePagination } from "."
import { MovieService } from "@/services/movie.service"

import { useMovieStore } from '@/stores/index'
const movieStore = useMovieStore()

const movies = computed(() => movieStore.movies)
const pagination = computed(() => ({
  page: movieStore.page,
  total: movieStore.total_pages
}))

const fetchMovies = async (page?: number) => {
  movieStore.setLoading(true)
  try {
    const data = await MovieService.getMovies({ page })
    movieStore.setMovies(data)
  } finally {
    movieStore.setLoading(false)
  }
}

const handlePageChange = async (page: number) => {
  await fetchMovies(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onBeforeMount(async () => {
  await fetchMovies()
})
</script>

<template>
  <CardMoviePagination class="sticky -top-[1px] z-10 bg-background py-2" :page="pagination.page" :total="pagination.total" @page-change="handlePageChange" />
  <CardMovieSkeleton v-if="movieStore.loading" />
  <CardMovieContent v-else
    v-for="movie in movies"
    :key="movie.imdbID"
    :movie="movie"
  />
</template>