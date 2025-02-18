const Jimp = require('jimp');
 
let backImg = ''; // 背景base64
let sliderImg = ''; // 滑块base64
Jimp.read(Buffer.from(backImg, 'base64')).then((backgroundImage) => {
  Jimp.read(Buffer.from(sliderImg, 'base64')).then((sliderImage) => {
    // 获取背景和滑块图片的宽度和高度
    const bgWidth = backgroundImage.bitmap.width;
    const bgHeight = backgroundImage.bitmap.height;
    const sliderHeight = sliderImage.bitmap.height
    let sliderWidth = sliderImage.bitmap.width;

    // 背景图灰度化、滑块图二值化
    backgroundImage = backgroundImage.greyscale()
    sliderImage = sliderImage.greyscale().invert()
    // 记录定位数组(截取滑块图只有滑块的部分并存储滑块边缘点位)
    let x_begin = 9999
    let x_end = 0
    let y_begin = 9999
    let y_end = 0
    let points = [] // 点位数组
    // 遍历截取
    for (let y = 0; y < sliderHeight; y++) {
      for (let x = 0; x < sliderWidth; x++) {
        const rgba = Jimp.intToRGBA(sliderImage.getPixelColor(x, y));
        // 二值化后，边缘点位的明显的白色rgb会变成（1,1,1）或（0,0,0）
        // 其余点位会变成灰色或者全255（应该是全255可能Jimp处理图片的二值化函数操作不同）
        // 取（1,1,1）或者（0,0,0）用 < 5判断即可
        if (rgba.r +rgba.g + rgba.b < 5) {
          x_begin = Math.min(x_begin, x)
          y_begin = Math.min(y_begin, y)
          x_end = Math.max(x_end, x)
          y_end = Math.max(y_end, y)
          points.push({ x: x, y: y })
        }
      }
    }
    // 避免边缘被截取调所以+1
    x_end += 1
    y_end += 1
    // 存储截取的滑块图
    sliderImage.crop(x_begin,y_begin,x_end-x_begin, y_end - y_begin).write('./tests/img/slider.png')
    // 更新滑块宽度方便遍历
    sliderWidth = x_end-x_begin
    // 遍历背景图片，寻找匹配滑块图片的位置
    let bestMatchX = 0; // 要滑动到的最佳x值
    let bestMatchScore = 0; // 匹配points边缘点位的分数
    // 遍历背景大图，只需要关心整个横轴，相当于窗口滑动（滑块图原图的y轴跟背景图一样所以不需要遍历y轴）
    for (let x = x_begin; x < bgWidth - sliderWidth; x++) {
      // 截取当前滑到的点为起始点的跟滑块图一样大的图，并二值化
      const cropSection = backgroundImage.clone().crop(x, y_begin, sliderWidth, y_end - y_begin).invert();
      // cropSection.write(`./tests/img/section${x}.png`)
      // 匹配次数初始化
      let matchPoint = 0
      // 遍历滑块的边缘点位进行匹配
      points.forEach((point) => {
        let rgba = Jimp.intToRGBA(cropSection.getPixelColor(point.x, point.y))
        // 只取对应点的黑色边缘部分进行匹配（1,1,1）或者（0,0,0），匹配到则+1
        if (rgba.r +rgba.g + rgba.b < 5) {
          matchPoint++
        }
      })
      // 匹配次数最多的记录下来
      if (matchPoint > bestMatchScore) {
        bestMatchScore = matchPoint
        bestMatchX = x
      }
    }

    // 移动滑块到最佳匹配位置
    // 这一步通常涉及到发送HTTP请求到目标验证服务
    console.log(`滑块应该被移动到X: ${bestMatchX}`);
  })
})