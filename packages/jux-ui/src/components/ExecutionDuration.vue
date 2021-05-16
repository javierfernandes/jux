<template>
    <span v-if="duration > 0" class="execution-test-duration">{{duration}} ms</span>
</template>
<script>
    export default {
      name: 'ExecutionDuration',
      props: ['duration'],
    }
</script>