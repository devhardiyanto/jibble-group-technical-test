<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue"

import { CardMovieContent, CardMovieSkeleton, CardMoviePagination, CardMovieEmpty } from "."
import { SearchMovie } from "@/components/movie/search"
import { MovieService } from "@/services/movie.service"

import { useMovieStore } from '@/stores/index'
const movieStore = useMovieStore()

const searchQuery = ref("")
const movies = computed(() => movieStore.movies)
const pagination = computed(() => ({
  page: movieStore.page,
  total: movieStore.total_pages
}))
const hasMovies = computed(() => movies.value.length > 0)

const fetchMovies = async (page?: number, title?: string) => {
  movieStore.setLoading(true)
  try {
    const params: { page?: number; Title?: string } = {}
    if (page) params.page = page
    if (title) params.Title = title
    
    const data = await MovieService.getMovies(params)
    movieStore.setMovies(data)
  } finally {
    movieStore.setLoading(false)
  }
}

const handlePageChange = async (page: number) => {
  await fetchMovies(page, searchQuery.value)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSearch = async (query: string) => {
  searchQuery.value = query
  await fetchMovies(1, query)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onBeforeMount(async () => {
  await fetchMovies()
})
</script>

<template>
  <div class="space-y-4">
    <SearchMovie @search="handleSearch" />
    
    <CardMoviePagination 
      v-if="hasMovies || movieStore.loading"
      class="sticky -top-[1px] z-10 bg-background py-2" 
      :page="pagination.page" 
      :total="pagination.total" 
      @page-change="handlePageChange" 
    />
    
    <CardMovieSkeleton v-if="movieStore.loading" />
    
    <template v-else>
      <CardMovieEmpty v-if="!hasMovies" :search-query="searchQuery" />
      <CardMovieContent 
        v-else
        v-for="movie in movies"
        :key="movie.imdbID"
        :movie="movie"
      />
    </template>
  </div>
</template>