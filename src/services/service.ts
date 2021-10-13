
import { request } from 'umi';
/**
 * 微信jssdk
 * @param data 提交数据
 */
export async function jssdk(params: any, options?: { [key: string]: any }) {
  return request('/api/wechat/jssdk', {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
}
