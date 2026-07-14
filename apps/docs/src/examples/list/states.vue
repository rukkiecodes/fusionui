<template>
  <div class="w">
    <f-list>
      <f-list-item active prepend-icon="inbox" title="Inbox" subtitle="12 unread" />
      <f-list-item link prepend-icon="star" title="Starred" />
      <f-list-item active color="success" prepend-icon="send" title="Sent" />
      <f-list-item disabled prepend-icon="trash-2" title="Trash" subtitle="Empty" />
    </f-list>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}
</style>
