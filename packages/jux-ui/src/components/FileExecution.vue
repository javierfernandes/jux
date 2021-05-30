<template>
    <div class="file-execution-title">
        <file-path
            :class="`file-path ${isFailed ? 'file-path-failed' : ''}`"
            :path="file.path"
            @toggle="toggle"
        />

        <i v-if="isRunning" class="pi pi-spin pi-spinner" />

        <file-execution-result-summary v-if="!isRunning" :result="file.result" />
        <execution-duration
            v-if="!isRunning"
            :duration="file.result.perfStats.runtime"
            :slow="file.result.perfStats.slow"
        />
    </div>

    <div v-if="root && expanded" class="file-execution-elements">
        <ul>
            <li v-for="node in root.children" :key="node.title">
                <execution-node :node="node" @on-test-selected="onTestSelected" />
            </li>
        </ul>
    </div>
</template>

<script>
  import FileStatusType from '@/store/FileStatusType'
  import { propEq } from 'ramda'
  import ExecutionNode from './ExecutionNode'
  import ExecutionDuration from './ExecutionDuration'
  import FileExecutionResultSummary from '@/components/FileExecutionResultSummary'
  import FilePath from './FilePath'

  const createTestsTree = (rootDir, results) => {
    // TODO: this should probably be a logic on the state
    return results.reduce((node, result) => {
      result.ancestorTitles.reduce((parent, ancestor, i) => {
        let existing = parent.children.find(propEq('title', ancestor))
        if (!existing) {
          existing = {
            title: ancestor,
            children: [],
            tests: [],
          }
          parent.children.push(existing)
        }
        if (i === result.ancestorTitles.length - 1) {
          existing.tests.push({
            // this is probably a hack ! we should have rootDir in the store
            // as a context value for the current project/test runner
            rootDir,
            ...result
          })
        }
        return existing
      }, node)
      return node
    }, {
      title: 'root',
      children: [],
      tests: []
    })
  }

  export default {
    name: 'FileExecution',
    props: ['file'],
    emits: ['onTestSelected'],
    inject: ['rootDir'],
    data() {
      return {
        expanded: false
      }
    },
    components: {
      FileExecutionResultSummary,
      ExecutionNode,
      ExecutionDuration,
      FilePath,
    },
    computed: {
      isCompleted() {
        return this.file.state === FileStatusType.completed
      },
      root() {
        return this.isCompleted ?
          createTestsTree(this.rootDir.value, this.file.result.testResults) : undefined
      },
      isRunning() {
        return this.file.state === FileStatusType.running
      },
      isFailed() {
        return this.isCompleted && this.file.result?.numFailingTests > 0
      }
    },
    methods: {
      toggle() {
        this.expanded = !this.expanded
      },
      onTestSelected(test) {
        this.$emit('onTestSelected', test)
      }
    }
  }
</script>