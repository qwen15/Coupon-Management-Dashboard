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

function AddCoupon() {
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
        label='Coupon Name'
        name='couponName'
        rules={[
          {
            required: true,
            message: 'Please Input couponName',
          },
        ]}
      >
        <Input placeholder='Please Input Coupon Name' />
      </Form.Item>
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
        label='Coupon Value'
        name='couponValue'
        rules={[
          {
            required: true,
            message: 'Please Input Coupon Value',
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item 
        label='Minimum Purchase'
        name='minPurchase'
        rules={[
          {
            required: true,
            message: 'Please Input Minimum Purchase',
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item label="Expiration Date">
        <DatePicker />
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
          Create
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddCoupon;