<template>
  {{title}}
</template>
<script>
export default {
  name: 'ReporterTab',
  props: ['reporter'],
  computed: {
    title() {
      const rootDir = this.reporter?.context?.globalConfig?.rootDir
      return rootDir ? rootDir.slice(rootDir.lastIndexOf('/') + 1) : this.reporter.id.slice(0, 5)
    }
  }
}
</script>