import Cookies from 'js-cookie'
import md5 from 'js-md5'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function userCode() {
  return '00000919098'
}

export function getSgin(path) {

//   timestamp：时间戳
//   appId：juno-hvac-admin
//   SIGNATURE：md5Key（md5Key：timestamp + secret + appId）进行加密
//   示例：
// md5Key：1678845276292 OiJIUzI1NiIsInR5cCI6IkpQBZ95.eyJ1c2VyX25hbW juno-hvac-admin
//   SIGNATURE：d534b28da902ed1b0d9bc3ed7fb2c30c

  // let uat = {
  //   appid: 'juno-hvac-admin',
  //   secret: 'OiJIUzI1NiIsInR5cCI6IkpQBZ95.eyJ1c2VyX25hbW',
  // }
  //
  // const timestamp = 167884527629 || new Date().getTime()
  // let md5Key = '1678845276292OiJIUzI1NiIsInR5cCI6IkpQBZ95.eyJ1c2VyX25hbWjuno-hvac-admin'
  // md5Key = md5(md5Key)
  // console.log('md5Key', md5Key)
  // return '00000919098'
}


