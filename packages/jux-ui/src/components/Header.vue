<template>
  <h2>JUX</h2>
  <div class="reporters-header">
    <div v-for="reporter in reporters" :key="reporter.id">
      <reporter-tab :reporter="reporter" />
      <!--   TODO: fix badge, move to ReporterTab -->
      <Badge
          :value="projectErrors"
          v-if="projectErrors && projectErrors > 0"
          severity="danger"
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
import Badge from 'primevue/badge'

export default {
  name: 'Header',
  components: {
    ReporterTab,
    Events,
    Button,
    Sidebar,
    Badge,
  },
  data() {
    return {
      debugVisible: false,
    }
  },
  computed: {
    projectName() {
      const rootDir = this.$store.state.context?.globalConfig?.rootDir
      return rootDir ? rootDir.slice(rootDir.lastIndexOf('/') + 1) : '< No Project >'
    },
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
</style>