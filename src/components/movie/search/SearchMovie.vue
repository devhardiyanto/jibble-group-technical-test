<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { ref } from "vue"

const search = ref("")
</script>

<template>
  <Input v-model="search" type="text" placeholder="Search..." />
</template>