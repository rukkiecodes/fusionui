<script setup>
const first = ['Lana', 'Drew', 'Candice', 'Natali', 'Koray', 'Demi', 'Orlando', 'Kate', 'Phoenix']
const last = ['Steiner', 'Cano', 'Wu', 'Craig', 'Okumus', 'Wilkinson', 'Diggs', 'Morrison', 'Lane']
const cities = ['Berlin', 'Lisbon', 'Toronto', 'Dublin', 'Manchester', 'Austin', 'Osaka']
const roles = ['Engineer', 'Designer', 'Account executive', 'Support specialist', 'Recruiter']

// 10,000 people. Only the ~10 rows in view are ever in the DOM.
const people = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: `${first[i % first.length]} ${last[(i * 7) % last.length]}`,
  role: roles[i % roles.length],
  city: cities[i % cities.length],
}))
</script>

<template>
  <div class="w">
    <f-virtual-scroll :items="people" :item-height="56" item-key="id" height="320">
      <template #default="{ item, index }">
        <div class="row">
          <f-avatar circle size="x-small" color="primary" :text="item.name" />
          <div class="row__text">
            <strong>{{ item.name }}</strong>
            <span>{{ item.role }} · {{ item.city }}</span>
          </div>
          <span class="row__index">#{{ index + 1 }}</span>
        </div>
      </template>
    </f-virtual-scroll>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
  border-radius: var(--fui-radius-md);
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  padding: 0 14px;
  text-align: start;
}

.row__text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.row__text span {
  font-size: 0.8125rem;
  opacity: 0.6;
}

.row__index {
  margin-inline-start: auto;
  font-size: 0.75rem;
  opacity: 0.45;
  font-variant-numeric: tabular-nums;
}
</style>
