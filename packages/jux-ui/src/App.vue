
<template>
  <CommunicationLink @on-message="onEvent" />

  <Splitter class="content-splitter">
    <SplitterPanel :size="35" :minSize="20">
      <tests-tree @on-test-selected="onTestSelected" />
    </SplitterPanel>
    <SplitterPanel :size="80" :minSize="50">
      <Splitter layout="vertical">
        <SplitterPanel>
          <test-detail :test="selectedTest" />
        </SplitterPanel>
        <SplitterPanel :size="20">
          <events />
        </SplitterPanel>
      </Splitter>
    </SplitterPanel>
  </Splitter>

</template>

<script>
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'

import CommunicationLink from './components/CommunicationLink.vue'
import TestDetail from './components/TestDetail'
import TestsTree from './components/TestsTree'
import Events from './components/Events'

export default {
  name: 'App',
  components: {
    Splitter,
    SplitterPanel,

    CommunicationLink,
    TestsTree,
    Events,
    TestDetail,
  },
  methods: {
    onEvent(event) {
      this.$store.commit('onEvent', event)
    },
    onTestSelected(test) {
      this.$store.commit('onTestSelected', test)
    }
  },
  computed: {
    selectedTest() {
      return this.$store.state.test
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 1rem;
}

.content-splitter {
  border: 1px solid #d8d8f7;
  height: 95vh;
}
.content-splitter .p-splitter-panel {
  padding: 1rem;
  overflow: scroll;
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
.execution-test-failed {
  color: #ea6060;
}
.execution-test .test-status {
  margin-right: 0.4rem;
}

.execution_title {
  color: gray;
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
}
.tab {
  padding-left: 2rem;
}

#app pre {
  background-color: #f3f3f3;
  padding: 0.5rem;
  border-radius: 5px;
  overflow: scroll;
}
.eventsLog  li {
  text-align: left;
}
</style>
