import React from 'react';
import './styles/record-button.css';

export default class RecordButton extends React.Component {

  constructor(props) {
    super(props);
    this.speechEngine = props.speechEngine;
    this.eventStore = props.eventStore;

    this.initialState = {
      listening: false,
      processingSound: false,
      disabled: false
    };
    this.state = this.initialState;
    this.initSpeechEngineListeners();
  }

  resetState() {
    this.setState(this.initialState);
  }

  disableButton() {
    this.eventStore.trigger('stop-listening');
    this.setState({
      listening: false,
      processingSound: false,
      disabled: true
    })
  }

  hideButton() {
    this.eventStore.trigger('stop-listening');
    this.setState({
      hidden: true
    })
  }

  handleKeyPressed(e) {
    if (e.which === 32 || e.which === 13) {
      this.startListening();
      e.preventDefault();
    }
  }

  handleMouseDown(e) {
    // left mouse button
    if (e.nativeEvent.which === 1) {
      this.startListening();
      e.preventDefault();
    }
  }

  startListening() {
    if (this.state.disabled) {
      return;
    }

    // already listening
    if (this.state.listening) {
      this.setState({listening: false});
      this.eventStore.trigger('stop-listening');
      return;
    }

    this.setState({listening: true});
    this.eventStore.trigger('start-listening');
  }

  initSpeechEngineListeners() {
    this.eventStore.on('reset-task', this.resetState.bind(this));
    this.eventStore.on('answered-correctly', this.hideButton.bind(this));
    this.eventStore.on('answered-wrong', this.disableButton.bind(this));
  }

  render() {
    const className = "h5p-speak-the-words-record h5p-joubelui-button"
      + (this.state.listening ? " h5p-listening" : "")
      + (this.state.disabled ? " h5p-disabled" : "")
      + (this.state.hidden ? " h5p-hidden" : "");

    const buttonText = this.state.listening ? this.props.l10n.listeningLabel :
      this.props.l10n.speakLabel;

    return (
      <div>
        <button
          type="button"
          className={className}
          onMouseDown={this.handleMouseDown.bind(this)}
          onKeyDown={this.handleKeyPressed.bind(this)}
        >
          {buttonText}
        </button>
      </div>
    )
  }
}
