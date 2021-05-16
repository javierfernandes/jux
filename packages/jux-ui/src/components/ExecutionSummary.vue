<template>
  <div class="execution-summary">
    <div>{{status}}</div>
    <div v-if="result">
      {{result.numPassedTestSuites}} / {{result.numTotalTestSuites}} suites
      {{result.numPassedTests}} / {{result.numTotalTests}} tests
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
      return this.execution?.result
    }
  }
}
</script>