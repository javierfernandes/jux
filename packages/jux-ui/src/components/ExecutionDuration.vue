<template>
    <span
        v-if="duration > 0"
        :class="`execution-test-duration ${slow ? 'execution-test-duration-slow' : ''} `">
      {{duration.toLocaleString()}} <i>ms</i>
    </span>
</template>
<script>
    export default {
      name: 'ExecutionDuration',
      props: ['duration', 'slow'],
    }
</script>