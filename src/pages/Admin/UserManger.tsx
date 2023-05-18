import {  PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import {Button, Image} from 'antd';
import { useRef } from 'react';
import {getSearchUsers} from "@/services/ant-design-pro/api";
import moment from "moment";


// @ts-ignore
// @ts-ignore
const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title:'用户名',
    dataIndex: 'userName',
    copyable:true
  },
  {
    title:'用户账号',
    dataIndex: 'userAccount',
    copyable:true,
    tip: '标题过长会自动收缩',
  },
  {
    title:'头像',
    dataIndex: 'avatarUrl',
    render:(_,record)=>{
      return (
        <div>
          <Image src={record?.avatarUrl} width={50} height={50}/>
        </div>
      )
    },

    copyable:true,
  },
  {
    title:'性别',
    dataIndex: 'gender',
    copyable:true,
    width:50,
    valueEnum:{
      0:{text:'男'},
      1:{text:'女'}
    }
  },
  {
    title:'电话',
    dataIndex: 'phone',
    copyable:true,
    width: 100,
    tip: '标题过长会自动收缩',
    ellipsis: true,
  },
  {
    title:'邮箱',
    dataIndex: 'email',
    copyable:true,
    width: 100,
    tip: '标题过长会自动收缩',
    ellipsis: true,
  },
  {
    title:'角色',
    dataIndex: 'userRole',
    copyable:true,
    valueEnum:{
      0:{text:'普通用户',status:'Default'},
      1:{text:'管理员',status:'Success'}
    }
  },
  {
    title:'创建时间',
    dataIndex: 'createTime',
    copyable:true,
    tip: '标题过长会自动收缩',
    render:(_,record)=>{
      return moment(record.createTime).format('YYYY-MM-DD HH:mm')
    }
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          // @ts-ignore
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.avatarUrl} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();

  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      // @ts-ignore
      request={async (params = {}, sort, filter) => {
        const res = await getSearchUsers();
        const userList = res;
        return {
          data:userList
        }
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            actionRef.current?.reload();
          }}
          type="primary"
        >
          新建
        </Button>
      ]}
    />
  );
};
