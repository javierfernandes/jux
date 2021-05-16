<template>
    <div :class="`execution-title execution-title-${status}`">
      <execution-test-status :status="status"/>
      {{node.title}}
    </div>
    <ul class="execution-children" v-if="node.children.length > 0">
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
    import ExecutionTestStatus from '@/components/ExecutionTestStatus'
    import { statusOf } from '@/model/ExecutionNode'
    import ExecutionTest from './ExecutionTest'

    export default {
      name: 'ExecutionNode',
      props: ['node'],
      emits: ['onTestSelected'],
      components: {
        ExecutionTestStatus,
        ExecutionTest
      },
      methods: {
        onTestSelected(test) {
          this.$emit('onTestSelected', test)
        }
      },
      computed: {
        status() {
          return statusOf(this.node)
        }
      }
    }
</script>