import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import convertMoney from "../convertMoney";
import feather from "feather-icons";

Home.propTypes = {};

function Home(props) {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [ordersCount, setOrdersCount] = useState(null);
  const [usersCount, setUsersCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:5000/admin";
        const response = await fetch(url, {
          method: "GET", // Chỉ định phương thức GET
          headers: {
            "Content-Type": "application/json", // Đặt tiêu đề Content-Type nếu cần
          },
          credentials: "include", // Bao gồm cookie trong yêu cầu
        });

        const dataJson = await response.json(); // Cần await để nhận dữ liệu JSON
        // Kiểm tra nếu phản hồi không ok (status khác 2xx)
        if (!response.ok) {
          if (response.status === 401) {
            // Nếu nhận được mã lỗi 401, chuyển hướng đến trang login
            navigate("/login");
          } else if (response.status === 403) {
            // Nếu nhận được mã lỗi 403, chuyển hướng đến trang login
            navigate("/login", {
              state: { message: "This account does not have access rights" },
            });
          } else {
            throw new Error("Network response was not ok");
          }
        }

        console.log(dataJson); // Log ra dữ liệu phản hồi từ API

        setStats(dataJson.orders); // Cập nhật state với danh sách sản phẩm
        setOrdersCount(dataJson.ordersCount);
        setUsersCount(dataJson.usersCount);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData(); // Gọi hàm fetch khi component được mount
  }, []); // Chỉ chạy một lần khi component được mount

  useEffect(() => {
    feather.replace();
  }, []);

  useEffect(() => {
    const currentMonth = new Date().getMonth(); // Tháng hiện tại (0-11)
    const currentYear = new Date().getFullYear(); // Năm hiện tại

    const totalEarnings = stats.reduce((total, order) => {
      const orderDate = new Date(order.createdAt);

      // Kiểm tra nếu đơn hàng nằm trong tháng và năm hiện tại
      if (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      ) {
        return total + order.totalPrice; // Cộng tổng giá trị đơn hàng vào tổng
      }
      return total;
    }, 0);

    setEarnings(totalEarnings); // Cập nhật trạng thái doanh thu
  }, [stats]); // Chạy khi orders thay đổi
  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="col-7 align-self-center">
            <div className="d-flex align-items-center">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 p-0">
                  <li className="breadcrumb-item">
                    <Link to="/">Dashboard</Link>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="card-group">
          <div className="card border-right">
            <div className="card-body">
              <div className="d-flex d-lg-flex d-md-block align-items-center">
                <div>
                  <div className="d-inline-flex align-items-center">
                    <h2 className="text-dark mb-1 font-weight-medium">
                      {usersCount}
                    </h2>
                  </div>
                  <h6 className="text-muted font-weight-normal mb-0 w-100 text-truncate">
                    Clients
                  </h6>
                </div>
                <div className="ml-auto mt-md-3 mt-lg-0">
                  <span className="opacity-7 text-muted">
                    <i data-feather="user-plus"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="card border-right">
            <div className="card-body">
              <div className="d-flex d-lg-flex d-md-block align-items-center">
                <div>
                  <h2 className="text-dark mb-1 w-100 text-truncate font-weight-medium">
                    {convertMoney(earnings)}
                    <sup className="set-doller"> VNĐ</sup>
                  </h2>
                  <h6 className="text-muted font-weight-normal mb-0 w-100 text-truncate">
                    Earnings of Month
                  </h6>
                </div>
                <div className="ml-auto mt-md-3 mt-lg-0">
                  <span className="opacity-7 text-muted">
                    <i data-feather="dollar-sign"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="card border-right">
            <div className="card-body">
              <div className="d-flex d-lg-flex d-md-block align-items-center">
                <div>
                  <div className="d-inline-flex align-items-center">
                    <h2 className="text-dark mb-1 font-weight-medium">
                      {ordersCount}
                    </h2>
                  </div>
                  <h6 className="text-muted font-weight-normal mb-0 w-100 text-truncate">
                    New Order
                  </h6>
                </div>
                <div className="ml-auto mt-md-3 mt-lg-0">
                  <span className="opacity-7 text-muted">
                    <i data-feather="file-plus"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">History</h4>
                <br />
                <div className="table-responsive">
                  <table className="table table-striped table-bordered no-wrap">
                    <thead>
                      <tr>
                        <th>ID User</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Total</th>
                        <th>Delivery</th>
                        <th>Status</th>
                        <th>Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats &&
                        stats.map((value) => (
                          <tr key={value._id}>
                            <td>{value.customer.userId}</td>
                            <td>{value.customer.name}</td>
                            <td>{value.customer.phone}</td>
                            <td>{value.customer.address}</td>
                            <td>{convertMoney(value.totalPrice)} VNĐ</td>
                            <td>
                              {value.delivery
                                ? "Đã Vận Chuyển"
                                : "Chưa Vận Chuyển"}
                            </td>
                            <td>
                              {value.status
                                ? "Đã Thanh Toán"
                                : "Chưa Thanh Toán"}
                            </td>
                            <td>
                              <a
                                style={{
                                  cursor: "pointer",
                                  color: "white",
                                }}
                                className="btn btn-success"
                              >
                                View
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer text-center text-muted"></footer>
    </div>
  );
}

export default Home;
