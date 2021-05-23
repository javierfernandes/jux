// import { omit } from 'ramda'
import { assoc } from 'ramda'
import { createStore } from 'vuex'

const TestEventType = {

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
       *
       *   execution: {
       *     result: {
       *        numFailedTests: number
       *     }
       *   },
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
        status: ReporterStatusType.idle,
      }, acc), {})
    },
    onReporterAdded(state, reporterId) {
      state.reporters[reporterId] = {
        id: reporterId,
        events: [],
        status: ReporterStatusType.idle,
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
        console.error('UNKNOWN MESSAGE FROM REPORTER', reporterId, message)
      }
    },


    clearEvents(state) {
      state.events = []
    },

    // ui state
    onTestSelected(state, test) {
      state.test = test
    },

  },

  getters: {
  }
})

const ReporterStatusType = {
  running: 'running',
  idle: 'idle'
}

const FileStatusType = {
  running: 'running',
  completed: 'completed'
}

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

  [TestEventType.onRunStart]: (state, reporterId, { aggregatedResults }) => {
    state.reporters[reporterId].status = ReporterStatusType.running
    // make a new execution
    state.reporters[reporterId].execution = {
      startTime: aggregatedResults.startTime,
      numTotalTestSuites: aggregatedResults.numTotalTestSuites,
      files: [],
      result: undefined,
    }
  },

  [TestEventType.onRunComplete]: (state, reporterId, { results }) => {
    state.reporters[reporterId].status = ReporterStatusType.idle
    state.reporters[reporterId].execution.result = results
  },

  [TestEventType.onTestFileStart]: (state, reporterId, { test }) => {
    state.reporters[reporterId].execution.files = [
      ...state.reporters[reporterId].execution.files,
      {
        state: FileStatusType.running,
        ...test
      }
    ]
  },

  [TestEventType.onTestFileResult]: (state, reporterId, { test: { path }, result }) => {
    state.reporters[reporterId].execution.files = state.reporters[reporterId].execution.files.map(file => file.path === path ?
      {
        ...file,
        state: FileStatusType.completed,
        result
      } : file
    )
  },

}

export default store