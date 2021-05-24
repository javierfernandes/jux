import ReporterMessageType from '@/model/ReporterMessageType'
import FileStatusType from '@/store/FileStatusType'
import ReporterStatusType from '@/store/ReporterStatusType'

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

  [ReporterMessageType.identifyReporter]: (state, reporterId, { context }) => {
    state.reporters[reporterId].context = context
  },

  // test events

  [ReporterMessageType.onRunStart]: (state, reporterId, { aggregatedResults }) => {
    state.reporters[reporterId].status = ReporterStatusType.running
    // make a new execution
    state.reporters[reporterId].execution = {
      startTime: aggregatedResults.startTime,
      numTotalTestSuites: aggregatedResults.numTotalTestSuites,
      files: [],
      result: undefined,
    }
  },

  [ReporterMessageType.onRunComplete]: (state, reporterId, { results }) => {
    state.reporters[reporterId].status = ReporterStatusType.idle
    state.reporters[reporterId].execution.result = results
  },

  [ReporterMessageType.onTestFileStart]: (state, reporterId, { test }) => {
    state.reporters[reporterId].execution.files = [
      ...state.reporters[reporterId].execution.files,
      {
        state: FileStatusType.running,
        ...test
      }
    ]
  },

  [ReporterMessageType.onTestFileResult]: (state, reporterId, { test: { path }, result }) => {
    state.reporters[reporterId].execution.files = state.reporters[reporterId].execution.files.map(file => file.path === path ?
      {
        ...file,
        state: FileStatusType.completed,
        result
      } : file
    )
  },

}

export default ReporterMessageHandlers