<template>
    <execution-summary :reporter="reporter" />

    <div>
        <ul class="test-files">
            <li v-for="file in execution?.files" :key="file.path">
                <file-execution :file="file" @on-test-selected="testSelected" />
            </li>
        </ul>
    </div>
</template>
<script>
    import { computed } from 'vue'
    import ExecutionSummary from '@/components/ExecutionSummary'
    import FileExecution from './FileExecution'

    export default {
      name: 'TestsTree',
      props: ['reporter'],
      emits: ['onTestSelected'],
      components: {
        ExecutionSummary,
        FileExecution,
      },
      computed: {
        execution() {
          return this.reporter?.execution
        },
        result() {
          return this.execution?.result
        }
      },
      provide() {
        const rootDir = computed(() => this.reporter?.context.globalConfig.rootDir)
        console.log('Providing rootDir', rootDir)
        return {
          rootDir,
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
  margin-top: 0;
  list-style: none;
  padding-left: 0;
}
.test-files ul, .test-files ol {
  list-style: none;
  padding-left: 1.5rem;
}
.test-files > li:not(:first-child) {
  border-top: 1px solid #c1c1c1;
}

.test-files .test-status {
  margin-right: 0.4rem;
}


.test-files > li:first-child .file-execution-title {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.test-files > li:last-child .file-execution-title {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

/* FileExecution */

.file-execution-title {
  line-height: 2rem;
  background: #f3f3f3;
  padding-left: 1rem;

  display: flex;
  /*justify-content: space-between;*/
}
.file-execution-title .file-path {
  flex-grow: 1;
}
.file-execution-title .file-path.file-path-failed {
  color: var(--failed-primary-color);
}
.file-execution-title .pi-spinner {
  width: 1rem;
  height: 1rem;
  align-self: center;
  color: darkgray;
  margin-right: 0.5rem;
}

.file-execution-title .execution-test-duration {
  padding-right: 1rem;
  /*padding-left: 1rem;*/
  text-align: right;
  min-width: 5rem;
}

.file-execution-elements {
  background-color: white;
  padding-right: 0.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-left: 0.4rem;
}
.file-execution-elements .no-elements {
  margin-left: 2rem;
  font-size: 0.9rem;
  color: gray;
}
</style>