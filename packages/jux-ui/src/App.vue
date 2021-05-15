
<template>
  <CommunicationLink @on-message="onEvent" />

  <Splitter class="content-splitter">
    <SplitterPanel>
      <tests-tree @on-test-selected="onTestSelected" />
    </SplitterPanel>
    <SplitterPanel>
      <Splitter layout="vertical">
        <SplitterPanel>
          TEST
          <pre v-if="selectedTest">{{JSON.stringify(selectedTest, null, 2)}}</pre>
        </SplitterPanel>
        <SplitterPanel>
          <events />
        </SplitterPanel>
      </Splitter>
    </SplitterPanel>
  </Splitter>

</template>

<script>
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'

import TestsTree from './components/TestsTree'
import CommunicationLink from './components/CommunicationLink.vue'
import Events from './components/Events'

export default {
  name: 'App',
  components: {
    Splitter,
    SplitterPanel,

    CommunicationLink,
    TestsTree,
    Events,
  },
  methods: {
    onEvent(event) {
      this.$store.commit('onEvent', event)
    },
    onTestSelected(test) {
      console.log('App.onTestSelected')
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
.execution-tests {
  list-style: none;
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
