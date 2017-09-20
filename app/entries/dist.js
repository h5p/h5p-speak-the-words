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
  function WrapperClass(params, contentId) {
    Question.call(this, 'speak-the-words');
    const speakTheWords = new SpeakTheWords(params, this);

    /**
     * Implements the registerDomElements interface required by H5P Question
     */
    this.registerDomElements = () => {
      speakTheWords.registerDomElements();
    };

    this.resetTask = () => {
      speakTheWords.resetTask();
    };

    this.showSolutions = () => {
      speakTheWords.showSolutions();

      // Also hide retry button
      speakTheWords.question.hideButton('try-again');

      if (!speakTheWords.hasAnswered) {
        this.setFeedback(decode(params.l10n.incorrectAnswerText), 0, 1);
      }
    };

    this.getScore = () => {
      return speakTheWords.score;
    };
  }

  // Inheritance
  WrapperClass.prototype = Object.create(Question.prototype);
  WrapperClass.prototype.constructor = WrapperClass;

  return WrapperClass;
}(H5P.Question));
