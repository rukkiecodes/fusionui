<script setup>
import { ref } from 'vue'
const dialog = ref(false)
</script>

<template>
  <div class="d-flex" style="gap: 16px; align-items: center; flex-wrap: wrap">
    <vd-menu>
      <template #activator="{ props }">
        <vd-btn v-bind="props" variant="tonal" append-icon="$dropdown">Menu</vd-btn>
      </template>
      <vd-list>
        <vd-list-item title="Profile" link prepend-icon="user" />
        <vd-list-item title="Settings" link prepend-icon="settings" />
        <vd-list-item title="Logout" link prepend-icon="log-out" />
      </vd-list>
    </vd-menu>

    <vd-tooltip text="Delete forever">
      <vd-btn icon="trash-2" color="danger" variant="tonal" />
    </vd-tooltip>

    <vd-popup v-model="dialog" title="Confirm action">
      <template #activator="{ props }">
        <vd-btn v-bind="props" color="primary">Open dialog</vd-btn>
      </template>
      <p>Are you sure you want to continue?</p>
      <template #actions="{ close }">
        <vd-btn variant="text" @click="close">Cancel</vd-btn>
        <vd-btn color="primary" @click="close">Confirm</vd-btn>
      </template>
    </vd-popup>
  </div>
</template>
