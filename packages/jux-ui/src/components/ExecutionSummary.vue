<template>
  <div class="execution-summary">
    <div>{{status}}</div>
    <div class="counters">
      <div class="counter-box failed">{{result.numFailedTests || '-'}} fails</div>
      <div class="counter-box passed">{{result.numPassedTests || '-'}} ok</div>
      <div class="counter-box skipped">{{result.numPendingTests || '-'}} skips</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ExecutionSummary',
  props: ['execution'],
  computed: {
    status() {
      return this.$store.state.status
    },
    result() {
      return this.execution?.result || {}
    }
  }
}
</script>
<style>
.counters {
  display: flex;
}
.counter-box {
  padding: 1rem;
  color: white;
  font-weight: bolder;
}
.counter-box.passed {
  background-color: green;
}
.counter-box.failed {
  background-color: red;
}
.counter-box.skipped {
  background-color: gray;
}
</style>