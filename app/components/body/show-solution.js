import React from 'react';
import './styles/show-solution.css';

export default class ShowSolution extends React.Component {

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
