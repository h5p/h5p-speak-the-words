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

    this.createIntroduction = (text) => {
      const introduction = document.createElement('div');
      introduction.className = 'h5p-speak-the-words-introduction';
      introduction.innerHTML = text;
      this.introduction = introduction;
    };

    this.createContent = (params) => {
      const questionWrapper = document.createElement('div');
      questionWrapper.className = 'h5p-speak-the-words';
      this.questionWrapper = questionWrapper;

      this.updateRecordButton(params);
    };

    this.updateRecordButton = (params) => {
      var props = {
        ...this.state,
        startTalking: this.startTalking.bind(this),
        l10n: params.l10n
      };

      ReactDOM.render(<RecordButton {...props}/>, this.questionWrapper);
    };

    this.startTalking = () => {
      this.state = {
        ...this.state,
        listening: true
      };
      this.updateRecordButton(this.params);
    };

    this.createButtonBar = (l10n) => {
      this.addButton('try-again', l10n.retryLabel, () => {
        this.hideButton('try-again');
        this.hideButton('show-solution');
        this.setFeedback();
      }, false);

      this.addButton('show-solution', l10n.showSolutionLabel, () => {
        //TODO: Show view
        this.hideButton('show-solution');

      }, false);
    };

    this.answeredCorrectly = (feedbackText) => {
      this.setFeedback(feedbackText, 1, 1);
      this.hideButton('try-again');
      this.hideButton('show-solution');
    };

    this.answeredWrong = (feedbackText) => {
      this.setFeedback(feedbackText, 0, 1);
      this.showButton('try-again');
      this.showButton('show-solution');
    };

    this.registerDomElements = () => {
      this.setIntroduction(this.introduction);
      this.setContent(this.questionWrapper);
    };

    this.createIntroduction(params.question);
    this.createContent(params);
    this.createButtonBar(params.l10n);
  }
}
