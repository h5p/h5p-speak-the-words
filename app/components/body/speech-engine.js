export default class SpeechEngine {
  constructor(params, eventStore) {
    const annyang = window.annyang;
    const commands = params.acceptedAnswers.reduce((prev, curr) => {
      prev[curr] = () => {
        eventStore.trigger('answered-correctly');
        this.annyang.abort();
      };
      return prev;
    }, {});

    annyang.addCommands(commands);
    annyang.addCallback('resultNoMatch', (results) => {
      eventStore.trigger('answered-wrong', results);
    });

    // Finished processing result
    annyang.addCallback('result', () => {
      eventStore.trigger('got-result');
    });

    eventStore.on('start-listening', () => {
      this.listening = true;
      this.annyang.resume();
    });

    eventStore.on('stop-listening', () => {
      this.listening = false;
      this.annyang.pause();
    });

    this.annyang = annyang;
    this.annyang.start();
    this.annyang.pause();
    this.listening = false;
  }
}
