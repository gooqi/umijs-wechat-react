import Toast from 'antd-mobile/es/components/toast'




/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);


export function setUserToken(token: any | any[]) {
  return localStorage.setItem('token', token);
}
export function setUserInfo(userinfo: string | string[]) {
  const proUserInfo = typeof userinfo === 'string' ? [userinfo] : userinfo;
  return localStorage.setItem('userInfo', JSON.stringify(proUserInfo));
}

export function setLS(key: any, value: string) {
  const proValue = typeof value === 'string' ? [value] : value;
  return localStorage.setItem(key, JSON.stringify(proValue));
}

export function getLS(value: string) {
  return JSON.parse(localStorage.getItem(value));
}

export function messageAlert(error: any, msg: string) {
  // message[error](message, 2)
  if(error == 0){
       Toast.show({
                icon: 'success',
                content: msg,
              })
  }else if(error == 1){
       Toast.show({
                icon: 'fail',
                content: msg,
              })
  }
}

//获取参数值
export const getURLParameter = name => {
  return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]);
};


