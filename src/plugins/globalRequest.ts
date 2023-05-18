/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import {extend} from 'umi-request';
import {message} from "antd";
import {history} from 'umi';
import {stringify} from "qs";

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  // 默认请求是否带上cookie
  credentials: 'include',
  //配置不同环境下请求接口的路径：只需要配置production就可以了，本地的话走代理
  prefix:process.env.NODE_ENV === 'production'?'http://user-backend.code-nav.cn':undefined
});


/**
 * 所以请求拦截器
 */
request.interceptors.request.use((url, options): any => {
  return {
    url,
    options: {
      ...options,
      // headers: {
      //   Authorization: getAccessToken(),
      // },
    },
  };
});

/**
 * 所有响应拦截器
 */
request.interceptors.response.use(async (response): Promise<any> => {
  const res = await response.clone().json();
  if (res.code === 0) {
   return res.data;
  }
  if(res.code === 40100){
    message.error("请先登录");
    history.replace({
      pathname:'/user/login',
      search:stringify({
        redirect:location.pathname
      })
    })
  }else {
    message.error(res.description);
  }
  return res.data;
});

export default request;
