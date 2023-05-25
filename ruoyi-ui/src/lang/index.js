// src > lang > index.js

import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui 的语言包，没用到的可以不引入
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui 的语言包，没用到的可以不引入
import elementKoLocale from 'element-ui/lib/locale/lang/ko'// element-ui 的语言包，没用到的可以不引入
import enLocale from './locale/en' // 项目中的语言包 英文
import zhLocale from './locale/zh' // 项目中的语言包 中文
// import koLocale from './locale/ko' // 项目中的语言包 韩文


Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  },
  // ko:{
  //   ...koLocale,
  //   ...elementKoLocale
  // }
}
// 获取当前语言环境：考虑到刷新操作，将语言类型存入缓存
export function getLanguage() {
  const chooseLanguage = Cookies.get('localeLang')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  let language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'en'
}
Cookies.set("localeLang", getLanguage());

const i18n = new VueI18n({
  locale: getLanguage(),
  messages
})

export default i18n
