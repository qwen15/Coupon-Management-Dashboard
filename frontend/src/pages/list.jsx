import { useEffect, useState } from "react";
import { Tag, Popconfirm, Table, Button, message } from "antd";
import EditCoupon from "./editCoupon";

const List = () => {
  const [coupons, setCoupons] = useState([]); // state to store coupon list
  const [loading, setLoading] = useState(false); // state for table loading indicator

  const [editingCoupon, setEditingCoupon] = useState(null); // coupon being edited
  const [modalVisible, setModalVisible] = useState(false); // controls EditCoupon modal visibility

  // Fetch coupons from backend
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/coupons");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCoupons(data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  // Load coupons once on component mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  // Triggered when user clicks "Edit"
  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);  // set coupon to edit
    setModalVisible(true); // show modal
  };

  // Triggered when user saves changes in modal
  const handleSave = async (updatedCoupon) => {
    try {
      const res = await fetch(`http://localhost:3000/coupons/${updatedCoupon.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCoupon),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Update state with edited coupon
      setCoupons((prev) =>
        prev.map((c) => (c.id === updatedCoupon.id ? updatedCoupon : c))
      );

      setModalVisible(false); // hide modal
      message.success("Coupon updated successfully!");
    } catch (err) {
      console.error(err);
      message.error("Failed to update coupon");
    }
  };

  // Delete a coupon
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Remove deleted coupon from state
      setCoupons(prev => prev.filter(c => c.id !== id));
      message.success("Coupon deleted successfully!");
    } catch (err) {
      console.error(err);
      message.error("Failed to delete coupon");
    }
  };

  // Define table columns
  const columns = [
    {
      title: "Coupon Code",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Minimum Purchase",
      dataIndex: "minPurchase",
      key: "minPurchase",
      sorter: (a, b) => a.minPurchase - b.minPurchase,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      sorter: (a, b) => a.discount - b.discount,
    },
    {
      title: "Expire Date",
      dataIndex: "expireDate",
      key: "expireDate",
      sorter: (a, b) => new Date(a.expireDate) - new Date(b.expireDate),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => {
        let color = 'green';
        if (status === 'expired') color = 'red';
        if (status === 'redeemed') color = 'orange';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this coupon?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={coupons}
        loading={loading}
        pagination={{ pageSize: 4 }}
      />

      <EditCoupon
        visible={modalVisible}
        coupon={editingCoupon}
        onCancel={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </>
  );
};

export default List;
