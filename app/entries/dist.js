import SpeakTheWords from '../components/speak-the-words';
import { decode } from 'he';

/**
 * Wrapper function for H5P functionality
 */
H5P.SpeakTheWords = (function (Question) {
  "use strict";

  /**
   * Implements required functionality to comply with H5P core.
   *
   * @param params
   * @param contentId
   * @constructor
   */
  function WrapperClass(params) {
    Question.call(this, 'speak-the-words');
    const speakTheWords = new SpeakTheWords(params, this);

    /**
     * Implements the registerDomElements interface required by H5P Question
     */
    this.registerDomElements = () => {
      speakTheWords.registerDomElements();
    };

    /**
     * Contract for resetting task
     * @see {@link https://h5p.org/documentation/developers/contracts}
     */
    this.resetTask = () => {
      speakTheWords.resetTask();
    };

    /**
     * Contract for showing solution
     * @see {@link https://h5p.org/documentation/developers/contracts}
     */
    this.showSolutions = () => {
      speakTheWords.showSolutions();

      // Also hide retry button
      speakTheWords.question.hideButton('try-again');

      if (!speakTheWords.isQuestionAnswered()) {
        this.setFeedback(decode(params.l10n.incorrectAnswerText), 0, 1);
      }
    };

    /**
     * Contract for getting score.
     * @see {@link https://h5p.org/documentation/developers/contracts}
     * @returns {number} Current score of the user
     */
    this.getScore = () => {
      return speakTheWords.getScore();
    };

    /**
     * Stop listening for voice.
     * Used by other libraries to make sure that this task's functionality is stopped.
     */
    this.stop = () => {
      speakTheWords.stopListening();
    };
  }

  // Inheritance
  WrapperClass.prototype = Object.create(Question.prototype);
  WrapperClass.prototype.constructor = WrapperClass;

  return WrapperClass;
}(H5P.Question));
