<template>
    <span class="execution-test-duration">{{duration}} ms</span>
</template>
<script>
    export default {
      name: 'ExecutionDuration',
      props: ['duration'],
    }
</script>