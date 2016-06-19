jest.unmock('../translate-the-word');

import TranslateTheWord from '../translate-the-word';

describe('Translate The Word', () => {
  const translateTheWord = new TranslateTheWord();

  it('should initialize', () => {
    expect(translateTheWord).toBeDefined();
  });

  it('should have an attach function', () => {
    expect(translateTheWord.attach).toBeDefined();
  });
});
