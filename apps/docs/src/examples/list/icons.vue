<template>
  <div class="w">
    <f-list>
      <f-list-item
        link
        prepend-icon="user"
        append-icon="$next"
        title="Profile"
        subtitle="Name, photo, public handle"
      />
      <f-list-item
        link
        prepend-icon="lock"
        append-icon="$next"
        title="Security"
        subtitle="Password and two-factor auth"
      />
      <f-list-item
        link
        prepend-icon="credit-card"
        append-icon="$next"
        title="Billing"
        subtitle="Plan, invoices, payment method"
      />
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
