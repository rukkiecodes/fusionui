<script setup>
import { ref } from 'vue'
const pick = ref('like')
</script>

<template>
  <f-radio-group v-model="pick" inline>
    <f-radio value="like" icon="heart" color="danger">Like</f-radio>
    <f-radio value="star" icon="star" color="warning">Star</f-radio>
    <f-radio value="done" icon="check" color="success">Done</f-radio>
  </f-radio-group>
</template>
