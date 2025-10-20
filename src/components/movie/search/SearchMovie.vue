<script setup lang="ts">
import { 
  InputGroup, 
  InputGroupInput, 
  InputGroupAddon, 
  InputGroupButton 
} from "@/components/ui/input-group"
import { ref } from "vue"
import { watchDebounced } from "@vueuse/core"

const search = ref("")

const emit = defineEmits<{
  search: [query: string]
}>()

// Debounced search emit
watchDebounced(
  search,
  (value) => {
    emit("search", value.trim())
  },
  { debounce: 500 }
)

const clearSearch = () => {
  search.value = ""
}
</script>

<template>
  <InputGroup>
    <InputGroupInput 
      v-model="search" 
      type="text" 
      placeholder="Search movies..." 
    />
    
    <InputGroupAddon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </InputGroupAddon>

    <InputGroupAddon v-if="search" align="inline-end">
      <InputGroupButton @click="clearSearch" aria-label="Clear search">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</template>