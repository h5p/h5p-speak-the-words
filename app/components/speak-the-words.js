import React from 'react';
import ReactDOM from 'react-dom';
import annyang from 'annyang';
import './styles/speak-the-words.css';

import RecordButton from './body/record-button';

export default class {
  constructor(params, contentId, contentData) {
    H5P.Question.call(this, 'speak-the-words');

    this.params = params;
    this.state = {
      listening: false,
      processing: false,
      disabled: false
    };

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
    this.questionWrapper = questionWrapper;

    //console.log("this state ?", this, ...this.state)
    console.log("this state ?", this, this.state);
    console.trace()

    this.updateRecordButton(params);
  }

  updateRecordButton(params) {
    var props = {
      ...this.state,
      startTalking: this.startTalking.bind(this),
      l10n: params.l10n
    };
    console.log("update record button", props)

    ReactDOM.render(<RecordButton {...props}/>, this.questionWrapper);
  }

  startTalking() {
    console.log("clicked the button!!!, change state to listening")
    this.state = {
      ...this.state,
      listening: true
    }
    this.updateRecordButton(this.params);
    console.log("this statee", this.state.listening)
    console.log("what is new state ?", this.state);
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
