<template>
  <div class="execution-summary">
    <div>{{status}}</div>
    <div class="counters">
      <div class="counter-box failed">
        {{result.numFailedTests || '-'}} failed
        <div class="counter-box-bottom-line">{{result.numFailedTestSuites || '-'}} {{failedSuitesLabel}}</div>
      </div>
      <div class="counter-box passed">
        {{result.numPassedTests || '-'}} ok
        <div class="counter-box-bottom-line">{{result.numPassedTestSuites || '-'}} {{passedSuitesLabel}}</div>
      </div>
      <div class="counter-box skipped">{{result.numPendingTests || '-'}} skipped</div>
    </div>
  </div>
</template>
<script>
import pluralize from 'pluralize'

export default {
  name: 'ExecutionSummary',
  props: ['execution'],
  computed: {
    status() {
      return this.$store.state.status
    },
    result() {
      return this.execution?.result || {}
    },
    failedSuitesLabel(){
      return pluralize('suite', this.result.numFailedTestSuites)
    },
    passedSuitesLabel(){
      return pluralize('suite', this.result.numPassedTestSuites)
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
  background-color: var(--failed-text-color);
}
.counter-box.skipped {
  background-color: gray;
}
.counter-box-bottom-line {
  font-size: 0.7rem;
}
</style>