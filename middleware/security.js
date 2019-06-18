/* 安全性校验中间件 */
const config = require('../config')
const jwt = require('jsonwebtoken')

whitelist = [{ path: '/users/.*$' }]

const isInWhitelist = (path, method) => {
  const filterList = whitelist.filter(
    item =>
      new RegExp(item.path).test(path) &&
      (!item.method || method === item.method.toUpperCase())
  )
  return !!filterList.length
}

module.exports = async (ctx, next) => {
  if (isInWhitelist(ctx.path, ctx.method)) return await next()

  const auth = ctx.headers.auth
  if (!auth) {
    return ctx.throw(401, 'Unauthorized.')
  }
  try {
    const user = jwt.verify(auth, config.SECRET_KEY)
  } catch (error) {
    return ctx.throw(403, 'Invalid token.')
  }
  ctx.currentUser = user
  await next()
}
