import React from "react";
import { Form, Input, InputNumber, Button, message } from "antd";

const Redeem = () => {
  // Submit handler for the redeem form
  const onFinish = async (values) => {
    //console.log("Form values:", values);

    try {
      // Call backend API to redeem coupon
      const res = await fetch("http://localhost:3000/coupons/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        message.error(data.error || "Redeem failed");
        return;
      }

      message.success(
        <>
          Coupon redeemed! <br />
          Purchase Amount: ${values.purchaseAmount} <br />
          Discount: ${data.discount} <br />
          Final Amount: ${data.finalAmount}
        </>
      );
    } catch (err) {
      console.error(err);
      message.error("Network error");
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
        name="redeem"
        onFinish={onFinish}
        layout="horizontal"
        style={{ maxWidth: 400 }}
      >
        <Form.Item
          label="Coupon Code"
          name="id"
          rules={[{ required: true, message: "Please input coupon Code" }]}
        >
          <Input placeholder="e.g. 1" />
        </Form.Item>

        <Form.Item
          label="Purchase Amount"
          name="purchaseAmount"
          rules={[{ required: true, message: "Please input purchase amount" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g. 50" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Redeem Coupon
        </Button>
      </Form>
    </div>
  );
};

export default Redeem;
