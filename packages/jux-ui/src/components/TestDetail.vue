<template>
    <div class="test-detail" v-if="test">

      <div class="test-detail-header">
        <Breadcrumb :home="home" :model="path" />
        <h2 class="test-title">
          <execution-test-status :status="test.status"/>
          {{test?.title || 'should select a test on the left'}}
        </h2>
      </div>

      <div class="test-detail-content">

        <test-detail-section
            v-if="test?.failureMessages?.length > 0"
            title="Error"
        >
          <div v-for="failure in failureMessages" :key="failure.line">
            <div class="test-failure-messages-box">
              <div v-for="line in failure.lines" :key="line">
                <div v-html="line" />
              </div>
            </div>
            <failure-source-code :reporter="reporter" :failure="failure" />
          </div>
        </test-detail-section>

        <test-detail-section
            v-if="test?.failureMessages?.length > 0"
            title="Stack Trace"
        >
          <div v-for="failure in failureMessages" :key="failure.line">
            <div class="stack-trace">
              <stack-trace-frame
                  v-for="frame in failure.stackTrace"
                  :key="frame"
                  :frame="frame"
                  :rootDir="test.rootDir"
              />
            </div>
          </div>
        </test-detail-section>

        <test-detail-section
            v-if="test?.failureMessages?.length > 0"
            title="Raw"
        >
          <vue-json-pretty class="json-content" :data="test" />
        </test-detail-section>

      </div>
    </div>
</template>
<script>
import VueJsonPretty from 'vue-json-pretty'
import Breadcrumb from 'primevue/breadcrumb'
import FailureSourceCode from '@/components/FailureSourceCode'
import ExecutionTestStatus from './ExecutionTestStatus'
import AnsiUp from 'ansi_up'
import * as stackTraceParser from 'stacktrace-parser'
import StackTraceFrame from './StackTraceFrame'
import TestDetailSection from './TestDetailSection'

const converter = new AnsiUp()

export default {
  name: 'TestDetail',
  props: ['reporter', 'test'],
  components: {
    FailureSourceCode,
    StackTraceFrame,
    ExecutionTestStatus,
    Breadcrumb,
    VueJsonPretty,
    TestDetailSection
  },
  methods: {
    parseErrorMessage(msg) {
      return msg.split('\n')
          .map(line => converter.ansi_to_html(line))
          .map(lineDiv => lineDiv.replace('    ', '<i class="tab"/>'))
    },
  },
  computed: {
    home() { return { label: this.test?.ancestorTitles[0] } },
    path() { return this.test?.ancestorTitles.slice(1).map(label => ({ label })) || [] },
    failureMessages() {
      return this.test?.failureDetails?.map(failure => ({
        lines: this.parseErrorMessage(failure.message),
        stackTrace: stackTraceParser.parse(failure.stack)
      }))
    },
  }
}
</script>