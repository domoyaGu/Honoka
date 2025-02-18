const request = require('request');
const fs = require('fs');
 
// 图片链接
const imageUrl = 'http://groupinsure.zhongbaounion.com/broker/index/verify';
// 本地保存路径
const localPath = './local_image.jpg';
 
request(imageUrl)
  .pipe(fs.createWriteStream(localPath))
  .on('close', () => console.log('图片已保存到：', localPath));
