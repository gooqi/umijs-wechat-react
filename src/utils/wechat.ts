import { jssdk } from '@/services/service';
import { fakeLogin } from '@/services/login';
const wx = require('weixin-js-sdk');
const appid = 'xxxx'

interface WechatShare {
  title: string; // 分享标题
  desc: string; // 分享描述
  link: string; // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
  imgUrl?: string; // 分享图标
  success?: (arg: any) => void; // 设置成功
}

interface ChooseWXPay {
  appId: string; // appId
  timestamp: number | string; // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
  nonceStr: string; // 支付签名随机串，不长于 32 位
  package: string; // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
  signType: string; // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
  paySign: string; // 支付签名
  success: (res: any) => void; // 支付成功后的回调函数
}

/**
 * 初始化jssdk
 * @param callback 回调函数
 * @param url 初始化链接
 */
const initJssdk = (callback: (arg?: any) => void, url: string) => {
  jssdk({ url }).then((res: any) => {
    if (res.error == 0) {
      const { appId, nonceStr, signature, timestamp } = res.data;
      // url验证成功以后，进行微信配置
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId, // 必填，公众号的唯一标识
        timestamp, // 必填，生成签名的时间戳
        nonceStr, // 必填，生成签名的随机串
        signature,// 必填，签名
        jsApiList: [
          'updateAppMessageShareData',
          'updateTimelineShareData',
          'previewImage',
          'chooseWXPay',
          'hideMenuItems',
          'showMenuItems',
          'hideAllNonBaseMenuItem',
          'showAllNonBaseMenuItem',
        ] // 必填，需要使用的JS接口列表
      });

      callback && callback();
    }
  }).catch((err: any) => {
    console.log(err)
  });
}

/**
 * 分享
 * @param data 分享数据
 * @param url 初始化链接
 */
const share = (data: WechatShare) => {
   let url = ''
   let ua = navigator.userAgent.toLowerCase()
    if ((ua.indexOf('iphone') == -1) && (ua.indexOf('ipad') == -1)){
        url =  window.location.href
    }else{
        url = localStorage.getItem('rootUrl') || ''

    }
    console.log(data)

  initJssdk(() => {
    wx.ready(function () {
      wx.showAllNonBaseMenuItem();
      wx.updateAppMessageShareData(data); // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
      wx.updateTimelineShareData(data); // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
    });
  }, url);
}

/**
 * 隐藏所有非基础按钮接口
 * @param url 初始化链接
 */
const hideAllNonBaseMenuItem = (url: string = window.location.href) => {
  initJssdk(() => {
    wx.ready(function () {
      wx.hideAllNonBaseMenuItem();
    });
  }, url);
}



 /**
 * @Description 获取分享页的当前链接
 * @return IOS 分享的是入口的ROOT，安卓的返回是当前的链接
 * @since 2021/09/27 16:42
 */

const getRootUrl=()=>{
    let ua = navigator.userAgent.toLowerCase()
    if ((ua.indexOf('iphone') == -1) && (ua.indexOf('ipad') == -1)){
        return window.location.href
    }else{
        return localStorage.getItem('rootUrl')

    }
}

/**
 * 微信支付
 * @param config 配置
 */
const chooseWXPay = (config: ChooseWXPay) => {
  wx.chooseWXPay(config);
}


 /**
 * @Description 判断是否微信
 */
const isWeixin = () => {
  let ua = window['navigator']['userAgent'] || window['navigator']['vendor'] || window['opera'];
  return /MicroMessenger/i.test(ua);
};


 /**
 * @Description 微信跳转
 * @since 2021/10/13 01:12
 */
const wxDirect = () => {
  const local = funcUrlDel('state', funcUrlDel('code', window.location.href));
  const encodeUrl = encodeURIComponent(local)
  const redirectUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeUrl}&response_type=code&scope=snsapi_userinfo&state=113&connect_redirect=1#wechat_redirect`;
  window.location.href = redirectUrl;
};


 /**
 * @Description 删除URL地址参数
 * @since 2021/10/13 01:16
 */
const funcUrlDel = (key, sourceURL) => {
  var rtn = sourceURL.split('?')[0],
    param,
    params_arr = [],
    queryString = sourceURL.indexOf('?') !== -1 ? sourceURL.split('?')[1] : '';
  if (queryString !== '') {
    params_arr = queryString.split('&');
    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split('=')[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    rtn = `${rtn}${params_arr.length > 0 ? '?' : ''}${params_arr.join('&')}`;
  }
  return rtn;
};


 /**
 * @Description  判断TOKEN是否存在
 * * @since 2021/10/13 01:17
 */
const hasToken = () => {
  var token = window.localStorage.getItem('token');
  return typeof token == 'string';
};


 /**
 * @Description 开发的时候登录
 * @param  {参数类型} 参数名 参数说明
 * @return {返回值类型} 返回值 返回值说明
 * @since 2021/10/13 16:31
 */

const devLogin = async () =>{

    const response = await fakeLogin();
    if (response) {
        localStorage.setItem("token", response.token);
        if(response.data != undefined){
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        }
        //location.reload();
    }
    return
}




export {
  share,
  hideAllNonBaseMenuItem,
  chooseWXPay,
  getRootUrl,
  isWeixin,
  wxDirect,
  funcUrlDel,
  hasToken,
  devLogin
};
