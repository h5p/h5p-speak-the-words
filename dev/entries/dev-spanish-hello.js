import 'expose?H5P!exports?H5P!h5p-view';

import 'imports?H5P=>window.H5P!../libraries/h5p-transition/transition';
import 'imports?H5P=>window.H5P!../libraries/h5p-joubel-ui/js/joubel-ui';
import 'imports?H5P=>window.H5P!../libraries/h5p-joubel-ui/js/joubel-score-bar';
import 'imports?H5P=>window.H5P!../libraries/h5p-question/scripts/question';

import 'expose?H5P.SpeakTheWords!exports?H5P.SpeakTheWords!../../app/entries/dist';

import '../libraries/h5p-question/styles/question.css';
import '../libraries/h5p-joubel-ui/css/joubel-score-bar.css';
import '../libraries/h5p-joubel-ui/css/joubel-ui.css';
import '../libraries/h5p-font-awesome/h5p-font-awesome.min.css';

import semantics from '../../semantics.json';

const authorParams = {
  question: 'Hola',
  acceptedAnswers: [
    'Hello',
    'Correct'
  ]
};

const l10nFields = semantics
  .find((semantic) => {
    return semantic.name === 'l10n'
  }).fields;

const defaultParams = l10nFields.reduce((prev, field) => {
  prev.l10n[field.name] = field.default;
  return prev;
}, {l10n: {}});

const params = Object.assign({}, defaultParams, authorParams);

const speakTheWords = new H5P.SpeakTheWords(params);
speakTheWords.libraryInfo = {
  machineName: 'H5P.SpeakTheWords'
};
speakTheWords.isRoot = () => true;
speakTheWords.setActivityStarted = () => {
};
const app = H5P.jQuery('<div>')
  .appendTo(H5P.jQuery('body'));

speakTheWords.attach(app);
