import React, { useEffect, useState } from "react";
import { Card, Avatar, Statistic, Row, Col, Table, Progress } from "antd";
import { DollarTwoTone, ShopOutlined, TagOutlined } from '@ant-design/icons';
import "./dashboard.css"

// Pie chart import
// import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/coupons")
      .then(res => res.json())
      .then(data => setCoupons(data));
  }, []);

  const total = coupons.length;
  const valid = coupons.filter(c => c.status === "valid").length;
  const expired = coupons.filter(c => c.status === "expired").length;
  const used = coupons.filter(c => c.status === "redeemed").length;

  return (
    <><div style={{ padding: 20 }}>
      {/* Summary Cards */}
      <Row gutter={16}>
        <Col span={6}>
          <Card className="dash-card blue-card" variant="plain">
            <div className="dash-header">
              <span className="dash-title">Coupon Issuance Quantity</span>
              <TagOutlined className="dash-icon blue" />
            </div>

            <div className="dash-content">
              {/* <TagOutlined className="dash-main-icon blue" /> */}
              <div className="dash-number blue">{total}</div>
              <div className="dash-desc">Total coupons issued</div>

              <Progress
                percent={total ? Math.round((total / total) * 100) : 0}
                status="active"
                strokeColor="#1677ff" />
            </div>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="dash-card green-card" variant="plain">
            <div className="dash-header">
              <span className="dash-title">Coupon Valid Quantity</span>
              <TagOutlined className="dash-icon green" />
            </div>

            <div className="dash-content">
              {/* <TagOutlined className="dash-main-icon blue" /> */}
              <div className="dash-number green">{valid}</div>
              <div className="dash-desc">Total coupons valid</div>

              <Progress
                percent={total ? Math.round((valid / total) * 100) : 0}
                status="active"
                strokeColor="#52c41a" />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dash-card orange-card" variant="plain">
            <div className="dash-header">
              <span className="dash-title">Coupon Redeemed Quantity</span>
              <TagOutlined className="dash-icon orange" />
            </div>

            <div className="dash-content">
              <div className="dash-number orange">{used}</div>
              <div className="dash-desc">Total coupons redeemed</div>

              <Progress
                percent={total ? Math.round((used / total) * 100) : 0}
                status="active"
                strokeColor="orange" />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="dash-card red-card" variant="plain">
            <div className="dash-header">
              <span className="dash-title">Coupon Expired Quantity</span>
              <TagOutlined className="dash-icon red" />
            </div>

            <div className="dash-content">
              {/* <TagOutlined className="dash-main-icon blue" /> */}
              <div className="dash-number red">{expired}</div>
              <div className="dash-desc">Total coupons expired</div>

              <Progress
                percent={total ? Math.round((expired / total) * 100) : 0}
                status="active"
                strokeColor="#c43f1a" />
            </div>
          </Card>
        </Col>
      </Row>

    </div>
    </>
  );

};

export default Dashboard;
