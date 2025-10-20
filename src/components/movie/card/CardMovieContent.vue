<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { type Movie } from "@/types/movie"

defineProps<{
  movie: Movie
}>()
</script>

<template>
  <Card>
    <CardHeader class="prose prose-sm">
      <CardTitle class="dark:text-white text-black">
        <TooltipProvider>
          <Tooltip :delayDuration="0">
            <TooltipTrigger as="label" class="text-left leading-tight line-clamp-1">{{ $props.movie.Title }}</TooltipTrigger>
            <TooltipContent align="start" :side-offset="1">
              <p>{{ $props.movie.Title }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardTitle>
      <CardDescription>{{ $props.movie.Year }}</CardDescription>
    </CardHeader>
    <CardContent>
      ID: {{ $props.movie.imdbID }}
    </CardContent>
  </Card>
</template>