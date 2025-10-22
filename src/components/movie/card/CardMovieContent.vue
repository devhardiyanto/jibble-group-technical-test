<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { type Movie } from "@/types/movie"
import { useMovieStore } from '@/stores/index'
import { Star } from 'lucide-vue-next'

const props = defineProps<{
  movie: Movie
}>()

const movieStore = useMovieStore()
const isFavorite = computed(() => movieStore.isFavorite(props.movie.imdbID))

const handleToggleFavorite = () => {
  movieStore.toggleFavorite(props.movie.imdbID)
}
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
      <CardAction>
        <TooltipProvider>
          <Tooltip :delayDuration="0">
            <TooltipTrigger as-child>
              <Button 
                @click="handleToggleFavorite" 
                variant="ghost" 
                size="icon"
                :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
              >
                <Star 
                  :class="['w-5 h-5 transition-colors', isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground']"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ isFavorite ? 'Remove from favorites' : 'Add to favorites' }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardAction>
    </CardHeader>
    <CardContent>
      ID: {{ $props.movie.imdbID }}
    </CardContent>
  </Card>
</template>