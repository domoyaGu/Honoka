import React from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useState } from "react";

// 创建上下文(生产者Provider，消费者Consumer)
const NumContext = createContext()
// const TestContext = createContext()

function Child(props) {
    const xxx = useContext(NumContext)
    console.log(xxx)
    return 
        // <NumContext.Consumer>
        //     {
        //         ({num, setNum}) => (
        //             <div>
        //                 <h2>{num}</h2>
        //                 <button onClick={() => setNum(456)}>修改</button>
        //             </div>
        //         )
        //     }
        // </NumContext.Consumer>
        // <div>
        //     <p>子组件 {props.num}</p>
        //     <button onClick={() => {props.changeNum(789)}}>修改父组件</button>
        // </div>
    
}

// function Father(props) {
//     // console.log(props)
//     return <h2>父组件<Child num={props.num} changeNum={props.changeNum}/></h2>
// }

const Father = () => <Child/>

export default function FatherSon() {
    const [num, setNum] = useState(123)
    const [test, setTest] = useState(333)
    return (
        <NumContext.Provider value={{test, setTest}}>
            <Father/>
        </NumContext.Provider>
    )
}
