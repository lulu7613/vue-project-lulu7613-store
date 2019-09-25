// 製作一個 currency (千分位 + $ 字號) 的 JS 檔
// 在 main.js 使用 Vue.filter('自定義名稱', 匯入檔案) 匯入，直接將這個方法註冊在全域 (App.vue)
// 匯入後即可在 App.vue 下的任何元件中使用
// Vue.filter 方法是使用 JS 原生的 filter 方法

export default function (num) {
  if (isNaN(num)) { // num = NaN
    let num = `$${0}`
    return num
  }

  const n = Number(num)
  return `$${n.toFixed(0).replace(/./g, (c, i, a) => {
    const currency = (i && c !== '.' && ((a.length - i) % 3 === 0) ? `, ${c}`.replace(/\s/g, '') : c)
    return currency
  })}`
}
