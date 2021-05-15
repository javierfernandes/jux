<template>
    <div class="status-passed" v-if="test.status === 'passed'" />
</template>
<script>
  export default {
    name: 'ExecutionTestStatus',
    props: ['test'],
  }
</script>