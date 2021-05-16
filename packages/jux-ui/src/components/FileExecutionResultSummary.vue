<template>
  <span class="count-failing">{{result.numFailingTests}}</span>
  <span class="count-skipped">{{result.numFailingTests}}</span>
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
  color: red;
}
.count-passed {
  color: green;
}
.count-skipped {
  color: gray;
}
</style>