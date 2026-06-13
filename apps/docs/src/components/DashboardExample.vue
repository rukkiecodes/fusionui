<script setup lang="ts">
import { FLineChart } from '@fusionui/vue'

const stats = [
  { label: 'Revenue', value: '$48.2k', delta: '+12.4%', up: true, icon: 'dollar-sign' },
  { label: 'Active users', value: '3,914', delta: '+4.1%', up: true, icon: 'users' },
  { label: 'Churn', value: '1.8%', delta: '-0.6%', up: false, icon: 'trending-down' },
  { label: 'Latency', value: '128ms', delta: '-9ms', up: false, icon: 'zap' },
]

const revenue = [
  { x: 'Mon', y: 32 },
  { x: 'Tue', y: 41 },
  { x: 'Wed', y: 38 },
  { x: 'Thu', y: 52 },
  { x: 'Fri', y: 49 },
  { x: 'Sat', y: 61 },
  { x: 'Sun', y: 58 },
]

const activity = [
  { who: 'Ada', what: 'upgraded to Pro', when: '2m', color: 'success' },
  { who: 'Lin', what: 'opened a ticket', when: '18m', color: 'warning' },
  { who: 'Sam', what: 'invited 3 teammates', when: '1h', color: 'primary' },
  { who: 'Noa', what: 'cancelled trial', when: '3h', color: 'danger' },
]
</script>

<template>
  <div class="dash">
    <div class="dash__stats">
      <f-card v-for="s in stats" :key="s.label" class="dash__stat">
        <div class="dash__stat-head">
          <span class="dash__stat-label">{{ s.label }}</span>
          <f-icon :icon="s.icon" size="small" />
        </div>
        <strong class="dash__stat-value">{{ s.value }}</strong>
        <f-chip size="small" :color="s.up ? 'success' : 'danger'" variant="tonal">{{
          s.delta
        }}</f-chip>
      </f-card>
    </div>

    <div class="dash__main">
      <f-card class="dash__chart">
        <div class="dash__card-head">
          <strong>Revenue</strong>
          <f-btn size="small" variant="tonal" color="primary" append-icon="arrow-right"
            >This week</f-btn
          >
        </div>
        <f-line-chart
          :data="revenue"
          curve="monotone"
          area
          :tick-count="5"
          label="Weekly revenue"
          style="height: 220px"
        />
      </f-card>

      <f-card class="dash__activity">
        <div class="dash__card-head"><strong>Activity</strong></div>
        <ul class="dash__list">
          <li v-for="a in activity" :key="a.who" class="dash__item">
            <f-avatar size="small" :color="a.color">{{ a.who[0] }}</f-avatar>
            <span class="dash__item-text"
              ><strong>{{ a.who }}</strong> {{ a.what }}</span
            >
            <span class="dash__item-when">{{ a.when }}</span>
          </li>
        </ul>
      </f-card>
    </div>
  </div>
</template>

<style scoped>
.dash {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 16px 0;
}
.dash__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}
.dash__stat {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  padding: 16px;
}
.dash__stat-head {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  opacity: 0.7;
}
.dash__stat-label {
  font-size: 13px;
  font-weight: 500;
}
.dash__stat-value {
  font-size: 26px;
}
.dash__main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}
@media (max-width: 760px) {
  .dash__main {
    grid-template-columns: 1fr;
  }
}
.dash__chart,
.dash__activity {
  padding: 16px;
}
.dash__card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.dash__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.dash__item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dash__item-text {
  font-size: 14px;
  flex: 1;
  min-width: 0;
}
.dash__item-when {
  font-size: 12px;
  opacity: 0.5;
}
</style>
