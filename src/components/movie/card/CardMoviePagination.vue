<script setup lang="ts">
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

defineProps<{
  page: number
  total: number
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const handlePageChange = (page: number) => {
  emit('page-change', page)
}
</script>

<template>
  <Pagination v-slot="{ page }" :items-per-page="10" :total="$props.total" :default-page="$props.page" @update:page="handlePageChange">
    <PaginationContent v-slot="{ items }">
      <PaginationPrevious />

      <template v-for="(item, index) in items" :key="index">
        <PaginationItem
          v-if="item.type === 'page'"
          :value="item.value"
          :is-active="item.value === page"
        >
          {{ item.value }}
        </PaginationItem>
      </template>

      <PaginationEllipsis :index="4" />

      <PaginationNext />
    </PaginationContent>
  </Pagination>
</template>