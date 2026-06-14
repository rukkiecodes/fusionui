<script setup>
import { ref } from 'vue'
const like = ref(true)
const fav = ref(true)
const save = ref(false)
</script>

<template>
  <div class="row">
    <f-checkbox v-model="like" icon="heart" color="danger">Like</f-checkbox>
    <f-checkbox v-model="fav" icon="star" color="warning">Favorite</f-checkbox>
    <f-checkbox v-model="save" icon="bookmark" color="primary">Save</f-checkbox>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
</style>
