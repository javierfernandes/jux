<template>
  <Button
      :label="title"
      :class="`p-button-link ${isCurrent && 'selected-reporter-title'}`"
      @click="onSelected"
  />
  <i class="pi pi-spin pi-spinner" v-if="running" />
  <Badge
      :value="failedCount"
      v-if="failedCount > 0"
      severity="danger"
  />
</template>
<script>
import { ReporterStatusType } from '@/store'
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
    failedCount() {
      return this.reporter.execution?.result?.numFailedTests
    },
    running() {
      return this.reporter.status === ReporterStatusType.running
    }
  }
}
</script>