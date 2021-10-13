import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
//import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import {  getLS, setLS,getURLParameter } from '@/utils/utils';
import { isWeixin, wxDirect, hasToken, funcUrlDel,devLogin } from '@/utils/wechat';
import { wechatlogin } from './services/login';

const isDev = process.env.NODE_ENV === 'development';


/** 获取用户信息比较慢的时候会展示一个 loading */
/*export const initialStateConfig = {
  loading: <PageLoading />,
};*/

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  // settings?: Partial<LayoutSettings>;
  // currentUser?: API.CurrentUser;
  // fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  // const fetchUserInfo = async () => {
  //   try {
  //     const msg = await queryCurrentUser();
  //     return msg.data;
  //   } catch (error) {
  //     history.push(loginPath);
  //   }
  //   return undefined;
  // };

  //用于IOS微信分享的入口链接
  localStorage.setItem('rootUrl', window.location.href);
   console.log(isDev)
  if (!isDev) {
    if (isWeixin() == false) {
       //在非微信的情况下，推送到提示页面
      //history.push(notWeiXin)
      return;
    }  
    //检查Token,没有Token的情况下
    if (isWeixin() && !hasToken()) {
      const code = getURLParameter('code');
      if (typeof code != 'string' || code == 'null') {
        wxDirect()
      } else {
        const response = await wechatlogin({ code });
        if (response.error == 0) {
            localStorage.setItem('token', response.token);
            setLS('userInfo', response.data);
            //存储好用户信息后，移除code，刷新页面
            let local = funcUrlDel('state', funcUrlDel('code', window.location.href));
            window.location.replace(local)
          } else {
            wxDirect()
          }
      }
    }
  }else{
      //开发登录
      //devLogin()
  }


  // 如果是登录页面，不执行
  //if (history.location.pathname !== notWeiXin) {
    // const currentUser = await fetchUserInfo();
    // return {
    //   fetchUserInfo,
    //   currentUser,
    //   settings: {},
    // };
  //}
  return {
    // fetchUserInfo,
    // settings: {},
  };
}


/*export const request: RequestConfig = {
  errorHandler: (error: any) => {
    const { response } = error;

    if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
    throw error;
  },
};*/


