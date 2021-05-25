<template>
  <div class="execution-status">
    <i v-if="isRunning" class="pi pi-spin pi-spinner" />
    {{reporter?.status}}
    <elapsed-time v-if="isRunning && reporter?.execution?.startTime" start="reporter?.execution?.startTime" />
  </div>
</template>
<script>
import ElapsedTime from '@/components/ElapsedTime'
import ReporterStatusType from '@/store/ReporterStatusType'

export default {
  name: 'ExecutionStatus',
  props: ['reporter'],
  components: {
    ElapsedTime,
  },
  computed: {
    isRunning() {
      return this.reporter?.status === ReporterStatusType.running
    }
  }
}
</script>