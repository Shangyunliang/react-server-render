import React from 'react'  // 这个引用是必须得否则会报错. 因为这里面用了jsx标签
import ReactDom from 'react-dom'
import App from './App.jsx'

// app.295bb5b2e408f9a0fb4a.js:531 Warning: Functions are not valid as a React child.
// This may happen if you return a Component instead of <Component /> from render.
// Or maybe you meant to call this function rather than return it.
// ReactDom.render(App, document.body)

// 如果挂在body上回报一个提醒. 上面由于App 没有写成组件形式
ReactDom.render(<App />, document.body)