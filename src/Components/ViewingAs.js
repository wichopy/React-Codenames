import { Component, createElement as ce } from 'react'
import { observer } from 'mobx-react'

@observer
class ViewingAs extends Component {
  render() {
    const { authStore } = this.props
    return ce('h2', {}, `viewing as: ${authStore.role}`)
  }
}

export default ViewingAs
