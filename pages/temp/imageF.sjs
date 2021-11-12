var filterFunc2 = function (imgUrl, baseUrl, width, height) {
  var patt = getRegExp('https:');

  if (patt.test(imgUrl)) {
    if (width && !height) {
      return imgUrl + '?imageView2/2/w/' + width;
    } else if (!width && height) {
      return imgUrl + '?imageView2/2/h/' + height;
    } else if (width && height) {
      return imgUrl + '?imageView2/1/w/' + width + '/h/' + height;
    } else {
      return imgUrl;
    }
  } else {
    return baseUrl + imgUrl;
  }
};

var filterFunc = function (src, baseUrl, w, h) {
  if (!src) {
    return '';
  }

  var patt = getRegExp('https:|http:');

  if (patt.test(src)) {
    if (h) {
      src = src + '?x-oss-process=image/resize,m_lfit,h_' + h + ',w_' + w;
    } else {
      if (w) {
        src = src + '?x-oss-process=image/resize,w_' + w;
      }
    }

    return src;
  } else {
    if (src[0] == '/') {
      return baseUrl + src;
    } else {
      return baseUrl + '/' + src;
    }
  }
};

var distanceFunc = function (number, number2) {
  var res = number / number2;
  return res.toFixed(2);
};

var filterReplace = function (str) {
  if (!str) {
    return '';
  }

  var patt = getRegExp('<.+?>', 'g');
  str = str.replace(patt, '');
  var patt2 = getRegExp('\/', 'g');
  str = str.replace(patt2, '');
  return str;
}; //毫秒转成时刻


var haomiaoToDate = function (miao) {
  var date = getDate(miao * 1000);
  console.log(miao);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var str = '';
  str += year + '.' + month + '.' + day;
  return str;
}; //字符截取


var zifuJiequ = function (str, number) {
  if (str.length <= number) {
    return str;
  } else {
    str = str.substring(0, number);
    str += '...';
    return str;
  }
}; //toFixed


var toFixedFunc = function (str, num) {
  if (!str) {
    return 0.00;
  }

  return parseFloat(str).toFixed(num);
};

var getGapTime = function (date) {
  //传入的date为‘yyyy-mm-dd hh:mm:ss’形式的
  if (!date) {
    return "";
  }

  var re = "00";
  var reg = getRegExp("-", "g");
  var fmt2 = date.replace(reg, '/');
  var timestamp = getDate().getTime();
  timestamp = parseInt(timestamp / 1000); //发表文章的时间戳 s

  var publicstamp = getDate(fmt2).getTime();
  publicstamp = parseInt(publicstamp / 1000); //时间差s

  var gap = timestamp - publicstamp;

  if (gap < 60) {
    re = "刚刚";
  } else if (gap < 60 * 60) {
    re = parseInt(gap / 60) + "分钟前";
  } else if (gap < 60 * 60 * 24) {
    re = parseInt(gap / 60 / 60) + "小时前";
  } else if (gap < 60 * 60 * 24 * 30) {
    re = parseInt(gap / 60 / 60 / 24) + "天前";
  } else {
    var shijian = date.substring(0, 10);
    re = shijian; //时间超过1个月返回具体的 年-月-日
  }

  return re;
};

export default {
  filterFunc2: filterFunc2,
  filterFunc: filterFunc,
  distanceFunc: distanceFunc,
  filterReplace: filterReplace,
  haomiaoToDate: haomiaoToDate,
  zifuJiequ: zifuJiequ,
  toFixedFunc: toFixedFunc,
  getGapTime: getGapTime
};