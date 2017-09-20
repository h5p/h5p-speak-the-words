import React from 'react';
import './styles/show-solution.css';
import {decode} from 'he';

/**
 * Show solution component
 * Renders the interpreted answers from the user
 * and the correctly specified answers by the author
 * so they easily can be compared.
 */
export default class ShowSolution extends React.Component {

  /**
   * Initializes component with solutions hidden
   * Generates a human readable text from accepted answers
   * Initializes all listeners for relevant events in other components
   *
   * @param {Object} props
   * @param {Object} props.eventStore
   * A central event store for all task related events
   * @param {Array} props.acceptedAnswers
   * All accepted answers as specified by the author
   * @params {Translations} l10n Translations for component
   */
  constructor(props) {
    super(props);

    this.state = {
      showSolution: false,
      userAnswers: []
    };

    props.eventStore.on('show-solution', () => {
      this.setState({showSolution: true});
    });
    props.eventStore.on('reset-task', () => {
      this.setState({
        showSolution: false,
        userAnswers: []
      });
    });
    props.eventStore.on('answered-wrong', (e) => {
      this.setState({userAnswers: e.data});
    });
  }

  /**
   * Renders the component
   *
   * @return {String} JSX component
   */
  render() {
    const className = 'h5p-speak-the-words-solution-area' + (this.state.showSolution ? '' : ' hidden');

    let userAnswersText = null;
    if (this.state.userAnswers && this.state.userAnswers.length) {
      userAnswersText = (
        <div className="h5p-speak-the-words-user-answer-text">
          <div>{decode(this.props.l10n.userAnswersText)}</div>
          {this.state.userAnswers.map(userAnswer => {
            return (
              <div key={userAnswer} className="h5p-speak-the-words-interpreted-answer">
                {userAnswer}
              </div>);
          })}
        </div>
      )
    }

    return (
      <div className={className}>
        {userAnswersText}
        <div className="h5p-speak-the-words-correct-answer-text">
          <div>{decode(this.props.l10n.correctAnswersText)}</div>
          {this.props.acceptedAnswers.map(acceptedAnswer => {
            return (
              <div key={acceptedAnswer} className="h5p-speak-the-words-correct-answer">
                {acceptedAnswer}
              </div>
            );
          })}
        </div>
      </div>
    )
  }
}
