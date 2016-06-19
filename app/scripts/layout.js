import React from 'react';
import styles from '../styles/layout.css';

export default class Layout extends React.Component {

  constructor(params) {
    super();

    const annyang = params.annyang;
    const commands = {};
    commands[params.afterTranslation] = function () {
      alert("CONGRATULATIONS, you answered correct: " +
        params.afterTranslation);
    };
    annyang.addCommands(commands);
    annyang.addCallback('resultNoMatch', () => {
      alert('Seems you answered wrong!');
    });
    annyang.addCallback('end', () => {
      console.log("speech rec engine ended!");
    });

    annyang.addCallback('result', () => {
      console.log("result fired! was fast enough ?");
    });
    annyang.start();
  }

  render() {
    return (
      <div className={styles.translations}>
        Translate the word: {this.props.beforeTranslation}
      </div>
    );
  }
}
