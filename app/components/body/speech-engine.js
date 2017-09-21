/**
 * Speech engine library
 * A hub for all the speech engine events.
 * Keeps track of:
 * - all speech engine commands
 * - all callbacks fired by speech engine
 */
export default class SpeechEngine {

  /**
   * Initializes speech engine
   * All commands are generated and engine is prepared for execution
   * The speech engine will wait until it gets the 'start-listening' event
   * before listening for any user speech
   *
   * @param {SpeakTheWordsParameters} params
   * @param {Object} eventStore
   *  A central event store that all events are channeled through
   */
  constructor(params, eventStore) {
    this.params = params;
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

    this.eventStore.on('stop-all-media', () => {
      this.destroy();
    });
  }

  /**
   * Requests usage of microphone and initializes speech engine
   * commands and callbacks.
   */
  init() {
    if (this.params.inputLanguage) {
      this.annyang.setLanguage(this.params.inputLanguage);
    }
    this.listening = true;
    this.annyang.addCallback('resultNoMatch', this.answeredWrong.bind(this));
    this.annyang.addCommands(this.commands);
    this.annyang.start();
  }

  /**
   * Stops listening and turns of microphone.
   * Removes all commands and callbacks so speech engine can be re-initialized
   * with a different set of rules by a different task.
   */
  destroy() {
    this.listening = false;
    this.annyang.removeCallback('resultNoMatch', this.answeredWrong.bind(this));
    this.annyang.removeCommands();
    this.annyang.abort();
  }

  /**
   * Notify listeners that user has answered correctly.
   * Destroy speech engine
   */
  answeredCorrectly() {
    if (this.listening) {
      this.eventStore.trigger('answered-correctly');
      this.destroy();
    }
  }

  /**
   * Notify listeners that user has answered wrong.
   *
   * @param {Array} results
   *  User answers as interpreted by the speech engine
   */
  answeredWrong(results) {
    if (this.listening) {
      this.eventStore.trigger('answered-wrong', results);
      this.destroy();
    }
  }

  /**
   * Generate commands from author specified answers
   * If a user answers gives of the accepted answers it should be interpreted
   * as a correctly answered task
   *
   * @param {Array} acceptedAnswers Author specified list of accepted answers
   * @return {Object} Consumable commands for the speech engine
   */
  getCommands(acceptedAnswers) {
    return acceptedAnswers.reduce((prev, curr) => {
      prev[curr] = () => {
        this.answeredCorrectly();
      };
      return prev;
    }, {});
  }
}
