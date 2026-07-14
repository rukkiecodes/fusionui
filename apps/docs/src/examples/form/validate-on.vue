<script setup lang="ts">
import { ref } from 'vue'

type Rule = (value: unknown) => boolean | string

const handle = ref('')
const website = ref('')
const code = ref('')

const required: Rule = v => !!String(v ?? '').trim() || 'This field is required'
</script>

<template>
  <f-form class="form">
    <f-input
      v-model="handle"
      label="Handle (checked as you type)"
      :rules="[required]"
      validate-on="input"
    />
    <f-input
      v-model="website"
      label="Website (checked when you leave the field)"
      :rules="[required]"
      validate-on="blur"
    />
    <f-input
      v-model="code"
      label="Invite code (checked on submit)"
      :rules="[required]"
      validate-on="submit"
    />

    <div class="actions">
      <f-btn type="submit" color="primary">Validate</f-btn>
    </div>
  </f-form>
</template>

<style scoped>
.form {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.actions {
  margin-top: 12px;
}
</style>
