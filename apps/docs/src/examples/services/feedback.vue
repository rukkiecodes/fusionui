<script setup>
import { useNotify, useDialog, useLoading } from 'vue-dl'

const { notify } = useNotify()
const dialog = useDialog()
const loading = useLoading()

function toast() {
  notify.success({ title: 'Saved', text: 'Your changes were stored.', progress: true })
}

async function confirmDelete() {
  const ok = await dialog.confirm({
    title: 'Delete item?',
    text: 'This action cannot be undone.',
    acceptText: 'Delete',
    color: 'danger',
  })
  notify({ text: ok ? 'Deleted.' : 'Cancelled.', color: ok ? 'danger' : 'primary' })
}

async function askName() {
  const name = await dialog.prompt({ title: 'Your name?', placeholder: 'Ada Lovelace' })
  if (name) notify.info({ text: `Hello, ${name}!` })
}

function showLoading() {
  const loader = loading.open({ text: 'Crunching numbers…' })
  setTimeout(() => loader.close(), 1800)
}
</script>

<template>
  <div class="d-flex" style="gap: 12px; flex-wrap: wrap">
    <vd-btn color="success" @click="toast">Toast</vd-btn>
    <vd-btn color="danger" variant="tonal" @click="confirmDelete">Confirm</vd-btn>
    <vd-btn color="primary" variant="tonal" @click="askName">Prompt</vd-btn>
    <vd-btn variant="outlined" @click="showLoading">Loading</vd-btn>
  </div>
</template>
