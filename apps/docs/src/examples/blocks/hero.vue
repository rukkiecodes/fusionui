<template>
  <f-hero>
    <f-eyebrow dot text="Meridian 3.0 is in public beta" />

    <h1 class="hero__title">Ship on Friday without holding your breath.</h1>

    <p class="hero__lede">
      Meridian watches every deploy, catches the regression before your users do, and rolls back
      automatically in under ten seconds. Point it at your cluster and you're live in an afternoon.
    </p>

    <div class="hero__actions">
      <f-btn color="primary" size="large" append-icon="arrow-right">Start free</f-btn>
      <f-btn variant="outlined" size="large">Book a demo</f-btn>
    </div>

    <p class="hero__note">No credit card required · 14-day trial · SOC 2 Type II</p>

    <template #visual>
      <f-stat icon="activity" value="99.98%" label="Median uptime across 4,200 services" />
      <f-stat icon="zap" value="8.4s" label="Average automatic rollback" color="success" />
      <f-stat icon="users" value="12,000+" label="Engineers deploying with Meridian" />
    </template>
  </f-hero>
</template>

<style scoped>
.hero__title {
  margin: 20px 0 0;
  font-size: clamp(2rem, 4.4vw, 3.2rem);
  line-height: 1.08;
  letter-spacing: -0.03em;
  font-weight: 700;
}

.hero__lede {
  margin: 20px 0 0;
  width: 100%;
  max-width: 34em;
  font-size: 1.05rem;
  line-height: 1.6;
  opacity: 0.72;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.hero__note {
  margin: 20px 0 0;
  font-size: 0.85rem;
  opacity: 0.6;
}
</style>
