<template>
    <div @click="onSelected" :class="`execution-test execution-test-${test.status}`">
        <div>
            <execution-test-status :test="test"/>
            {{test.title}}
        </div>
        <execution-duration :duration="test.duration" />
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
        this.$emit('onSelected', this.test)
      }
    }
  }
</script>