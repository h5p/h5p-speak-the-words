import React from 'react';
import './styles/record-button.css';

export default class RecordButton extends React.Component {
  constructor(params) {
    super();
  }

  render() {
    return (
      <div>
        <button
          type="button"
          className={"h5p-speak-the-words-record h5p-joubelui-button"
          + (this.props.processingSound ? " h5p-processing" : "")
          + (this.props.listening ? " h5p-listening" : "")
          + (this.props.disabled ? " h5p-disabled" : "")}
          onClick={this.props.startTalking}
        >
          {this.props.l10n.speakLabel}
        </button>
      </div>
    )
  }
}
