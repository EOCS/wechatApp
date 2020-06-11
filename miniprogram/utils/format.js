export function formatDesc(html, count = 50) {
  // 截取前50个字
  return html.replace(/<[^>]+>/g, '').substr(0, count).trim()
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
  const res = str.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)
  return res ? res[1] : ''
}

export function getByteLen(val) {
  var len = 0;
  for (var i = 0; i < val.length; i++) {
    var a = val.charAt(i);
    if (a.match(/[^\x00-\xff]/ig) != null) {
      len += 2;
    } else {
      len += 1;
    }
  }
  return len;
}