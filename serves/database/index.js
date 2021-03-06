const mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.connect(`${global.config.MONGODB_HOST}/dev_platform`, {
  useNewUrlParser: true,
  useFindAndModify: false
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', async () => {
  console.log('mongodb opened.')
  await initTable()
})

const Menu = require('./models/Menu')
const Role = require('./models/Role')
const User = require('./models/User')
const Project = require('./models/Project')
const addSuperAdmin = async () => {
  const role = await Role.findOne({ tag: 'superadmin' })
  const count = await User.countDocuments({ role: role.id })
  if (!count) {
    await User.register({
      username: 'superadmin',
      password: '12345678',
      email: 'superadmin@platform.com',
      role: role.id,
      nickname: '超级管理员'
    })
  }
}

const initTable = async () => {
  await Menu.initData()
  await Role.initData()
  await addSuperAdmin()
}
