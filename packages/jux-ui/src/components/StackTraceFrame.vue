<template>
    <div class="stack-trace-item">
        at {{frame.methodName}}
        <a :href="`webstorm://open?url=file://${frame.file}&line=${frame.lineNumber}`">({{frame.file}}</a>
        <span v-if="frame.lineNumber">: {{frame.lineNumber}}:{{frame.column}}</span> )
    </div>
</template>
<script>
export default {
  name: 'StackTraceFrame',
  props: ['frame']
}
</script>