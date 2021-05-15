<template>
    {{node.title}}
    <ul class="execution-children">
        <li v-for="child in node.children" :key="child.title">
            <execution-node :node="child" />
        </li>
    </ul>
    <ul class="execution-tests">
        <li v-for="test in node.tests" :key="test.fullName">
            <execution-test :test="test" />
        </li>
    </ul>
</template>
<script>
    import ExecutionTest from './ExecutionTest'

    export default {
      name: 'ExecutionNode',
      props: ['node'],
      components: {
        ExecutionTest
      }
    }
</script>