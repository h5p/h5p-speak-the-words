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
    this.annyang.addCallback('result', this.handleResults.bind(this));
    this.annyang.start();
  }

  /**
   * Stops listening and turns of microphone.
   * Removes all commands and callbacks so speech engine can be re-initialized
   * with a different set of rules by a different task.
   */
  destroy() {
    this.listening = false;
    this.annyang.removeCallback('result', this.handleResults.bind(this));
    this.annyang.abort();
  }

  /**
   * Check if a user's answer is correct
   * @param {string} userSaid 
   * @returns {bool}
   */
  isCorrectAnswer(userSaid) {
    // Remove dots, trim it, and ignore case
    userSaid = userSaid.replace(/\./g, '').trim().toLowerCase();
    return this.params.acceptedAnswers.some(function (correct) {
      // Remove dots, trim it, and ignore case
      return userSaid === correct.replace(/\./g, '').trim().toLowerCase();
    })
  }

  /**
   * Handle results from annyang
   * @param {Array} results 
   */
  handleResults(results) {
    if (this.listening) {
      // Go through results
      let correct = results.some(userSaid => {
        return this.isCorrectAnswer(userSaid);
      });

      this.eventStore.trigger(correct ? 'answered-correctly' : 'answered-wrong', results);
      this.destroy();
    }
  }
}
