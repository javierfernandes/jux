
<template>
  <Dialog header="Oops !" :visible="disconnected" >
    <div class="disconnected-dialog">
      <p>
      We <strong>lost the connection to the JUX Service</strong> !
      Make sure it is running as a service !
      </p>
      <ProgressBar mode="indeterminate"/>
      <div class="reconnecting">Reconnecting...</div>
    </div>
  </Dialog>
  <CommunicationLink
      @on-connected="onConnected"
      @on-disconnected="onDisconnected"
      @on-accept-reporters="onAcceptReporters"
      @on-reporter-added="onReporterAdded"
      @on-reporter-removed="onReporterRemoved"

      @on-reporter-message="onReporterMessage"
  >
    <BlockUI :blocked="disconnected">
      <div class="layout">
        <!--  nav bar  -->
        <div class="layout-top-bar">
          <Header :currentReporterId="currentReporterId" @on-reporter-selected="onReporterSelected"/>
        </div>

        <div class="layout-content">
          <Splitter class="content-splitter">
            <SplitterPanel :size="38" :minSize="20">
              <tests-tree :reporter="currentReporter" @on-test-selected="onTestSelected" />
            </SplitterPanel>
            <SplitterPanel :size="62" :minSize="50">
              <test-detail :reporter="currentReporter" :test="selectedTest" />
            </SplitterPanel>
          </Splitter>
        </div>

      </div>
    </BlockUI>
  </CommunicationLink>
</template>

<script>
import { mapMutations } from 'vuex'
import { head } from 'ramda'
import Splitter from 'primevue/splitter'
import BlockUI from 'primevue/blockui'
import SplitterPanel from 'primevue/splitterpanel'
import Dialog from 'primevue/dialog'
import ProgressBar from 'primevue/progressbar'
import 'vue-json-pretty/lib/styles.css'

import { ConnectionState } from '@/store'
import Header from '@/components/Header'
import CommunicationLink from '@/components/CommunicationLink.vue'
import TestDetail from '@/components/TestDetail'
import TestsTree from '@/components/TestsTree'

export default {
  name: 'App',
  components: {
    Splitter,
    SplitterPanel,
    ProgressBar,
    Dialog,
    BlockUI,

    Header,
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
    currentReporterId() {
      return this.selectedReporter || head(Object.values(this.$store.state.reporters))?.id
    },
    currentReporter() {
      return this.$store.state.reporters[this.currentReporterId]
    },
    selectedTest() {
      return this.$store.state.test
    },
    disconnected() {
      return this.$store.state.connectionState === ConnectionState.disconnected
    }
  },
  methods: {
    //
    onReporterSelected(reporter) {
      this.$data.selectedReporter = reporter.id
    },

    ...mapMutations([
      'onConnected',
      'onDisconnected',
      'onAcceptReporters',
      'onReporterAdded',
      'onReporterRemoved',
      'onReporterMessage',
      'onAcceptReporters',
      // ui
      'onTestSelected'
    ]),
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
  --failed-primary-color: #D32F2F;
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
.content-splitter .p-splitter-panel:nth-child(1) {
  overflow: scroll;
  background: #f3f3f3;
}

.padded-splitter-panel.p-splitter-panel {
  padding: 1rem;
}

.vertical-splitter {
  width: 100%;
}

.disconnected-dialog {
  display: flex;
  flex-direction: column;
}
.disconnected-dialog .p-progressbar {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.disconnected-dialog .reconnecting {
  align-self: center;
}

/** content */

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
.execution-summary .execution-status {
  display: flex;
  justify-content: space-around;
  flex-grow: 1;
}

.file-execution-summary {
  display: flex;
  flex-grow: 1;
  align-items: flex-start;
  justify-content: flex-end;
  padding-right: 1rem;
}
.file-execution-summary > div {
  min-width: 2.4rem;
  display: flex;
  justify-content: space-around;
}

.execution-test-duration {
  color: gray;
  font-size: 0.8rem;
  white-space: nowrap;
}
.execution-test-duration i {
  font-style: normal;
  color: darkgray;
}
.execution-test-duration.execution-test-duration-slow {
  background: #e0e056;
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
  color: var(--failed-primary-color);
}

.execution-title {
  color: gray;
  line-height: 1.5rem;
  display: inline-flex;
}
.execution-title.execution-title-failed {
  color: var(--failed-primary-color);
}
.execution-title .pi-angle-down {
  color: lightgray;
}
.execution-title .counters {
  color: gray;
  padding-left: 1rem;
  font-size: 0.8rem;
}
.execution-title .counters > span {
  padding-right: 1rem;
}
.execution-title .counters .pi {
  padding-right: 0.2rem;
  color: lightgray;
}

.test-detail {
  overflow-y: scroll;
  height: 100%;
}

.test-detail .test-detail-header {
  border-bottom: 4px solid #f8f9fa;
  position: sticky;
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
  padding-left: 2rem;
  padding-right: 2rem;
  height: 100%;
  overflow: scroll;
}
.test-detail .test-title {
  display: flex;
  align-items: center;
  padding-left: 2rem;
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
  margin-bottom: 1rem;

  font-size: 1.1rem;
}
.test-detail .test-failure-messages-box * {
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
  background: var(--failed-primary-color);
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
