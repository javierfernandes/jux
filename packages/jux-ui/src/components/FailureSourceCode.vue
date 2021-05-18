<template>
  <div class="sourcecode">
    <v-ace-editor
        v-if="state.fileContent"
        v-model:value="state.fileContent"
        @init="editorInit"
        readonly
        lang="javascript"
        theme="chrome"
        style="height: 200px"
    />
  </div>
</template>
<script>

import { getCurrentInstance, onMounted, reactive } from 'vue'
import { VAceEditor } from 'vue3-ace-editor'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-chrome'

export default {
  name: 'FailureSourceCode',
  props: ['failure'],
  inject: ['request'],
  components: {
    VAceEditor
  },
  setup() {
    const state = reactive({
      fileContent: null,
    })
    onMounted(async () => {
      const instance = getCurrentInstance()
      const { file } = instance.props.failure.stackTrace[0]
      // TODO: use a proxy to make requests !
      // TODO: handle errors
      state.fileContent = await instance.ctx.request({ type: 'fetchSourceCode', file })
    })
    return {
      state
    }
  },
  methods: {
    editorInit(editor) {
      const { lineNumber, column } = this.failure.stackTrace[0]
      editor.resize(true)
      editor.scrollToLine(lineNumber, true, false, function () {})
      editor.gotoLine(lineNumber, column, false)
      editor.selection.selectLine()
    }
  }
}
</script>
<style>
.sourcecode {
  margin-bottom: 1rem;
}
</style>