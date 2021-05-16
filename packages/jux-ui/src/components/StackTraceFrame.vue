<template>
    <div :class="{ 'stack-trace-item': true, 'stack-trace-item-external': isExternalFile }">
        at {{frame.methodName}}
          (<a :href="`webstorm://open?url=file://${frame.file}&line=${frame.lineNumber}`">
            {{filePath}}<span class="file-name">{{fileName}}</span>
          </a>
        <span v-if="frame.lineNumber">: {{frame.lineNumber}}:{{frame.column}}</span>)
    </div>
</template>
<script>
export default {
  name: 'StackTraceFrame',
  props: ['frame', 'rootDir'],
  computed: {
    relativePath() {
      return this.rootDir ? this.frame.file.slice(this.rootDir.length + 1) : this.frame?.file
    },
    fileName() {
      const r = this.relativePath
      return r.slice(r.lastIndexOf('/') + 1)
    },
    filePath() {
      const r = this.relativePath
      return r.slice(0, r.lastIndexOf('/') + 1)
    },
    isExternalFile() {
      return this.frame.file?.indexOf('/node_modules/') >= 0
    }
  }
}
</script>