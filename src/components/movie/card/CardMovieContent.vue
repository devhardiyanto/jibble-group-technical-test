<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type Movie } from "@/types/movie"


defineProps<{
  movie: Movie
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ $props.movie.Title }}</CardTitle>
      <CardDescription>{{ $props.movie.Year }}</CardDescription>
    </CardHeader>
    <CardContent>
      {{ $props.movie.imdbID }}
    </CardContent>
  </Card>
</template>