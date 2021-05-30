
export const isFailed = fileExecution => {
  return (
      fileExecution.result?.numFailingTests > 0
      || fileExecution.result?.testExecError
    )
}