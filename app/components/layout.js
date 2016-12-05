import React from 'react';
import './styles/layout.css';

export default class Layout extends React.Component {
  constructor(params) {
    super();

    const annyang = params.annyang;
    annyang.debug();


    const commands = params.acceptedAnswers.reduce((prev, curr) => {
      prev[curr] = () => {
        params.answeredCorrectly();
        this.annyang.abort();
        this.setState({
          listening: false,
          processingSound: false,
          disabled: true
        })
      };
      return prev;
    }, {});

    annyang.addCommands(commands);
    annyang.addCallback('resultNoMatch', () => {
      params.answeredWrong();
      this.annyang.pause();
      this.setState({
        listening: false,
        processingSound: false,
        disabled: true
      })
    });

    annyang.addCallback('start', () => {
      console.log("Annyang started listening");
    });

    // Started processing result
    annyang.addCallback('soundstart', () => {
      if (this.state.disabled || !this.state.listening) {
        return;
      }

      console.log("got sound start!");
      if (!annyang.isListening()) {
        this.setState({
          listening: false,
          processingSound: true,
          disabled: false
        });
      }
    });

    // Finished processing result
    annyang.addCallback('result', () => {
      if (this.state.disabled) {
        return;
      }

      console.log("got result!");
      this.setState({
        listening: false,
        processingSound: false,
        disabled: false
      });
    });

    this.annyang = annyang;
    this.annyang.start({
      paused: true
    });

    this.state = {
      listening: false,
      processingSound: false,
      disabled: false
    }
  }

  startTalking() {
    // Already processing something
    if (this.state.processingSound || this.state.disabled) {
      return;
    }

    // Already listening
    if (this.state.listening) {
      this.setState({
        listening: false,
        processingSound: false,
        disabled: false
      })
    }
    else {
      this.setState({
        listening: true,
        processingSound: false,
        disabled: false
      });

      if (!this.annyang.isListening()) {
        this.annyang.resume();
      }
    }
  }

  render() {
    return (

    );
  }
}
