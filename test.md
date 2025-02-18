
map： 
    key:颜色代码（如a,b,c,d）
    value:每个颜色第一次出现的下标
初始第一个颜色，value 1

maxLength: 初始1
color: 初始数组第一个颜色

lastColorIndex: 上一个遍历的颜色起始下标（对比昨天的那个找0的思路的left）

遍历数组(第二个开始遍历)：
    1. 判断map.containKey，没有，存下标
    2. 如果跟前一个颜色不同:
        len = 当前下标i - lastColorIndex
        if (len > maxLength) {
            maxLength = len
            color = 颜色代码（如a,b,c,d）
        }
        记录lastColorIndex为当前

末尾判断：lastColorIndex != 数组长度时
            len = 数组长度 - lastColorIndex 存末尾颜色长度
            if (len > maxLength) {
                maxLength = len
                color = 颜色代码（如a,b,c,d）
            }

返回maxLength 和 map里key为color的首个下标
