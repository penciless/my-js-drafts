function asyncForEach(array, callback, timeout) {
  if (!callback || !array || array.length <= 0) {
    return [];
  }

  const executions = [];
  var doneFunction = function () {};

  executions.done = function (doneCallback) {
    if (doneCallback && doneCallback.constructor === Function) {
      doneFunction = doneCallback;
    }
  };

  for (var i = 0; i < array.length; i++) {
    const execution = {
      element: array[i],
      next: function () {
        const _this = this;
        setTimeout(function () {
          callback(_this.element);
          if (_this.nextExecution) {
            _this.nextExecution.next();
          } else {
            doneFunction();
          }
        }, timeout || 0);
      }
    };

    const prevExecution = executions[executions.length - 1];
    if (prevExecution) {
      prevExecution.nextExecution = execution;
    }

    executions.push(execution);
  }

  executions[0].next();
  return executions;
}
