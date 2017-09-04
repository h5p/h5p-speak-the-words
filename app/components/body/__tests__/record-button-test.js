jest.unmock('../record-button');

import React from 'react';
import RecordButton from '../record-button';
import renderer from 'react-test-renderer';

describe('Record Button', () => {
  const eventStoreMock = {on: jest.fn(), trigger: jest.fn()};
  const speechEngineMock = jest.fn();
  const test = (action) => {
    const component = renderer.create(
      <RecordButton
        eventStore={eventStoreMock}
        speechEngine={speechEngineMock}
        l10n={{
          listeningLabel: 'listening',
          speakLabel: 'speak'
        }}
      />
    );

    let tree = component.toJSON();
    action(tree, component);
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  };

  const mouseEvent = (button) => {
    return {
      nativeEvent: {
        which: button
      },
      preventDefault: jest.fn()
    }
  };

  it('should render initially', () => {
    test(() => {});
  });

  it('should start recording on left mouse down', () => {
    test((tree) => {
      tree.props.onMouseDown(mouseEvent(1));
    })
  });

  it('should stop recording when clicked again', () => {
    test((tree, component) => {
      component.getInstance().setState({
        'listening': true
      });
      tree = component.toJSON();
      expect(tree).toMatchSnapshot();
      tree.props.onMouseDown(mouseEvent(1));
    })
  });

  it('should not start recording on right mouse down', () => {
    test(tree => {
      tree.props.onMouseDown(mouseEvent(0));
    });
  });

  const keyEvent = (keyCode) => {
    return {
      which: keyCode,
      preventDefault: jest.fn()
    }
  };

  it('should start recording when pressing space', () => {
    test(tree => {
      tree.props.onKeyDown(keyEvent(32));
    });
  });

  it('should start recording when pressing enter', () => {
    test(tree => {
      tree.props.onKeyDown(keyEvent(13));
    });
  });

  it('should not start recording when pressing "a"', () => {
    test(tree => {
      tree.props.onKeyDown(keyEvent(65));
    });
  });

  it('should be possible to disable', () => {
    test((tree, component) => {
      component.getInstance().setState({disabled: true});
    });
  });

  it('should be possible to hide', () => {
    test((tree, component) => {
      component.getInstance().setState({hidden: true});
    });
  })
});
