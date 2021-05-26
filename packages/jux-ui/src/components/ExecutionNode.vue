<template>
    <div :class="`execution-title execution-title-${status}`">
      <i class="pi pi-angle-down" @click="toggle" />
      {{node.title}}
      <div v-if="!expanded" class="counters">
        <span v-if="node.children.length > 0"><i class="pi pi-folder" /> {{node.children.length}}</span>
        <span v-if="allTests.length > 0"><i class="pi pi-flag" />{{allTests.length}}</span>
      </div>
    </div>
    <ul class="execution-children" v-if="node.children.length > 0 && expanded">
        <li v-for="child in node.children" :key="child.title">
            <execution-node :node="child" @on-test-selected="onTestSelected" />
        </li>
    </ul>
    <ul class="execution-tests" v-if="expanded">
        <li v-for="test in node.tests" :key="test.fullName">
            <execution-test :test="test" @on-selected="onTestSelected" />
        </li>
    </ul>
</template>
<script>
import { statusOf } from '@/model/ExecutionNode'
import ExecutionTest from './ExecutionTest'

export default {
  name: 'ExecutionNode',
  props: ['node'],
  emits: ['onTestSelected'],
  components: {
    ExecutionTest
  },
  data() {
    return {
      expanded: true,
    }
  },
  methods: {
    onTestSelected(test) {
      this.$emit('onTestSelected', test)
    },
    toggle() { this.expanded = !this.expanded }
  },
  computed: {
    status() {
      return statusOf(this.node)
    },
    allTests() {
      return allChildren(this.node)
    }
  }
}

const allChildren = node => {
  const descendants = node.children.reduce((acc, test) => {
    acc.push(...allChildren(test))
    return acc
  }, [])
  return [
      ...node.tests,
      ...descendants
  ]
}
</script>