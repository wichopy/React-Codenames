import { Component, createElement as ce } from 'react'; 
import { observer, inject } from 'mobx-react';

@inject('authStore', 'modifierStore')
@observer
class CheckboxWordReshuffle extends Component {

  render() {
    const { authStore, modifierStore } = this.props;

    if (authStore.token) {
      return ce('form', {},
        ce('label', {}, 
          ce('input', { 
            type: 'checkbox',
            checked: modifierStore.enableReshuffle,
            onChange: modifierStore.handleEnableReshuffle,
          }),
          'Enable Word Reshuffle (or press \'e\' to enable',
        )
      )
    }
    return ce('div', {})
  }
}

export default CheckboxWordReshuffle;
