<template>
  <div class="file-execution-summary">
    <test-counter
        icon="pi-exclamation-triangle"
        :count="result.numFailingTests"
        class="count-failing"
        v-if="result.numFailingTests > 0"
    />
    <test-counter
        icon="pi-check"
        :count="result.numPassingTests"
        class="count-passed"
    />

  </div>
</template>
<script>
import TestCounter from './TestCounter'
export default {
  name: 'FileExecutionResultSummary',
  props: ['result'],
  components: {
    TestCounter,
  }
}
</script>
<style>
.count-failing {
  color: var(--failed-primary-color);
}
.count-passed {
  color: green;
}
.count-pending {
  color: gray;
}
</style>