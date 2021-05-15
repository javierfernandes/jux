<template>
    <execution-test-status :test="test"/> {{test.title}} <execution-duration :duration="test.duration" />
</template>
<script>
  import ExecutionTestStatus from './ExecutionTestStatus'
  import ExecutionDuration from './ExecutionDuration'

  export default {
    name: 'ExecutionTest',
    props: ['test'],
    components: {
      ExecutionTestStatus,
      ExecutionDuration,
    }
  }
</script>