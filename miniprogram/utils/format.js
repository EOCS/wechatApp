export function formatDesc(html, count = 50) {
  // 截取前50个字
  return html.replace(/<[^>]+>/g, '').substr(0, count)
}

export function formatDate(ms) {
  let date = new Date(ms)
  let m = date.getMonth() + 1;
  let d = date.getDate();
  return `${toDouble(m)}-${toDouble(d)} ${toDouble(date.getHours())}:${toDouble(date.getMinutes())}`;
}

export function toDouble(num) {
  return +num >= 10 ? num : '0' + num
}

export function getImgSrc(str) {
  const res = str.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1]
  return res ? res[1] : ''
}