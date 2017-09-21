import React from 'react';
import './styles/record-button.css';
import { decode } from 'he';

/**
 * Record button component
 * Switches between task states:
 * - off
 * - listening for user input
 * - disabled
 */
export default class RecordButton extends React.Component {

  /**
   * Initializes component in a passive mode.
   * Action is required to start recording speech.
   *
   * @param {Object} props
   * @param {Object} props.speechEngine Speech engine functionality
   * @param {Object} props.eventStore A central store for events
   * @param {SpeakTheWordsTranslations} props.l10n
   */
  constructor(props) {
    super(props);
    this.speechEngine = props.speechEngine;
    this.eventStore = props.eventStore;

    this.initialState = {
      listening: false,
      processingSound: false,
      disabled: false,
      hidden: false
    };
    this.state = this.initialState;
    this.initSpeechEngineListeners();

    this.eventStore.on('stop-all-media', () => {
      this.setState({
        listening: false
      });
    });
  }

  /**
   * Reset state to the initial passive state.
   */
  resetState() {
    this.setState(this.initialState);
  }

  /**
   * Disables button from all input.
   */
  disableButton() {
    this.eventStore.trigger('stop-listening');
    this.setState({
      listening: false,
      processingSound: false,
      disabled: true
    });
  }

  /**
   * Hides button.
   */
  hideButton() {
    this.eventStore.trigger('stop-listening');
    this.setState({
      hidden: true
    });
  }

  /**
   * Handle keyboard button events.
   * Space and enter will trigger the handler for the button.
   * @param {Object} e Keyboard event
   */
  handleKeyPressed(e) {
    if (e.which === 32 || e.which === 13) {
      this.startListening();
      e.preventDefault();
    }
  }

  /**
   * Handles mouse down event.
   * Left mouse click will trigger the handler for the button.
   * @param {Object} e Synthetic React event
   */
  handleMouseDown(e) {
    // left mouse button
    if (e.nativeEvent.which === 1) {
      this.startListening();
      e.preventDefault();
    }
  }

  /**
   * Starts listening for user speech input.
   */
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

  /**
   * Initializes listeners that react to speech engine events.
   */
  initSpeechEngineListeners() {
    this.eventStore.on('reset-task', this.resetState.bind(this));
    this.eventStore.on('show-solution', this.hideButton.bind(this));
    this.eventStore.on('answered-correctly', this.hideButton.bind(this));
    this.eventStore.on('answered-wrong', this.disableButton.bind(this));
  }

  /**
   * Renders the component
   *
   * @return {String} JSX component
   */
  render() {
    const className = "h5p-speak-the-words-record h5p-joubelui-button"
      + (this.state.listening ? " h5p-listening" : "")
      + (this.state.disabled ? " h5p-disabled" : "")
      + (this.state.hidden ? " h5p-hidden" : "");

    const buttonText = this.state.listening ? this.props.l10n.listeningLabel :
      this.props.l10n.speakLabel;

    return (
      <button
        type="button"
        className={className}
        onMouseDown={this.handleMouseDown.bind(this)}
        onKeyDown={this.handleKeyPressed.bind(this)}
      >
        {decode(buttonText)}
      </button>
    )
  }
}
