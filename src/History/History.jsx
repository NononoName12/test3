import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import convertMoney from "../convertMoney";

function History(props) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [history, setHistory] = useState([]);

  const [load, setLoad] = useState(false);

  const [text, setText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:5000/admin/historys";
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
            setErrorMessage(dataJson.message);
            // Nếu nhận được mã lỗi 401, chuyển hướng đến trang login
            navigate("/login"); // Thay đổi đường dẫn đến trang đăng nhập của bạn
          } else if (response.status === 403) {
            // Nếu nhận được mã lỗi 403, chuyển hướng đến trang login
            navigate("/login", {
              state: { message: "This account does not have access rights" },
            }); // Thay đổi đường dẫn đến trang đăng nhập của bạn
          } else {
            throw new Error("Network response was not ok");
          }
        }

        console.log(dataJson);

        setHistory(dataJson);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData(); // Gọi hàm fetch khi component được mount
  }, []); // Chỉ chạy một lần khi component được mount

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="col-7 align-self-center">
            <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
              Basic Initialisation
            </h4>
            <div className="d-flex align-items-center">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 p-0">
                  <li className="breadcrumb-item">
                    <a href="/" className="text-muted">
                      History
                    </a>
                  </li>
                  <li
                    className="breadcrumb-item text-muted active"
                    aria-current="page"
                  >
                    Table
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
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
                      {history &&
                        history.map((value) => (
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

export default History;
