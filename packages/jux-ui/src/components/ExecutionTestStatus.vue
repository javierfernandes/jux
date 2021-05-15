<template>
    <div class="test-status status-passed" v-if="test.status === 'passed'" />
    <div class="test-status status-failed" v-if="test.status === 'failed'" />
</template>
<script>
  export default {
    name: 'ExecutionTestStatus',
    props: ['test'],
  }
</script>
<style>
    .test-status {
        display: inline-block;
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 20px;
    }
    .status-passed {
        background: green;
    }
    .status-failed {
        background: red;
    }
</style>