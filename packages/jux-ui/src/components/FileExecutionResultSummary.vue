<template>
  <span class="count-failing">{{result.numFailingTests}}</span>
  <span class="count-pending">{{result.numPendingTests}}</span>
  <span class="count-passed">{{result.numPassingTests}}</span>
</template>
<script>
export default {
  name: 'FileExecutionResultSummary',
  props: ['result']
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