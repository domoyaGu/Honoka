/**
 * 钩子函数Hooks
 * 
 */

import { useState } from "react"

// let msg = "test"

export default function Hooks () {
    // hook必须在最顶层
    const [num, setMsg] = useState(1)
    // const fn = () => {
    //     setMsg("2222")
    // }
    return (
        <div>
            <p>{num}</p>
            <button onClick={() => setMsg(num+1)}>test</button>
        </div>
    )
}


