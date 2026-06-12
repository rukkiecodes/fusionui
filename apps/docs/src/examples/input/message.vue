<script setup>
import { computed, ref } from 'vue'
const email = ref('')
const name = ref('')
const pass = ref('')
const regex = ref('')
const validEmail = computed(() => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(regex.value))
</script>

<template>
  <div style="display: flex; gap: 18px 16px; flex-wrap: wrap; justify-content: center">
    <vd-input v-model="email" placeholder="Email">
      <template #message-success>Email Valid</template>
    </vd-input>
    <vd-input v-model="name" placeholder="Name">
      <template #message-danger>Required</template>
    </vd-input>
    <vd-input v-model="pass" type="password" placeholder="Password">
      <template #message-warn>Insecure password</template>
    </vd-input>
    <vd-input v-model="regex" label="Example Regex Validation" placeholder="vuedl@gmail.com">
      <template v-if="regex && validEmail" #message-success>Email Valid</template>
      <template v-if="regex && !validEmail" #message-danger>Invalid email</template>
    </vd-input>
  </div>
</template>
