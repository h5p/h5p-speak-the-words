jest.unmock('../layout');

import React from 'react';
import Layout from '../layout';
import TestUtils from 'react-addons-test-utils';
const annyang = jasmine
  .createSpyObj('annyang', ['addCommands', 'addCallback', 'start']);

describe('Layout', () => {
  const params = {
    beforeTranslation: 'Hola',
    afterTranslation: 'Hello'
  };

  const layout = TestUtils.renderIntoDocument(
    <Layout annyang={annyang} {...params} />
  );

  it('should initialize annyang', () => {
    expect(annyang.start).toBeCalled();
  });

  it('should add before translation as command in annyang', () => {
    expect(annyang.addCommands).toBeCalled();
  });

  it('should display the word to be translated', () => {
    const wordElement = TestUtils.findRenderedDOMComponentWithClass(
      layout, 'translations'
    );
    expect(wordElement.textContent).toMatch('Hola');
  });
});
