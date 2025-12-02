import { Typography, Form, Input, InputNumber, Select, DatePicker, Button, message } from "antd";

const AddCoupon = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      // Convert Day.js date object to string in "YYYY-MM-DD" format
      const payload = {
        ...values,
        expireDate: values.expireDate.format("YYYY-MM-DD"), // day.js
      };

      // Send POST request to backend API to add a new coupon
      const res = await fetch("http://localhost:3000/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      message.success("Coupon added successfully!");
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error("Failed to add coupon");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",

      }}
    >
      <Form
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        style={{ maxWidth: 400 }}
      >

        <Form.Item
          name="name"
          label="Coupon Name"
          rules={[{ required: true, message: "Please input coupon name" }]}
        >
          <Input placeholder="e.g. save5" />
        </Form.Item>

        <Form.Item
          name="minPurchase"
          label="Minimum Purchase"
          rules={[{ required: true, message: "Please input minimum purchase" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 50" />
        </Form.Item>

        <Form.Item
          name="discount"
          label="Discount"
          rules={[{ required: true, message: "Please input discount amount" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 5" />
        </Form.Item>

        <Form.Item
          name="expireDate"
          label="Expire Date"
          rules={[{ required: true, message: "Please select expire date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Add Coupon
          </Button>
        </Form.Item>
      </Form>
    </div>

  );
};

export default AddCoupon;
