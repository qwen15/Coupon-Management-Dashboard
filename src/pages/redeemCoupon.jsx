import React, { useState } from 'react';
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  TreeSelect,
  Card
} from 'antd';

function Redeem() {
  const [componentSize, setComponentSize] = useState('default');
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      initialValues={{ size: componentSize }}
      onValuesChange={onFormLayoutChange}
      size={componentSize}
      style={{ maxWidth: 600 }}
    >
      <Form.Item
        label='Coupon Code'
        name='couponCode'
        rules={[
          {
            required: true,
            message: 'Please Input Coupon Code',
          },
        ]}
      >
        <Input placeholder='Please Input Coupon Code' />
      </Form.Item>

      <Form.Item 
        label='Purchase Amount'
        name='purchase'
        rules={[
          {
            required: true,
            message: 'Please Input Purchase Amount',
          },
        ]}
      >
        <InputNumber />
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
          Redeem
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Redeem