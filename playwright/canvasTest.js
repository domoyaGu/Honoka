

const { createCanvas, Image } = require('canvas');
const fs = require('fs');
const Jimp = require('jimp');
// 创建Canvas对象
const canvas = createCanvas(35, 35);
const ctx = canvas.getContext('2d');
const text = '高'

// 设置字体样式和大小
ctx.font = '24px sans-serif';
ctx.fillStyle = 'black';
// 写入文字到Canvas上
ctx.fillText(text, 5, 24);
// 将Canvas转换为图片并保存到文件
const stream = fs.createWriteStream('./tests/img/高.png');
canvas.createPNGStream().pipe(stream);

Jimp.read(Buffer.from(canvas.toDataURL('image/png').replace('data:image/png;base64,', ''), 'base64')).then(async (image) => {
  // 获取背景和滑块图片的宽度和高度
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  let blackNum = 0
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const rgba = Jimp.intToRGBA(image.getPixelColor(x, y));
      // 收线排除类白色背景
      if (rgba.a != 0) {
        blackNum++
      }
    }
  }
  console.log(text, blackNum, 372)
})
