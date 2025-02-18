import React from "react";

// const msg = "test"
// const arr = ["1", "2", "3"]

// 类组件
class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            count: 0
        }
    }
    // state = {
    //     count: 0
    // }
    addNum(num) {
        console.log(num)
    }
    render () {
        return (
            <div>
                <p>{this.state.count}</p>
                <button onClick={this.addNum.bind(this, 1)}>控制台</button>
                {/* <h2>{msg}</h2>
                <input type="text" />
                <hr/>
                <label htmlFor="username">用户名</label>
                <input type="text" id="username"/>
                <hr />
                <div className="box">盒子</div>
                <hr />
                <div style={{backgroundColor: "blue"}}>盒子</div>
                <hr/>
                <ul>
                    {
                        arr.map((item,index) => {
                            return <li key={index}>item</li>
                        })
                    }
                </ul> */}
                
            </div>

        )
    }
}

export default App
