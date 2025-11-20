import React, { useState } from 'react';
import { defaultImg } from '../utils/tools'
import userImg from '../assets/user.png'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileAddOutlined,
  DashboardOutlined,
  CarryOutOutlined,
  UnorderedListOutlined

} from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu, Space, theme } from 'antd';
import { useNavigate } from 'react-router-dom'

const { Header, Sider, Content } = Layout;

const sideOpendata = [
  {
    key: '/admin/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/admin/add',
    icon: <FileAddOutlined />,
    label: 'Create A Coupon',
  },
  {
    key: '/admin/redeem',
    icon: <CarryOutOutlined />,
    label: 'Redeem A Coupon',
  },
  {
    key: '/admin/list',
    icon: <UnorderedListOutlined />,
    label: 'List All Coupon',
  },
];

//const findOpenKey = ();

const MyLayout = ({ children }) => {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout style={{ width: '100vw', height: '100vh' }}>

      <Sider trigger={null} collapsible collapsed={collapsed}>

        <div className="demo-logo-vertical">
          <img src={defaultImg} alt='logo' />
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['/admin/list']}
          onClick={({ key }) => {
            navigate(key);
          }}
          items={sideOpendata}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <span className='app-title'>Coupon Management Dashboard</span>
          <Dropdown
            menu={{
              items: [
                {
                  label: 'Log out',
                  key: 'logout',
                },
              ],
              onClick: ({ key }) => {
                if (key === 'logout') {
                  navigate('/');
                }
              },
            }}
          >
            <img
              src={userImg}
              style={{
                width: '30px',
                float: 'right',
                marginTop: '16px',
                marginRight: '20px'
              }}
            />
          </Dropdown>

        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MyLayout;