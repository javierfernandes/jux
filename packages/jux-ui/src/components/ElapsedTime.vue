<template>
  <div>{{seconds}} sec</div>
</template>
<script>

export default {
  name: 'ElapsedTime',
  props: ['start'],
  data() {
    return {
      seconds: 0
    }
  },
  mounted() {
    setTimeout(this.updateTime, 1000)
  },
  methods: {
    updateTime() {
      this.seconds += 1
      setTimeout(this.updateTime, 1000)
    }
  }
}
</script>