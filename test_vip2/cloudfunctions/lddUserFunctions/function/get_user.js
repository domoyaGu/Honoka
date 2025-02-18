const {
  initUser
} = require('../data/user')
module.exports = async function (event, content, cloud) {
  const db = cloud.database()
	const _ = db.command
	// 业务页面传过来的id
  // const {
  //   id
  // } = event.data || {}
	let res = {}
	const openid = cloud.getWXContext().OPENID // 获取微信上下文
  const data = (await db.collection('ldd_user').where({
    _id: openid
	}).get()).data
	res.openid = openid;
	res.data = data;
	res.context = cloud.getWXContext()
  return res
}
