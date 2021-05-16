<template>
    <h1>Status</h1>
    State: {{status}}

    <div v-if="result">
        {{result.numPassedTestSuites}} / {{result.numTotalTestSuites}} suites
        {{result.numPassedTests}} / {{result.numTotalTests}} tests

        <ul class="test-files">
            <li v-for="file in execution.files" :key="file.path">
                <file-execution :file="file" @on-test-selected="testSelected" />
            </li>
        </ul>
    </div>
</template>
<script>
    import FileExecution from './FileExecution'

    export default {
      name: 'TestsTree',
      emits: ['onTestSelected'],
      components: {
        FileExecution,
      },
      computed: {
        status() {
          return this.$store.state.status
        },
        execution() {
          return this.$store.state.execution
        },
        result() {
          return this.$store.state.execution?.result
        }
      },
      methods: {
        testSelected(test) {
          this.$emit('onTestSelected', test)
        }
      }
    }
</script>
<style>
.test-files {
    list-style: none;
    padding-left: 0;
}

.test-files > li:first-child .file-execution-title {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.test-files > li:last-child .file-execution-title {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}

.file-execution-title {
    line-height: 2rem;
    background: #f3f3f3;
    padding-left: 1rem;
    padding-right: 1rem;

    display: flex;
    justify-content: space-between;
}
</style>