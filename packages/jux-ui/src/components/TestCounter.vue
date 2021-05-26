<template>
  <div :class="`test-counter ${this.class}`">
    <i :class="`pi ${icon}`" />
    <span>{{count}}</span>
  </div>
</template>
<script>
export default {
  name: 'TestCounter',
  props: ['icon', 'count']
}
</script>
<style>
.test-counter {
  text-align: center;
  display: flex;
  align-items: center;
  width: 2rem;
  justify-content: space-between;
}
</style>