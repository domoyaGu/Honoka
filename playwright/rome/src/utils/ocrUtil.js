const fs = require('fs');
const axios = require("./axiosUtil");
const log4js = require("./logUtil");
const logger = log4js.getLogger('default'); // 使用默认类别

class OCRService {
    // 从文件路径读取图片并转换为 base64
    static async readImageAsBase64(imagePath) {
        try {
            const imageBuffer = await fs.promises.readFile(imagePath);
            return imageBuffer.toString('base64');
        } catch (err) {
            console.error('读取图片失败:', err);
            throw err;
        }
    }

    // 传入图片 base64 数据，调用 getVC 方法
    static async getVC(vcBuffer) {
        try {
            const params = new URLSearchParams();
            params.append('imgBase64', vcBuffer.toString('base64'));

            const res = await axios({
                url: `/user/dict/generalUrlBase64`,
                method: 'get',
                params,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept-Language': 'zh-cn',
                }
            });
            // 检查 res.data 是否存在，并确保 generalCode 有值，否则返回 null
            if (res && res.data && res.data.generalCode) {
                return res.data.generalCode;
            } else {
                return null; // 返回 null 如果没有识别到数据
            }
        } catch (err) {
            logger.error('验证码识别失败:', err);
            return null; // 如果发生异常，返回 null 而不是抛出错误
        }
    }

    // 从文件路径直接读取图片并传递给 getVC
    static async processImage(imagePath) {
        try {
            const base64Image = await this.readImageAsBase64(imagePath);
            return await this.getVC(base64Image);
        } catch (err) {
            console.error('处理图片时出错:', err);
            throw err;
        }
    }
}

module.exports = OCRService;
