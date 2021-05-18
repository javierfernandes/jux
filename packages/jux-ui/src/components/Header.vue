<template>
  <h2>JUX</h2>
  <div>{{projectName}}</div>
  <div class="debug">
    <Button label="debug" class="p-button-link" @click="debugVisible = true" />
  </div>

  <Sidebar v-model:visible="debugVisible" class="p-sidebar-lg events-side-bar" position="top">
    <events />
  </Sidebar>

</template>
<script>
import Events from '@/components/Events'
import Button from 'primevue/button'
import Sidebar from 'primevue/sidebar'

export default {
  name: 'Header',
  components: {
    Events,
    Button,
    Sidebar,
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
</style>