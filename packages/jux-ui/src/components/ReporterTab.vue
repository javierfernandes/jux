<template>
  <Button
      :label="title"
      :class="`p-button-link ${isCurrent && 'selected-reporter-title'}`"
      @click="onSelected"
  />
</template>
<script>
import Button from 'primevue/button'

export default {
  name: 'ReporterTab',
  props: ['reporter', 'is-current'],
  emits: ['onSelected'],
  components: {
    Button,
  },
  methods: {
    onSelected() {
      console.log('ReporterTab on selected !!')
      this.$emit('onSelected', this.reporter)
    }
  },
  computed: {
    title() {
      const rootDir = this.reporter?.context?.globalConfig?.rootDir
      return rootDir ? rootDir.slice(rootDir.lastIndexOf('/') + 1) : this.reporter.id.slice(0, 5)
    }
  }
}
</script>