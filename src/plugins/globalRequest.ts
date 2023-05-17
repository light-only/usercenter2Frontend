/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import {extend} from 'umi-request';
import {notification} from 'antd';
import {history} from 'umi';



/**
 * 所以请求拦截器
 */
request.interceptors.request.use((url, options): any => {
  return {
    url,
    options: {
      ...options,
      headers: {
        Authorization: getAccessToken(),
      },
    },
  };
});

/**
 * 所有响应拦截器
 */
request.interceptors.response.use(async (response, options): Promise<any> => {

  const {url, status} = response;
  if (url.indexOf('/system/oauth/token') !== -1) {
    return response;
  }
  // 返回下载流的问题,可以在url添加标识
  if (url.indexOf('/download/') !== -1) {
    if (status !== 200) {
      notification.error({
        message: `下载出错 : ${url}`,
      });
    } else {
      return await response.clone().blob();
    }
    return null;
  }

  const data = await response.clone().json();
  // console.log(data)
  if ((status === 200 && data.code !== 1) || (status !== 200 && data.data !== undefined)) {
    // 处理参数问题
    let noParamUrl = url;
    if (url.indexOf('?') !== -1) {
      noParamUrl = url.substring(0, url.indexOf('?'));
    }
    const msg = (data.data === null || stringUtil.isEmpty(data?.data?.exceptionMsg)) ? data.msg : data.data.exceptionMsg;
    notification.error({
      message: `请求出错 [${data.code}]: ${noParamUrl}`,
      description: msg,
    });
  }
  return response;
});

export default request;
