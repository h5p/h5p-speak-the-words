export default class SpeechEngine {
  constructor(params, eventStore) {
    this.eventStore = eventStore;
    this.annyang = window.annyang;
    this.listening = false;
    this.commands = this.getCommands(params.acceptedAnswers);

    this.eventStore.on('start-listening', () => {
      this.init();
    });

    this.eventStore.on('stop-listening', () => {
      this.destroy();
    });
  }

  init() {
    this.listening = true;
    this.annyang.addCallback('resultNoMatch', this.answeredWrong.bind(this));
    this.annyang.addCommands(this.commands);
    this.annyang.start();
  }

  destroy() {
    this.listening = false;
    this.annyang.removeCallback('resultNoMatch', this.answeredWrong.bind(this));
    this.annyang.removeCommands(this.commands);
    this.annyang.abort();
  }

  answeredCorrectly() {
    if (this.listening) {
      this.eventStore.trigger('answered-correctly');
      this.destroy();
    }
  }

  answeredWrong(results) {
    if (this.listening) {
      this.eventStore.trigger('answered-wrong', results);
    }
  }

  getCommands(acceptedAnswers) {
    return acceptedAnswers.reduce((prev, curr) => {
      prev[curr] = () => {
        this.answeredCorrectly();
      };
      return prev;
    }, {});
  }
}
