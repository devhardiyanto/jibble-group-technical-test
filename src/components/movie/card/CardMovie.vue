<script setup lang="ts">
import { CardMovieContent, CardMovieSkeleton } from "."
</script>

<template>
  <div class="card">
    <Suspense timeout="10000">
      <template #default>
        <CardMovieContent :movie="{
          Title: 'asd',
          Year: 2022,
          imdbID: 'asd'
        }" />
      </template>
      <template #fallback>
        <CardMovieSkeleton />
      </template>
    </Suspense>
  </div>
</template>