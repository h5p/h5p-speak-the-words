var H5PPresave = H5PPresave || {};

H5PPresave['H5P.SpeakTheWords'] = function (content, finished) {
  var presave = H5PEditor.Presave;
  var score = 1;

  if (isContentInValid()) {
    throw new presave.exceptions.InvalidContentSemanticsException('Invalid Speak The Words Error');
  }

  presave.validateScore(score);

  if (finished) {
    finished({maxScore: score});
  }

  function isContentInValid() {
    return !presave.checkNestedRequirements(content, 'content.acceptedAnswers') || !Array.isArray(content.acceptedAnswers);
  }
};
