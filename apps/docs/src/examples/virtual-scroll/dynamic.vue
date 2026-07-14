<script setup>
const authors = ['Lana Steiner', 'Drew Cano', 'Candice Wu', 'Natali Craig', 'Koray Okumus']
const bodies = [
  'Shipped.',
  'This looks right to me — the fixed header keeps its shadow now.',
  'I pulled the branch and ran it against the staging data set. Sorting by two columns is instant, but the group headers flicker on the first paint. Worth a look before we tag it.',
  'Nit: the empty state copy should say “invoices”, not “items”.',
  'Agreed. I also think we should keep the select-all scoped to the page by default — reaching across every filtered row surprised two people in the usability round, and the indeterminate state is doing a lot of work to explain it.',
]

// No `item-height`: each row is measured after it renders, so wildly different
// comment lengths still produce a correct scrollbar.
const comments = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  author: authors[i % authors.length],
  body: bodies[i % bodies.length],
}))
</script>

<template>
  <div class="w">
    <f-virtual-scroll :items="comments" item-key="id" :estimated-item-height="90" height="340">
      <template #default="{ item }">
        <article class="comment">
          <strong>{{ item.author }}</strong>
          <p>{{ item.body }}</p>
        </article>
      </template>
    </f-virtual-scroll>
  </div>
</template>

<style scoped>
.w {
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
  border: 1px solid rgba(var(--fui-theme-on-surface), 0.12);
  border-radius: var(--fui-radius-md);
}

.comment {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(var(--fui-theme-on-surface), 0.08);
  text-align: start;
}

.comment p {
  margin: 4px 0 0;
  font-size: 0.875rem;
  opacity: 0.75;
  line-height: 1.5;
}
</style>
