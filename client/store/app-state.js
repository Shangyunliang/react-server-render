/**
 * @Author: Shangyunliang <dell>
 * @Date:   2018-01-15T10:15:29+08:00
 * @Email:  1071332303@qq.com
 * @Last modified by:   Shangyunliang
 * @Last modified time: 2018-01-15T17:39:31+08:00
 */

import {
  observable,
  computed,
  // autorun,
  action,
} from 'mobx'

export class AppState {
   @observable count = 0
   @observable name = 'SYL'
   @computed get msg() {
     return `${this.name} say count is ${this.count}`
   }
   @action add() {
     this.count += 1
   }
   @action changeName(name) {
     this.name = name
   }
}

const appState = new AppState()

// autorun(() => {
//   console.log(appState.msg)
// })

// setInterval(() => {
//   appState.add()
// }, 1000)

export default appState
