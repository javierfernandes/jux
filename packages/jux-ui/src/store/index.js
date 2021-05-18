// import { omit } from 'ramda'
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
    context: null,
    events: [],
    execution: null,
    status: 'idle',

    test: null,
  },
  mutations: {
    onEvent(state, event) {
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

    // ui state
    onTestSelected(state, test) {
      state.test = test
    }
  }
})

export default store