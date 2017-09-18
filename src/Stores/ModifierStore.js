import { observable } from 'mobx'

class ModifierStore { 
  @observable enableReshuffle = false

  handleEnableReshuffle = () => {
    console.log('toggle enable reshuffle')
    this.enableReshuffle = !this.enableReshuffle
  }
}

export default ModifierStore;
