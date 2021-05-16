<template>
    <div class="test-status status-passed" v-if="status === 'passed'" />
    <div class="test-status status-failed" v-if="status === 'failed'" />
</template>
<script>
  export default {
    name: 'ExecutionTestStatus',
    props: ['status'],
  }
</script>