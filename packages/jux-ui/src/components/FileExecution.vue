<template>
    <div class="file-execution-title">
        <file-path :path="file.path" :root="file.context.config.rootDir" @toggle="toggle" />
        <span v-if="file.state === 'completed'">
            <execution-duration :duration="file.result.perfStats.runtime" />
        </span>
    </div>

    <div v-if="root && expanded">
        <ul>
            <li v-for="node in root.children" :key="node.title">
                <execution-node :node="node" @on-test-selected="onTestSelected" />
            </li>
        </ul>
    </div>
<!--    <pre>{{JSON.stringify(shortFile, null, 2) }}</pre>-->
</template>

<script>
  import { omit, propEq } from 'ramda'
  import ExecutionNode from './ExecutionNode'
  import ExecutionDuration from './ExecutionDuration'
  import FilePath from './FilePath'

  const createTestsTree = results => {
    // TODO: this should probably be a logic on the state
    const r = results.reduce((node, result) => {
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
          existing.tests.push(result)
        }
        return existing
      }, node)
      return node
    }, {
      title: 'root',
      children: [],
      tests: []
    })
    return r
  }

  export default {
    name: 'FileExecution',
    props: ['file'],
    emits: ['onTestSelected'],
    data() {
      return {
        expanded: true
      }
    },
    components: {
      ExecutionNode,
      ExecutionDuration,
      FilePath,
    },
    computed: {
      shortFile() { return omit(['context'], this.file) },
      root() {
        return this.file.state === 'completed' ?
          createTestsTree(this.file.result.testResults) : undefined
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