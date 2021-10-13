// @ts-ignore
/* eslint-disable */
import { request } from 'umi';



//微信登录
export async function wechatlogin(params: any) {
  return request('/api/wechat/login', {
    method: 'POST',
    data: params,
  });
}

//开发时登录
export async function fakeLogin(params: any) {
  return request('/api/wechat/fakeLogin', {
    method: 'POST',
    data: params,
  });
}

//重复登录
export async function loginAgain(params: any) {
  return request(`/tapi/wechat/loginAgain`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

