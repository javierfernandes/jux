<template>
    <span v-if="duration > 0" class="execution-test-duration">{{duration.toLocaleString()}} ms</span>
</template>
<script>
    export default {
      name: 'ExecutionDuration',
      props: ['duration'],
    }
</script>