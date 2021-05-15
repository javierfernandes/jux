<template>
    <div @click="onSelected">
        <execution-test-status :test="test"/> {{test.title}} <execution-duration :duration="test.duration" />
    </div>
</template>
<script>
  import ExecutionTestStatus from './ExecutionTestStatus'
  import ExecutionDuration from './ExecutionDuration'

  export default {
    name: 'ExecutionTest',
    props: ['test'],
    emits: ['onSelected'],
    components: {
      ExecutionTestStatus,
      ExecutionDuration,
    },
    methods: {
      onSelected() {
        console.log('ExecutionTest.onSelected')
        this.$emit('onSelected', this.test)
      }
    }
  }
</script>