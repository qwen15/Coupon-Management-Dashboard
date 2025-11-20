import React from 'react';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';

// Pie chart import
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {

  // Pie Chart Data
  const pieData = {
    labels: ['Issued', 'Redeemed'],
    datasets: [
      {
        label: 'Coupon Stats',
        data: [100, 9],
        backgroundColor: ['#65c2edff', '#b9bab5ff'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Card variant="borderless">
            <Statistic
              title="Coupon issuance quantity"
              value={100}
              valueStyle={{ color: '#65c2edff' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card variant="borderless">
            <Statistic
              title="Coupon Redeemed quantity"
              value={9}
              valueStyle={{ color: '#424241ff' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
         
            <div style={{ width: 200, height: 200, margin: '0 auto' }}>
              <Pie data={pieData} />
            </div>
         
        </Col>
      </Row>

    </div>
  );
};

export default Dashboard;
