// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const name = 'lddUser' // 该模版的标识
// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	const type = event.type || 'get_user' // 默认的执行方法
	const res = { name }
	// 预置创建集合，如果存在则自动失败跳过，自己上架时可以去掉
	try { 
	await db.createCollection('ldd_user');
	await db.collection('ldd_user').add({
		// data 字段表示需新增的 JSON 数据
		data: {
			id: wxContext.OPENID,
			count: 0
		}
	})
	.then(res => {
		console.log(res)
	}) } catch (e) {}
  try {
		// 尝试执行执行方法，直接通过名称读取文件，获取其中的执行函数
    res.data = await require(`./function/${type}`)(event, context, cloud)
  } catch (e) {
    res.errmsg = e.toString()
    res.data = false
	}
	return res.data
}