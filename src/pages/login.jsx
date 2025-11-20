import { Row, Col, Card, Form, Input, Button, message } from 'antd';
//import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
//import { loginAPI } from '../services/auth';
import { defaultImg } from '../utils/tools';

function Login() {
  const navigate = useNavigate();
  //const { resetMenus } = useContext(context);
  return (
    <Row>
      <Col
        md={{
          span: 8,
          push: 8,
        }}
        xs={{
          span: 22,
          push: 1,
        }}
      >
        <img
          src={defaultImg}
          style={{
            display: 'block',
            margin: '20px auto',
            borderRadius: '16px',
            width: '200px',
          }}
        />
        <Card title='Coupon Management Dashboard'>
          <Form
            labelCol={{
              md: {
                span: 6,
              },
            }}
            onFinish={ (v) => {
              console.log(v);
            
              message.success('Login Success');
              navigate('/admin/dashboard');
            }}
          >
            <Form.Item
              label='userName'
              name='userName'
              rules={[
                {
                  required: true,
                  message: 'Please Input Username',
                },
              ]}
            >
              <Input placeholder='Please Input Username' />
            </Form.Item>
            <Form.Item
              label='Password'
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Please Input Password',
                },
              ]}
            >
              <Input.Password placeholder='Please Input Password' />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType='submit'
                type='primary'
                style={{
                  display: 'block',
                  margin: '8px auto',
                  width: '20vw',
                }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}

export default Login;