import SpeakTheWords from '../components/speak-the-words';

/**
 * Wrapper function for H5P functionality
 */
H5P.SpeakTheWords = (function (Question) {
  "use strict";

  /**
   * Implements required functionality to comply with H5P core.
   *
   * @param params
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
  }

  // Inheritance
  WrapperClass.prototype = Object.create(Question.prototype);
  WrapperClass.prototype.constructor = WrapperClass;

  return WrapperClass;
}(H5P.Question));
