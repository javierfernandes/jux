
<template>
  <CommunicationLink
      @on-message="onEvent"
      @on-disconnected="onDisconnected"
      @on-accept-reporters="onAcceptReporters"
      @on-reporter-added="onReporterAdded"

      @on-reporter-message="onReporterMessage"
  >
    <div class="layout">
      <!--  nav bar  -->
      <div class="layout-top-bar">
        <Header :currentReporterId="currentReporter" @on-reporter-selected="onReporterSelected"/>
      </div>

      <div class="layout-content">
        <Splitter class="content-splitter">
          <SplitterPanel :size="35" :minSize="20">
            <tests-tree @on-test-selected="onTestSelected" />
          </SplitterPanel>
          <SplitterPanel :size="65" :minSize="50">
            <test-detail :test="selectedTest" />
          </SplitterPanel>
        </Splitter>
      </div>

    </div>
  </CommunicationLink>
</template>

<script>
import { head } from 'ramda'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import 'vue-json-pretty/lib/styles.css'

import Header from '@/components/Header'
import CommunicationLink from './components/CommunicationLink.vue'
import TestDetail from './components/TestDetail'
import TestsTree from './components/TestsTree'

export default {
  name: 'App',
  components: {
    Header,
    Splitter,
    SplitterPanel,

    CommunicationLink,
    TestsTree,
    TestDetail,
  },
  data() {
    return {
      selectedReporter: null,
    }
  },
  computed: {
    currentReporter() {
      return this.selectedReporter || head(Object.values(this.$store.state.reporters))?.id
    },
    selectedTest() {
      return this.$store.state.test
    }
  },
  methods: {
    //
    onReporterSelected(reporter) {
      console.log('App.onReporterSelected', reporter)
      this.$data.selectedReporter = reporter.id
    },

    // connection events
    onEvent(event) {
      this.$store.commit('onEvent', event)
    },
    onDisconnected() {
      this.$store.commit('onDisconnected')
    },
    onAcceptReporters(reporters) {
      this.$store.commit('onAcceptReporters', reporters)
    },
    onIdentifyReporter(data) {
      this.$store.commit('onIdentifyReporter', data)
    },
    onReporterAdded(reporter) {
      this.$store.commit('onReporterAdded', reporter)
    },
    onReporterMessage(payload) {
      this.$store.commit('onReporterMessage', payload)
    },
    // ui
    onTestSelected(test) {
      this.$store.commit('onTestSelected', test)
    }
  },
}
</script>

<style>
@font-face {
  font-family: "Raleway";
  src: local("Raleway"),
  url(/fonts/raleway/static/Raleway-Regular.ttf) format("truetype");
}

:root {
  --clickable-hover-color: dodgerblue;
  --failed-text-color: #ea6060;
}

#app {
  font-family: Raleway, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
body {
  margin: 0;
}
body * {
  font-family: Raleway, Avenir, Helvetica, Arial, sans-serif;
}

.p-splitter {
  border: 0;
}

.layout {
  background-color:  #f8f9fa;
}
.layout-top-bar {
  border-bottom: 4px solid transparent;
  display: flex;
  height: 3rem;
  align-items: center;
}
.layout-top-bar h2 {
  margin: 0;
  padding-left: 1rem;
  padding-right: 2rem;
}
.layout-content {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}

.content-splitter {
  height: 93vh;
}
.content-splitter .p-splitter-panel {
  overflow: scroll;
}

.padded-splitter-panel.p-splitter-panel {
  padding: 1rem;
}

.vertical-splitter {
  width: 100%;
}

.execution-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 1rem;

  background: #d2d1d1;

  position: sticky;
  top: 0px;
  z-index: 1;
}

.file-execution-summary {
  display: flex;
  flex-grow: 1;
  justify-content: space-evenly;
}

.execution-test-duration {
  color: gray;
  font-size: 0.8rem;
}

.execution-children {
  padding-inline-start: 1rem;
}
.execution-tests {
  list-style: none;
  padding-inline-start: 1rem;
}
.execution-tests li {
  line-height: 1.5rem;
}

.execution-test {
  display: flex;
  justify-content: space-between;
}
.execution-test:hover {
  cursor: pointer;
  font-weight: bolder;
}
.execution-test-failed {
  color: var(--failed-text-color);
}

.execution-title {
  color: gray;
}
.execution-title.execution-title-failed {
  color: var(--failed-text-color);
}

.test-detail .p-breadcrumb {
  border: 0;
  border-bottom: 2px solid #f8f9fa;
  border-radius: 0;
  font-size: 0.8rem;
  padding: 0.5rem;
}
.test-detail .p-breadcrumb-chevron {
  font-size: 0.5rem;
  color: #c7c7c7;
}

.test-detail-content {
  padding-left: 1rem;
  padding-right: 1rem;
  height: 100%;
  overflow: scroll;
}
.test-detail .test-title {
  display: flex;
  align-items: center;
}
.test-detail .test-title .test-status {
  width: 1rem;
  height: 1rem;
  margin-right: 0.4rem;
}
.test-detail .test-failure-messages-box {
  padding: 1rem;
  background: #ffeeee;
  border-radius: 10px;
  font-family: monospace;
}

.test-status {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 20px;
}
.status-passed {
  background: green;
}
.status-failed {
  background: red;
}
.status-skipped {
  background: gray;
}

/** generic stuff */
.tab {
  padding-left: 2rem;
}

.stack-trace {
  padding-left: 2rem;
  font-family: monospace;
}
.stack-trace-item a {
  color: black;
  text-decoration: none;
}
.stack-trace-item a:hover {
  color: var(--clickable-hover-color)!important;
  text-decoration: none;
}
.stack-trace-item .file-name {
  font-weight: bold;
}
.stack-trace-item-external {
  color: #b9b8b8;
}
.stack-trace-item-external a {
  color: #b9b8b8;
}

#app pre, .json-content {
  background-color: #f3f3f3;
  padding: 0.5rem;
  border-radius: 5px;
  overflow: scroll;
}
.json-content * {
  font-family: monospace;
}
.eventsLog  li {
  text-align: left;
}

.ace_editor {
  border-radius: 5px;
  border: 1px solid lightgray;
}
.ace_editor * {
  font-family: monospace;
}
</style>
