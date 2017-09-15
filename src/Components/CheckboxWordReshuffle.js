import { Component, createElement as ce } from 'react'; 

class CheckboxWordReshuffle extends Component {

  render() {
    const { enableReshuffle, handleEnableShuffleCheckbox } = this.props;
    return ce('form', {},
      ce('label', {}, 
        ce('input', { 
          type: 'checkbox',
          checked: enableReshuffle,
          onChange: handleEnableShuffleCheckbox,
        }),
        'Enable Word Reshuffle (or press \'e\' to enable',
      )
    )
  }
}

export default CheckboxWordReshuffle;
