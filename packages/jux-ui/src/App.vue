
<template>
  <CommunicationLink @on-message="onEvent" />
  <div class="main-panels">
    <!-- left - current status    -->
    <div>
      <h1>Status</h1>
      State: {{status}}

      <div v-if="result">
        {{result.numPassedTestSuites}} / {{result.numTotalTestSuites}} suites
        {{result.numPassedTests}} / {{result.numTotalTests}} tests
        <ul>
          <li v-for="file in execution.files" :key="file.path">
            <file-execution :file="file" />
          </li>
        </ul>
      </div>
    </div>

    <!-- right - events log    -->
    <div class="eventsLog">
      <h1>Events <span>({{events.length}})</span></h1>
      <button @click="clear">Clear</button>
      <ol>
        <li v-for="event in events" :key="event.timestamp">
          <pre>{{JSON.stringify(event, null, 2) }}</pre>
        </li>
      </ol>
    </div>

  </div>
</template>

<script>
import CommunicationLink from './components/CommunicationLink.vue'
import FileExecution from './components/FileExecution.vue'
// import { omit } from 'ramda'

export default {
  name: 'App',
  components: {
    CommunicationLink,
    FileExecution,
  },
  computed: {
    events() {
      return this.$store.state.events
      // temp hack to avoid cluttering the ui with "context"
      // return this.$store.state.events.map(e => {
      //   return e.test ? {...e, test: omit(['context'], e.test) } : e
      // })
    },
    status() {
      return this.$store.state.status
    },
    execution() {
      return this.$store.state.execution
    },
    result() {
      return this.$store.state.execution?.result
    }
  },
  methods: {
    onEvent(event) {
      this.$store.commit('onEvent', event)
    },
    clear() {
      this.$store.commit('clearEvents')
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

.main-panels {
  display: flex;
  flex-direction: row;
  flex-grow: 1;

  overflow: scroll;
  max-width: 100%;
  border: 1px solid #d8d8f7;
  padding: 1rem;
}
.main-panels > div {
  flex-grow: 0.5;
  overflow: scroll;
}
.main-panels > div:nth-child(1) {
  border-right: 1px solid #d8d8f7;
  padding-right: 0.5rem;
}
.main-panels > div:nth-child(2) {
  padding-left: 0.5rem;
}
.eventsLog {
}

.status-passed {
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  background: green;
  border-radius: 20px;
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
