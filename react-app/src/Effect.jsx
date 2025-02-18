import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

export default function Effect() {
  const [num1,setNum1] = useState(1)
  const [num2,setNum2] = useState(1)

  // mounted
  useEffect(() => {
    console.log("挂载完成")
  }) // 这边不传相当于mounted

  // 检测数据更新updated
  useEffect(() => {
    console.log("num1更新")
  }, [num1]) // 这边只监听num1，num2会无效

  // destory
  useEffect(() => {
    return () => {
        console.log("销毁")
    }
  })


  return (
    <div> 
        <div>{num1}</div>
        <button onClick={()=> setNum1(num1 + 1)}>加</button>
        <hr/>
        <div>{num2}</div>
        <button onClick={()=> setNum2(num2 + 1)}>加</button>
    </div>
  )
}
