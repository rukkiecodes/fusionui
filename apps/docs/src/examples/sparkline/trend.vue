<script setup>
// Weekly active users, one point per week.
const users = [820, 864, 902, 878, 940, 1010, 986, 1054, 1120, 1098, 1180, 1240]
// Support tickets — same shape, opposite story.
const tickets = [42, 38, 44, 51, 47, 39, 35, 30, 33, 28, 24, 21]
</script>

<template>
  <div class="stats">
    <div class="stat">
      <span class="stat__label">Weekly active users</span>
      <strong class="stat__value">1,240</strong>
      <f-sparkline
        :model-value="users"
        color="primary"
        :line-width="3"
        :height="60"
        aria-label="Weekly active users, trending up"
      />
    </div>

    <div class="stat">
      <span class="stat__label">Open tickets</span>
      <strong class="stat__value">21</strong>
      <f-sparkline
        :model-value="tickets"
        color="success"
        :line-width="3"
        :height="60"
        aria-label="Open tickets, trending down"
      />
    </div>
  </div>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
  text-align: start;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 16px;
  border-radius: var(--fui-radius-lg);
  background: rgba(var(--fui-theme-on-surface), 0.04);
}

.stat__label {
  font-size: 0.8125rem;
  opacity: 0.65;
}

.stat__value {
  font-size: 1.5rem;
  margin-bottom: 8px;
}
</style>
