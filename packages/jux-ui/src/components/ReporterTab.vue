<template>
  <Button
      :label="title"
      :class="`p-button-link ${isCurrent && 'selected-reporter-title'}`"
      @click="onSelected"
  />
  <!--   TODO: fix badge-->
  <Badge
      :value="projectErrors"
      v-if="projectErrors && projectErrors > 0"
      severity="danger"
  />
</template>
<script>
import Badge from 'primevue/badge'
import Button from 'primevue/button'

export default {
  name: 'ReporterTab',
  props: ['reporter', 'is-current'],
  emits: ['onSelected'],
  components: {
    Button,
    Badge,
  },
  methods: {
    onSelected() {
      this.$emit('onSelected', this.reporter)
    }
  },
  computed: {
    title() {
      const rootDir = this.reporter?.context?.globalConfig?.rootDir
      return rootDir ? rootDir.slice(rootDir.lastIndexOf('/') + 1) : this.reporter.id.slice(0, 5)
    },
    projectErrors() {
      // TODO: update this must be for our specific reporter
      return this.$store.state.execution?.result.numFailedTests
    },
  }
}
</script>