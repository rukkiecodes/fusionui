<script setup lang="ts">
const items = [
  {
    n: 'Mon',
    icon: 'package',
    title: 'Order placed',
    text: 'We pick and pack your order at the closest warehouse.',
  },
  {
    n: 'Wed',
    icon: 'truck',
    title: 'On the road',
    text: 'A tracking link lands in your inbox as soon as it leaves us.',
  },
  {
    n: 'Fri',
    icon: 'home',
    title: 'Delivered',
    text: 'Signed for at your door, with a photo as proof of delivery.',
  },
]
</script>

<template>
  <f-steps :items="items" />
</template>
