import SpeakTheWords from '../components/speak-the-words';

H5P.SpeakTheWords = (function (Question) {
  "use strict";

  function WrapperClass(params, contentId, contentData) {
    Question.call(this, 'speak-the-words');
    const speakTheWords = new SpeakTheWords(params, this);

    this.registerDomElements = () => {
      speakTheWords.registerDomElements();
    };
  }

  // Inheritance
  WrapperClass.prototype = Object.create(Question.prototype);
  WrapperClass.prototype.constructor = WrapperClass;

  return WrapperClass;
}(H5P.Question));
