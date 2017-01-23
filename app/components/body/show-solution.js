import React from 'react';
import './styles/show-solution.css';

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
   *  A central event store for all task related events
   * @param {Array} props.acceptedAnswers
   *  All accepted answers as specified by the author
   */
  constructor(props) {
    super(props);

    this.state = {
      showSolution: false,
      userAnswers: []
    };

    this.correctAnswersText = `"${props.acceptedAnswers.join('", "')}"`;
    props.eventStore.on('show-solution', () => {
      this.setState({showSolution: true});
    });
    props.eventStore.on('reset-task', () => {
      this.setState({showSolution: false});
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
    const className = 'solution-area' + (this.state.showSolution ? '' : ' hidden');

    let userAnswersText = null;
    if (this.state.userAnswers && this.state.userAnswers.length) {
      userAnswersText = (
        <div className="user-answer-text">
          <div>{this.props.l10n.userAnswersText}</div>
          <div>{`"${this.state.userAnswers.join('", "')}"`}</div>
        </div>
      )
    }

    return (
      <div className={className}>
        {userAnswersText}
        <div className="correct-answer-text">
          <div>{this.props.l10n.correctAnswersText}</div>
          <div>{this.correctAnswersText}</div>
        </div>
      </div>
    )
  }
}
