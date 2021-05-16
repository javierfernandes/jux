import ExecutionStatus from '@/model/ExecutionStatus'

export const statusOf = node => {
  for (const test of node.tests) {
    if (test.status === ExecutionStatus.failed) {
      return ExecutionStatus.failed
    }
  }
  for (const child of node.children) {
    if (statusOf(child) === ExecutionStatus.failed) {
      return ExecutionStatus.failed
    }
  }
  return ExecutionStatus.passed
}