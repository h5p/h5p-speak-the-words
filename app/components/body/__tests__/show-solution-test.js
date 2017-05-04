jest.unmock('../show-solution');

import React from 'react';
import ShowSolution from '../show-solution';
import renderer from 'react-test-renderer';

describe('Show Solution', () => {
  const eventStoreMock = {on: jest.fn(), trigger: jest.fn()};
  const params = {
    acceptedAnswers: ['Dart', 'Vader'],
    l10n: {
      correctAnswersText: 'Correct',
      userAnswersText: 'User answers'
    }
  };

  const test = (action) => {
    const component = renderer.create(
      <ShowSolution
        eventStore={eventStoreMock}
        {...params}
      />
    );

    let tree = component.toJSON();
    action(tree, component);
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  };

  it('should be hidden initially', () => {
    test(() => {});
  });

  it('should be shown on show solution event', () => {
    test((tree, component) => {
      component.getInstance().setState({showSolution: true});
    })
  });

  it('should contain user answers when specified', () => {
    test((tree, component) => {
      component.getInstance().setState({
        showSolution: true,
        userAnswers: ['Luke', 'SkyWalker']
      });
    });
  });
});
