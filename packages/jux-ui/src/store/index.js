// import { omit } from 'ramda'
import ReporterMessageHandlers from '@/store/ReporterMessageHandlers'
import ReporterStatusType from '@/store/ReporterStatusType'
import { assoc } from 'ramda'
import { createStore, createLogger } from 'vuex'

export const ConnectionState = {
  initial: 'initial',
  disconnected: 'disconnected',
  connected: 'connected'
}

const store = createStore({
  plugins: [createLogger()],
  state: {
    connectionState: ConnectionState.initial,

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

    onConnected(state) {
      state.connectionState = ConnectionState.connected
    },
    onDisconnected(state) {
      state.connectionState = ConnectionState.disconnected
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
    onReporterRemoved(state, reporterId) {
      delete state.reporters[reporterId]
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

export default store