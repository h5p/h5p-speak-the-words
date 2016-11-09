import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './layout';
import annyang from 'annyang';
import './styles/speak-the-words.css';

export default class {
  constructor(params, contentId, contentData) {
    H5P.Question.call(this, 'speak-the-words');

    this.createIntroduction(params.question);
    this.createContent(params);
    this.createButtonBar(params.l10n);
  }

  createIntroduction(text) {
    const introduction = document.createElement('div');
    introduction.className = 'h5p-speak-the-words-introduction';
    introduction.innerHTML = text;
    this.introduction = introduction;
  }

  createContent(params) {
    const questionWrapper = document.createElement('div');
    questionWrapper.className = 'h5p-speak-the-words';

    const injections = {
      annyang,
      answeredCorrectly: this.answeredCorrectly.bind(this, params.l10n.correctAnswerText),
      answeredWrong: this.answeredWrong.bind(this, params.l10n.incorrectAnswerText)
    };

    ReactDOM.render(<Layout {...injections} {...params} />, questionWrapper);
    this.questionWrapper = questionWrapper;
  }

  createButtonBar(l10n) {
    this.addButton('try-again', l10n.retryLabel, () => {
      this.hideButton('try-again');
      this.hideButton('show-solution');
      this.setFeedback();
    }, false);

    this.addButton('show-solution', l10n.showSolutionLabel, () => {
      //TODO: Show view
      this.hideButton('show-solution');

    }, false);
  }

  answeredCorrectly(feedbackText) {
    console.log("answered correctly!, why isnt feedbacktext wroking ?", this);
    this.setFeedback(feedbackText, 1, 1);
    this.hideButton('try-again');
    this.hideButton('show-solution');
  }

  answeredWrong(feedbackText) {
    console.log("answered wrong");
    this.setFeedback(feedbackText, 0, 1);
    this.showButton('try-again');
    this.showButton('show-solution');
  }

  registerDomElements() {
    this.setIntroduction(this.introduction);
    this.setContent(this.questionWrapper);
  }
}
