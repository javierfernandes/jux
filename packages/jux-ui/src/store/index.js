// import { omit } from 'ramda'
import { assoc } from 'ramda'
import { createStore } from 'vuex'

const EventType = {
  onRunStart: 'onRunStart',
  onRunComplete: 'onRunComplete',
  onTestFileStart: 'onTestFileStart',
  onTestFileResult: 'onTestFileResult',
}

const store = createStore({
  state: {
    connectionState: 'disconnected',

    // { id: String -> Reporter }
    reporters: {
      /*
       * Reporter {
       *   id: String
       *   context: { options, globalConfig } // Jest pure data
       *   status: 'idle',
       *   events: [],
       *   execution: null,
       *
       *   context: null,
       * }
       */
    },

    // the currently selected test from the left (maybe this must be a component state and not here in the store)
    // it is UI
    test: null,
  },
  mutations: {
    onEvent(state, event) {
      console.log('[Store] onEvent', event)
      state.events = [...state.events, event]

      switch(event.type) {
        case EventType.onRunStart: {
          state.status = 'running'
          // make a new execution
          state.execution = {
            startTime: event.aggregatedResults.startTime,
            numTotalTestSuites: event.aggregatedResults.numTotalTestSuites,
            files: []
          }
          break
        }
        case EventType.onRunComplete: {
          state.status = 'idle'
          state.execution.result = event.results
          break
        }
        case EventType.onTestFileStart: {
          state.execution.files = [
            ...state.execution.files,
            {
              state: 'running',
              ...event.test
              // ...omit(['context'], event.test)
            }
          ]
          break
        }
        case EventType.onTestFileResult: {
          const { test: { path }, result } = event
          state.execution.files = state.execution.files.map(file => file.path === path ?
              {
                ...file,
                state: 'completed',
                result
              } : file
          )
          break
        }
      }
    },
    clearEvents(state) {
      state.events = []
    },
    onConnected(state, context) {
      state.connectionState = 'connected'
      state.context = context
    },
    onDisconnected(state) {
      state.connectionState = 'disconnected'
    },
    onAcceptReporters(state, reporters) {
      // TODO: make a factory fn / constructor to setup Reporter fields
      state.reporters = reporters.reduce((acc, reporter) => assoc(reporter.id, reporter, acc), {})
    },
    onReporterAdded(state, reporterId) {
      // TODO: make a factory fn / constructor to setup Reporter fields
      state.reporters[reporterId] = {
        id: reporterId
      }
    },
    onIdentifyReporter(state, { reporterId, context }) {
      state.reporters[reporterId].context = context
    },
    // ui state
    onTestSelected(state, test) {
      state.test = test
    }
  }
})

export default store