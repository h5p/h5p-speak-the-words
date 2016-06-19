import 'expose?H5P!exports?H5P!h5p-view';
import TranslateTheWord from '../scripts/translate-the-word';
const params = {
  "beforeTranslation": "Hola",
  "afterTranslation": "Hello"
};

console.log("what is params ? ", params);
const translateTheWord = new TranslateTheWord(params);
const app = H5P.jQuery('<div>')
  .appendTo(H5P.jQuery('body'));

translateTheWord.attach(app);
