jest.unmock('../speak-the-words');

import SpeakTheWords from '../speak-the-words';

describe('Speak The Words', () => {
  const questionMock = jest.fn();
  const instance = new SpeakTheWords({}, questionMock);

  it('should initialize', () => {
    expect(instance).toBeDefined();
  });
});
