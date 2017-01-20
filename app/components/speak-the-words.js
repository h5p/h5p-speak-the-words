import React from 'react';
import ReactDOM from 'react-dom';
import './styles/speak-the-words.css';
import annyang from 'annyang';

import SpeechEngine from './body/speech-engine';
import RecordButton from './body/record-button';
import ShowSolution from './body/show-solution';

export default class {
  constructor(params, question) {
    this.params = params;
    this.question = question;

    if (!window.annyang) {
      return;
    }

    this.speechEventStore = new H5P.EventDispatcher();
    this.createIntroduction(params.question);
    this.createContent(params);
    this.createButtonBar(params.l10n);

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

  createIntroduction(text) {
    const introduction = document.createElement('div');
    introduction.className = 'h5p-speak-the-words-introduction';
    introduction.textContent = text;
    this.introduction = introduction;
  }

  createContent() {
    const questionWrapper = document.createElement('div');
    questionWrapper.className = 'h5p-speak-the-words';
    this.questionWrapper = questionWrapper;
  }

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

  answeredCorrectly(feedbackText) {
    this.question.setFeedback(feedbackText, 1, 1);
    this.question.hideButton('try-again');
    this.question.hideButton('show-solution');
  }

  answeredWrong(feedbackText) {
    this.question.setFeedback(feedbackText, 0, 1);
    this.question.showButton('try-again');
    this.question.showButton('show-solution');
  }

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
