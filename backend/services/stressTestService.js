const { Worker, isMainThread, parentPort } = require('worker_threads');

let stressWorker = null;
let isStressing = false;

// If we are in the worker thread, run a busy loop
if (!isMainThread) {
  // A tight loop to consume CPU
  let i = 0;
  while (true) {
    i++;
    // Add memory allocations to simulate memory stress
    if (i % 100000 === 0) {
      const arr = new Array(10000).fill('stress');
      // Briefly pause to prevent complete system lockup, allowing parent port messages
      if (i % 10000000 === 0) {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1);
      }
    }
  }
}

const startStressTest = () => {
  if (isStressing) return false;
  
  stressWorker = new Worker(__filename);
  isStressing = true;
  return true;
};

const stopStressTest = () => {
  if (!isStressing) return false;
  
  stressWorker.terminate();
  stressWorker = null;
  isStressing = false;
  return true;
};

const getStressStatus = () => isStressing;

module.exports = {
  startStressTest,
  stopStressTest,
  getStressStatus
};
