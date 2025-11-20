import React from 'react';
import { Space, Table, Tag } from 'antd';
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: 'Expiration Date',
    dataIndex: 'exdate',
    key: 'exdate',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: (_, { status }) => (
      <>
        {status.map(status => {
          let color = status === 'valid' ? 'green' : 'geekblue';
          
          return (
            <Tag color={color} key={status}>
              {status.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Edit</a>
        <a>Void</a>
      </Space>
    ),
  },
];
const data = [
  {
    name: 'save5',
    code: '1',
    value: '5',
    exdate: 'Nov.1',
    status: ['valid'],
  },
  {
    name: 'save10',
    code: '2',
    value: '10',
    exdate: 'Nov.1',
    status: ['invalid'],
  },
  {
    name: 'save15',
    code: '3',
    value: '15',
    exdate: 'Nov.1',
    status: ['valid'],
  },
];
const List = () => <Table columns={columns} dataSource={data} />;
export default List;