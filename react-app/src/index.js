import ReactDOM from 'react-dom'
import Effect from './Effect'
import FatherSon from './FatherSon'

import Hooks from './Hooks'

// ReactDOM.render(组件名称, 注入元素)
ReactDOM.render(<FatherSon/>, document.getElementById('root'))

// setTimeout(() => {
//     ReactDOM.render(
//         <input type="text"></input>,
//         document.getElementById('root')
//     )
// }, 3000)
