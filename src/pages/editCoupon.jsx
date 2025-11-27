import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Select, message } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const EditCoupon = ({ visible, onCancel, onSave, coupon }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    //fix: form data each time the pop-up window opens
    if (visible && coupon) {
      form.setFieldsValue({
        name: coupon.name,
        minPurchase: coupon.minPurchase,
        discount: coupon.discount,
        status: coupon.status,
        expireDate: dayjs(coupon.expireDate),
      });
    }
  }, [visible, coupon, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const updatedCoupon = {
        ...coupon,
        ...values,
        expireDate: values.expireDate.format("YYYY-MM-DD"),
      };

      onSave(updatedCoupon);
      form.resetFields();
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Edit Coupon"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Save"
    >
      <Form form={form} layout="horizontal">
        <Form.Item
          name="name"
          label="Coupon Name"
          rules={[{ required: true, message: "Please input coupon name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="minPurchase"
          label="Minimum Purchase"
          rules={[{ required: true, message: "Please input minimum purchase!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="discount"
          label="Discount"
          rules={[{ required: true, message: "Please input discount!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status!" }]}
        >
          <Select>
            <Option value="valid">Valid</Option>
            <Option value="expired">Expired</Option>
            <Option value="redeemed">Redeemed</Option>
          </Select>

        </Form.Item>

        <Form.Item
          name="expireDate"
          label="Expiry Date"
          rules={[{ required: true, message: "Please select expiry date!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCoupon;
