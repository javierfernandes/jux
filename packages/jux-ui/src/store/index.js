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
      state.reporters = reporters.reduce((acc, reporter) => assoc(reporter.id, {
        ...reporter,
        events: [],
        status: 'idle',
      }, acc), {})
    },
    onReporterAdded(state, reporterId) {
      state.reporters[reporterId] = {
        id: reporterId,
        events: [],
        status: 'idle',
      }
    },

    //
    // individual reporter messages
    //
    onReporterMessage(state, { reporterId, message }) {
      const { type, ...payload } = message

      // keep a record of all messages (maybe just for debugging or development)
      state.reporters[reporterId].events.push(message)

      // now handle each individually
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
  },

  onRunStart(state, reporterId, { aggregatedResults }) {
    state.reporters[reporterId].status = 'running'
    // make a new execution
    state.reporters[reporterId].execution = {
      startTime: aggregatedResults.startTime,
      numTotalTestSuites: aggregatedResults.numTotalTestSuites,
      files: []
    }
  }

}

export default store