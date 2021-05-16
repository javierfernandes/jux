<template>
    <div class="test-detail" v-if="test">
        <Breadcrumb :home="home" :model="path" />
        <h2 class="test-title">
            <execution-test-status :test="test" />
            {{test?.title || 'should select a test on the left'}}
        </h2>
        <div v-if="test?.failureMessages?.length > 0" class="test-failure-messages-box">
            <div v-for="message in failureMessages" :key="message">
                <div v-for="line in message" :key="line">
                    <div v-html="line" />
                </div>
            </div>
        </div>
        <pre>{{JSON.stringify(test, null, 2)}}</pre>
    </div>
</template>
<script>
import Breadcrumb from 'primevue/breadcrumb'
import ExecutionTestStatus from './ExecutionTestStatus'
import AnsiUp from 'ansi_up'

const converter = new AnsiUp()

export default {
  name: 'TestDetail',
  props: ['test'],
  components: {
    ExecutionTestStatus,
    Breadcrumb
  },
  methods: {
    parseErrorMessage(msg) {
      return msg.split('\n')
        .map(line => converter.ansi_to_html(line))
        .map(lineDiv => lineDiv.replace('    ', '<i class="tab"/>'))
    }
  },
  computed: {
    home() { return { label: this.test?.ancestorTitles[0] } },
    path() { return this.test?.ancestorTitles.slice(1).map(label => ({ label })) || [] },
    failureMessages() {
      return this.test?.failureMessages?.map(msg => this.parseErrorMessage(msg))
    },
  }
}
</script>