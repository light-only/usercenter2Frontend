import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import "../Login/index.less"
import {
  LoginForm,
  ProFormText,
  ProConfigProvider,
} from '@ant-design/pro-components';
import {message, Tabs} from 'antd';
import { useState } from 'react';
import { register} from "@/services/ant-design-pro/api";
import {history} from "@@/core/history";

type LoginType =  'account';
const goToLogin = () =>{
  history.push('/user/login');
}
/**
 * 提交表单，调用注册接口
 * @param values
 */
const handleSubmit = async (values: API.RegisterParams) => {
  try {
    // 登录
    const user = await register({ ...values });
    if (user) {
      const defaultLoginSuccessMessage = '注册成功！';
      message.success(defaultLoginSuccessMessage);
      // const urlParams = new URL(window.location.href).searchParams;
      history.push( '/user/login');
      return;
    }
    console.log(user);
    // 如果失败去设置用户错误信息
  } catch (error) {
    const defaultLoginFailureMessage = '注册失败，请重试！';
    console.log(error);
    message.error(defaultLoginFailureMessage);
  }
};

export default () => {
  const [loginType, setLoginType] = useState<LoginType>('account');
  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: 'white' }}>
        <LoginForm
          submitter={{
            // 配置按钮文本
            searchConfig: {
              submitText: '注册',
            }
          }}
          logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
          title="注册页面"
          subTitle="注册页面"
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs
            centered
            activeKey='account'
          >
            <Tabs.TabPane key={'account'} tab={'账号密码注册'} />
          </Tabs>
          {loginType === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                placeholder={'请输入用户账号'}
                rules={[
                  {
                    min:4,
                    type:'string',
                    message:'账号最小长度为4'
                  },
                  {
                    required: true,
                    message: '用户账号不能为空!',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                placeholder={'请输入用户密码'}
                rules={[
                  {
                    min:8,
                    type:'string',
                    message:'密码最小长度为8'
                  },
                  {
                    required: true,
                    message: '用户密码不能为空！',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={'prefixIcon'} />,
                }}
                placeholder={'请再次输入密码'}
                rules={[
                  {
                    min:8,
                    type:'string',
                    message:'密码最小长度为8'
                  },
                  {
                    required: true,
                    message: '确认密码不能为空！',
                  },
                ]}
              />
              <ProFormText
                name="planetCode"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={'prefixIcon'} />,
                }}
                placeholder={'请输入唯一编码'}
                rules={[
                  {
                    max:5,
                    type:'string',
                    message:'编号长度不能大于5'
                  },
                  {
                    required: true,
                    message: '编号不能为空!',
                  },
                ]}
              />
            </>
          )}
          <div
            style={{
              marginBlockEnd: 24,
            }}
          >
            <div className="register">已有账号，<span className="register-span" onClick={goToLogin}>去登录</span></div>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};
