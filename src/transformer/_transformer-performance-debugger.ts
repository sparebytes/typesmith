type EventData = [number, number];
export class TransformerPerformanceDebugger {
  private eventLog = new Map<string, EventData>();
  private timer: any = null;

  constructor(public defaultPrinterSleepTime: number) {}

  resetEventLog() {
    this.eventLog = new Map<string, EventData>();
  }

  getEventLog(reset: boolean = false) {
    const result = this.eventLog;
    if (reset) this.resetEventLog();
    return result;
  }

  logEvent(thing: string, time: number) {
    const eventData = this.eventLog.get(thing);
    if (eventData == null) {
      this.eventLog.set(thing, [1, time]);
    }
    else {
      eventData[0] += 1;
      eventData[1] += time;
    }
  }

  startEventPrinter(sleep: number = this.defaultPrinterSleepTime) {
    this.stopEventPrinter();
    this.timer = setInterval(() => {
      this.printNow();
    }, sleep);
  }

  stopEventPrinter() {
    if (this.timer != null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.printNow();
  }

  printNow() {
    const logs = this.getEventLog(false);
    if (logs.size > 0) {
      // console.log(`# ${logs.size} thing(s) happened:`);
      for (const [thing, [count, time]] of logs) {
        console.log(`${thing}: ${time} / ${count} = ${time / count}mg (avg)`);
      }
    }
  }
}
