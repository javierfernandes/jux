<template>
  <h2>JUX</h2>
  <div class="reporters-header">
    <div v-if="reporters.length === 0">
      No Running Instances
    </div>
    <div v-for="reporter in reporters" :key="reporter.id">
      <reporter-tab
          :reporter="reporter"
          @on-selected="onReporterSelected"
          :is-current="reporter.id === currentReporterId"
      />
    </div>
  </div>
  <div class="debug">
    <Button label="debug" class="p-button-link" @click="debugVisible = true" />
  </div>

  <Sidebar v-model:visible="debugVisible" class="p-sidebar-lg events-side-bar" position="top">
    <events />
  </Sidebar>

</template>
<script>
import Events from '@/components/Events'
import ReporterTab from '@/components/ReporterTab'
import Button from 'primevue/button'
import Sidebar from 'primevue/sidebar'

export default {
  name: 'Header',
  props: ['currentReporterId'],
  emits: ['onReporterSelected'],
  components: {
    ReporterTab,
    Events,
    Button,
    Sidebar,
  },
  data() {
    return {
      debugVisible: false,
    }
  },
  methods: {
    onReporterSelected(reporter) {
      this.$emit('onReporterSelected', reporter)
    }
  },
  computed: {
    projectErrors() {
      return this.$store.state.execution?.result.numFailedTests
    },
    reporters() {
      return Object.values(this.$store.state.reporters)
    }
  }
}
</script>
<style>
.events-side-bar {
  overflow: scroll;
}
.debug {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
}
.reporters-header {
  display: flex;
  flex-direction: row;
  padding: 1rem;
}
.reporters-header > div {
  padding-right: 1rem;
}

.reporters-header .selected-reporter-title {
  font-weight: bolder;
}
</style>