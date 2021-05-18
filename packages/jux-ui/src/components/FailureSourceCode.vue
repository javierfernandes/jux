<template>
  <div class="sourcecode">
    <pre>
      {{state.fileContent}}
    </pre>
  </div>
</template>
<script>

import { getCurrentInstance, onMounted, reactive } from 'vue'

export default {
  name: 'FailureSourceCode',
  props: ['failure'],
  inject: ['request'],
  setup() {
    const state = reactive({
      fileContent: null,
    })
    onMounted(async () => {
      const instance = getCurrentInstance()
      const { file, lineNumber, column } = instance.props.failure.stackTrace[0]
      // TODO: use a proxy to make requests !
      const content = await instance.ctx.request({ type: 'fetchSourceCode', file, lineNumber, column })
      const lines = content.split('\n')
      // TODO: careful with boundaries
      state.fileContent = lines.slice(lineNumber - 3, lineNumber + 3).join('\n')

    })
    return {
      state
    }
  },
}
</script>