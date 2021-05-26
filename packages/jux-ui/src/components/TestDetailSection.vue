<template>
  <div >
    <h4>
      <i class="pi pi-angle-down" @click="toggle" />
      {{ title }}
    </h4>

    <slot v-if="expanded" />
  </div>
</template>
<script>
export default {
  name: 'TestDetailSection',
  props: ['title'],
  data() {
    return {
      expanded: true,
    }
  },
  methods: {
    toggle() { this.expanded = !this.expanded }
  }
}
</script>