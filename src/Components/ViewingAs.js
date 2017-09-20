import { Component, createElement as ce } from 'react'
import { observer, inject } from 'mobx-react'

@inject('authStore')
@observer
class ViewingAs extends Component {
  render() {
    const { authStore } = this.props
    return ce('h2', {}, `viewing as: ${authStore.role}`)
  }
}

export default ViewingAs
