<script setup>
const first = ['Lana', 'Drew', 'Candice', 'Natali', 'Koray', 'Demi', 'Orlando', 'Kate', 'Phoenix']
const last = ['Steiner', 'Cano', 'Wu', 'Craig', 'Okumus', 'Wilkinson', 'Diggs', 'Morrison', 'Lane']
const cities = ['Berlin', 'Lisbon', 'Toronto', 'Dublin', 'Manchester', 'Austin']
const roles = ['Engineer', 'Designer', 'Account executive', 'Support specialist']

// 48 people, generated rather than typed out.
const people = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  name: `${first[i % first.length]} ${last[(i * 5) % last.length]}`,
  role: roles[i % roles.length],
  city: cities[i % cities.length],
}))
</script>

<template>
  <f-data-iterator :items="people" :items-per-page="4" class="iterator">
    <template #default="{ items }">
      <f-list>
        <f-list-item
          v-for="person in items"
          :key="person.id"
          :title="person.name"
          :subtitle="`${person.role} · ${person.city}`"
        />
      </f-list>
    </template>

    <!-- The footer slot gets the whole pager: page, pageCount, isFirst/isLast, setPage… -->
    <template #footer="{ page, pageCount, prevPage, nextPage, isFirst, isLast }">
      <div class="pager">
        <f-btn size="small" variant="outlined" :disabled="isFirst" @click="prevPage">
          Previous
        </f-btn>
        <span class="pager__label">Page {{ page }} of {{ pageCount }}</span>
        <f-btn size="small" variant="outlined" :disabled="isLast" @click="nextPage">Next</f-btn>
      </div>
    </template>
  </f-data-iterator>
</template>

<style scoped>
.iterator {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}

.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 16px;
}

.pager__label {
  font-size: 0.875rem;
  opacity: 0.7;
}
</style>
