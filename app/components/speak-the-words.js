import React from 'react';
import ReactDOM from 'react-dom';
import './styles/speak-the-words.css';
import annyang from 'annyang';

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
   * Initialize the main components used within the task
   *
   * @param {Object} params Author specified parameters
   * @param {Object} params.l10n Translation strings
   * @param {string} params.l10n.correctAnswerText Text for saying the an answer was correct
   * @param {string} params.l10n.incorrectAnswerText Text for saying the an answer was incorrect
   * @param {string} params.l10n.retryLabel Label for 'retry'-button
   * @param {string} params.l10n.showSolutionLabel Label for 'show solution'-button
   * @param {string} params.l10n.unsupportedBrowserHeader
   *  Header text explaining that a browser is unsupported
   * @param {string} params.l10n.unsupportedBrowserDetails
   *  Text with complementary details for unsupported browsers
   * @param {Object} question H5P Question instance with button and event functionality
   */
  constructor(params, question) {
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
    ReactDOM.render(
      <div>
        <RecordButton
          eventStore={this.speechEventStore}
          l10n={params.l10n}
          speechEngine={this.speechEngine}
        />
        <ShowSolution eventStore={this.speechEventStore} {...params} />
      </div>, this.questionWrapper);

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
    introduction.textContent = text;
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
    this.question.addButton('try-again', l10n.retryLabel, () => {
      this.question.hideButton('try-again');
      this.question.hideButton('show-solution');
      this.question.setFeedback();
      this.speechEventStore.trigger('reset-task');
    }, false);

    this.question.addButton('show-solution', l10n.showSolutionLabel, () => {
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
    this.question.setFeedback(feedbackText, 1, 1);
    this.question.hideButton('try-again');
    this.question.hideButton('show-solution');
  }

  /**
   * The user answered incorrectly
   * Show retry and show solution button and display feedback
   *
   * @param {String} feedbackText Text telling user that he gave the wrong answer
   */
  answeredWrong(feedbackText) {
    this.question.setFeedback(feedbackText, 0, 1);
    this.question.showButton('try-again');
    this.question.showButton('show-solution');
  }

  /**
   * Makes sure all the required sections of H5P.Question is rendered.
   * Displays unsupported browser section if the browser does not support the Web Speech API.
   */
  registerDomElements() {
    if (!window.annyang) {
      const errorElement = document.createElement('div');
      errorElement.className = 'unsupported-browser-error';
      const headerError = document.createElement('div');
      headerError.className = 'unsupported-browser-header';
      const bodyError = document.createElement('div');
      bodyError.className = 'unsupported-browser-body';

      errorElement.appendChild(headerError);
      errorElement.appendChild(bodyError);

      headerError.textContent = this.params.l10n.unsupportedBrowserHeader;
      bodyError.textContent = this.params.l10n.unsupportedBrowserDetails;

      this.question.setIntroduction(errorElement);
      return;
    }

    this.question.setIntroduction(this.introduction);
    this.question.setContent(this.questionWrapper);
  }
}
