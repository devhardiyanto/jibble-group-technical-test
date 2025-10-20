<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Darkmode } from "@/components/ui/darkmode"
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbText = computed(() => {
  const last = route.matched[route.matched.length - 1]
  const bc = last?.meta?.breadcrumb

  if (typeof bc === 'function') return bc(route)
  if (typeof bc === 'string') return bc

  // fallback: pakai name / path
  return (route.name as string) ?? route.path
})
</script>

<template>
  <div class="space-y-4 pt-2 py-5 w-full max-w-md mx-auto bg-background border-x dark:xl:border-white">
    <header class="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div class="flex items-center gap-2 px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>{{ breadcrumbText }}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div class="flex items-center gap-2">
        <div class="px-4">
          <Darkmode />
        </div>
      </div>
    </header>

    <div class="px-4">
      <div class="space-y-4 h-dvh">
        <router-view />
      </div>
    </div>
  </div>
</template>