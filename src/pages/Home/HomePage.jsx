import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { request } from "../../utils/helper";
import './HomePage.css';

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getList(), getDocumentCount(), getTeacherCount()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const getList = async () => {
    try {
      const res = await request("superadmin/auth/listUser", "get");
      if (res && res.data) {
        setUsers(res.data);
        setUserCount(res.data.length);
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const getDocumentCount = async () => {
    try {
      const res = await request("superadmin/document", "get");
      if (res && res.data) {
        setDocCount(res.data.length);
      }
    } catch (error) {
      console.error("Error fetching document list:", error);
    }
  };

  const getTeacherCount = async () => {
    try {
      const res = await request("superadmin/auth/listTeacher", "get");
      if (res && res.data) {
        setTeacherCount(res.data.length);
      }
    } catch (error) {
      console.error("Error fetching teacher list:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Check user role from localStorage
  const userRole = localStorage.getItem("account_type");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white p-6 rounded-lg shadow-md w-3/4 md:w-1/2">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4" style={{ margin: '20px' }}>
          Home
        </h1>
        <Row gutter={[16, 16]}>
          {/* Conditional rendering of Total Users */}
          {userRole !== "teacher" && (
            <Col xs={24} sm={12} md={8} key="total-users">
              <div className="card shadow">
                <h1>Total Users: {userCount}</h1>
              </div>
            </Col>
          )}

          <Col xs={24} sm={12} md={8} key="total-documents">
            <div className="card shadow">
              <h1>Total Documents: {docCount}</h1>
            </div>
          </Col>
          {userRole !== "teacher" && (
            <Col xs={24} sm={12} md={8} key="total-teachers">
              <div className="card shadow">
                <h1>Total Teachers: {teacherCount}</h1>
              </div>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
}