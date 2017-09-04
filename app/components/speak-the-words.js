import React from 'react';
import ReactDOM from 'react-dom';
import './styles/speak-the-words.css';
import 'annyang';
import { decode } from 'he';

import SpeechEngine from './body/speech-engine';
import RecordButton from './body/record-button';
import ShowSolution from './body/show-solution';

/**
 * Speak the words
 * Wraps the whole content type and keeps track of rendering the main components
 * used within the task.
 */
export default class {

  /**
   * @typedef {Object} SpeakTheWordsParameters
   *
   * @property {SpeakTheWordsTranslations} l10n Translation strings
   * @property {string} question Question text
   * @property {Array} acceptedAnswers All accepted spoken answers as specified by the author
   * @property {string} inputLanguage Language that input is expected as
   */

  /**
   * @typedef {Object} SpeakTheWordsTranslations
   *
   * @property {string} correctAnswerText Text for saying the an answer was correct
   * @property {string} incorrectAnswerText Text for saying the an answer was incorrect
   * @property {string} retryLabel Label for 'retry'-button
   * @property {string} showSolutionLabel Label for 'show solution'-button
   * @property {Array} acceptedAnswers Accepted answers by the speech engine
   * @property {string} listeningLabel Button label when listening for speech
   * @property {string} speakLabel Button label for activating listening for speech
   * @property {string} unsupportedBrowserHeader
   * Header text explaining that a browser is unsupported
   * @property {string} unsupportedBrowserDetails
   * Text with complementary details for unsupported browsers
   * @property {string} userAnswersText Text labeling the users answers
   * @property {string} correctAnswersText Text labeling the correct answers
   */

  /**
   * Initialize the main components used within the task
   *
   * @param {SpeakTheWordsParameters} params Author specified parameters
   * @param {Object} question H5P Question instance with button and event functionality
   */
  constructor(params, question) {
    params.acceptedAnswers = params.acceptedAnswers || [];
    params.acceptedAnswers = params.acceptedAnswers.map(decode);
    this.params = params;
    this.question = question;

    // Skip rendering components if speech engine does not exist
    if (!window.annyang) {
      return;
    }

    this.speechEventStore = new H5P.EventDispatcher();
    this.createIntroduction(params.question);
    this.createContent(params);
    this.createButtonBar(params.l10n);

    // Renders record button and show solution area into the question main content
    ReactDOM.render((
      <div>
        <RecordButton
          eventStore={this.speechEventStore}
          l10n={params.l10n}
          speechEngine={this.speechEngine}
        />
        <ShowSolution eventStore={this.speechEventStore} {...params} />
      </div>
    ), this.questionWrapper);

    this.speechEngine = new SpeechEngine(params, this.speechEventStore);
    this.speechEventStore.on('answered-correctly', this.answeredCorrectly.bind(this, params.l10n.correctAnswerText));
    this.speechEventStore.on('answered-wrong', this.answeredWrong.bind(this, params.l10n.incorrectAnswerText));
  }

  /**
   * Create introduction text element
   *
   * @param {string} text Introduction text
   */
  createIntroduction(text) {
    const introduction = document.createElement('div');
    introduction.className = 'h5p-speak-the-words-introduction';
    introduction.textContent = decode(text);
    this.introduction = introduction;
  }

  /**
   * Create content element
   */
  createContent() {
    const questionWrapper = document.createElement('div');
    questionWrapper.className = 'h5p-speak-the-words';
    this.questionWrapper = questionWrapper;
  }

  /**
   * Create button bar
   *
   * @param {Object} l10n Translations
   */
  createButtonBar(l10n) {
    this.question.addButton('try-again', decode(l10n.retryLabel), () => {
      this.questionWrapper.parentNode.classList.remove('empty');
      this.question.hideButton('try-again');
      this.question.hideButton('show-solution');
      this.question.setFeedback('', 0, 1);
      this.speechEventStore.trigger('reset-task');
    }, false);

    this.question.addButton('show-solution', decode(l10n.showSolutionLabel), () => {
      this.questionWrapper.parentNode.classList.remove('empty');
      this.question.hideButton('show-solution');
      this.speechEventStore.trigger('show-solution');
    }, false);
  }

  /**
   * The user answered correctly
   * Hide button and display feedback
   *
   * @param {string} feedbackText Text telling the user that he has succeeded
   */
  answeredCorrectly(feedbackText) {
    this.questionWrapper.parentNode.classList.add('empty');
    this.question.setFeedback(decode(feedbackText), 1, 1);
    this.question.hideButton('try-again');
    this.question.hideButton('show-solution');
    this.question.triggerXAPIScored(1, 1, 'answered', true, true);
  }

  /**
   * The user answered incorrectly
   * Show retry and show solution button and display feedback
   *
   * @param {String} feedbackText Text telling user that he gave the wrong answer
   */
  answeredWrong(feedbackText) {
    this.questionWrapper.parentNode.classList.add('empty');
    this.question.setFeedback(decode(feedbackText), 0, 1);
    this.question.showButton('try-again');
    this.question.showButton('show-solution');
    this.question.triggerXAPIScored(0, 1, 'answered', true, false);
  }

  /**
   * Makes sure all the required sections of H5P.Question is rendered.
   * Displays unsupported browser section if the browser does not support the Web Speech API.
   */
  registerDomElements() {
    if (!window.annyang) {
      const errorElement = document.createElement('div');

      // Renders record button and show solution area into the question main content
      ReactDOM.render((
        <div className='h5p-speak-the-words-unsupported-browser-error'>
          <div className='h5p-speak-the-words-unsupported-browser-header'>
            {decode(this.params.l10n.unsupportedBrowserHeader)}
          </div>
          <div className='h5p-speak-the-words-unsupported-browser-body'>
            {decode(this.params.l10n.unsupportedBrowserDetails)}
          </div>
        </div>
      ), errorElement);


      this.question.setIntroduction(errorElement);
      return;
    }

    this.question.setIntroduction(this.introduction);
    this.question.setContent(this.questionWrapper);
  }
}
