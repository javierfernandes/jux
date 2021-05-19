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

    //
    // service level events
    //

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

    //
    // individual reporter messages
    //
    onReporterMessage(state, { reporterId, message }) {
      const { type, ...payload } = message
      const handler = ReporterMessageHandlers[type]
      if (handler) {
        handler(state, reporterId, payload)
      } else {
        console.log('UNKNOWN MESSAGE FROM REPORTER', reporterId, message)
      }
    },


    clearEvents(state) {
      state.events = []
    },

    // ui state
    onTestSelected(state, test) {
      state.test = test
    },

  }
})

/**
 * Here each member must match the "type" of message sent by reporters
 * A reporter message has this form
 * {
 *   type: 'reporterMessage'
 *   reporter: String // reporterId
 *   data: {
 *     type: 'identifyReporter',    // THIS MUST BE THE NAME OF THE METHOD
 *     ... payload                  // REST is forwarded as second param
 *   }
 * }
 */
const ReporterMessageHandlers = {

  identifyReporter(state, reporterId, { context }) {
    state.reporters[reporterId].context = context
  }

}

export default store