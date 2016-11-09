import 'expose?H5P!exports?H5P!h5p-view';
import SpeakTheWords from '../../app/components/speak-the-words';

import 'imports?H5P=>window.H5P!../libraries/h5p-transition/transition';
import 'imports?H5P=>window.H5P!../libraries/h5p-joubel-ui/js/joubel-ui';
import 'imports?H5P=>window.H5P!../libraries/h5p-joubel-ui/js/joubel-score-bar';
import 'imports?H5P=>window.H5P!../libraries/h5p-question/scripts/question';

import 'style!css!../libraries/h5p-question/styles/question.css';
import 'style!css!../libraries/h5p-joubel-ui/css/joubel-score-bar.css';
import 'style!css!../libraries/h5p-joubel-ui/css/joubel-ui.css';
import 'style!css!../libraries/h5p-font-awesome/h5p-font-awesome.min.css';

const params = {
  question: 'Hola',
  acceptedAnswers: [
    'Hello',
    'Correct'
  ],
  l10n: {
    retryLabel: 'Retry',
    showSolutionLabel: 'Show solution',
    speakLabel: 'Push to speak',
    incorrectAnswerText: 'Incorrect answer',
    correctAnswerText: 'Correct answer'
  }
};

const speakTheWords = new SpeakTheWords(params);
speakTheWords.libraryInfo = {
  machineName: 'H5P.SpeakTheWords'
};
speakTheWords.isRoot = () => true;
speakTheWords.setActivityStarted = () => {};
const app = H5P.jQuery('<div>')
  .appendTo(H5P.jQuery('body'));

speakTheWords.attach(app);
