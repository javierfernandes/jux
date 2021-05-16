<template>
    <div class="execution_title">{{node.title}}</div>
    <ul class="execution-children">
        <li v-for="child in node.children" :key="child.title">
            <execution-node :node="child" @on-test-selected="onTestSelected" />
        </li>
    </ul>
    <ul class="execution-tests">
        <li v-for="test in node.tests" :key="test.fullName">
            <execution-test :test="test" @on-selected="onTestSelected" />
        </li>
    </ul>
</template>
<script>
    import ExecutionTest from './ExecutionTest'

    export default {
      name: 'ExecutionNode',
      props: ['node'],
      emits: ['onTestSelected'],
      components: {
        ExecutionTest
      },
      methods: {
        onTestSelected(test) {
          this.$emit('onTestSelected', test)
        }
      }
    }
</script>