import React, { useState, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logoicon from "../Image/logo-icon.png";
import Logotext from "../Image/logo-text.png";
import Logolight from "../Image/logo-light-text.png";
import feather from "feather-icons";

function Header(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    feather.replace(); // Khởi tạo feather icons sau khi component render
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include", // Đảm bảo gửi cookie nếu cần
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.message);
      } else {
        // Xử lý sau khi logout thành công
        window.location.href = "/login"; // Chuyển hướng đến trang login hoặc trang khác
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
          throw new Error("Network response was not ok");
        }

        console.log(dataJson); // Log ra dữ liệu phản hồi từ API

        setUser(dataJson.user); // Cập nhật state với danh sách sản phẩm
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData(); // Gọi hàm fetch khi component được mount
  }, []); // Chỉ chạy một lần khi component được mount

  return (
    <header className="topbar" data-navbarbg="skin6">
      <nav className="navbar top-navbar navbar-expand-md">
        <div className="navbar-header" data-logobg="skin6">
          <a
            className="nav-toggler waves-effect waves-light d-block d-md-none"
            href="#"
          >
            <i className="ti-menu ti-close"></i>
          </a>
          <div className="navbar-brand">
            <Link to="/">
              <span className="logo-text">
                <span>Admin Page</span>
              </span>
            </Link>
          </div>
        </div>
        <div className="navbar-collapse collapse" id="navbarSupportedContent">
          <ul className="navbar-nav float-left mr-auto ml-3 pl-1">
            <li className="nav-item dropdown"></li>
          </ul>
          <ul className="navbar-nav float-right">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {!user && (
                  <button
                    className="btn btn-primary ml-2 d-none d-lg-inline-block"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                )}
              </a>
              <a
                className="nav-link dropdown-toggle"
                href="#"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {user && (
                  <>
                    {" "}
                    <span className="ml-2 d-none d-lg-inline-block">
                      <span>Hello,</span>{" "}
                      <span className="text-dark">{user.email}</span>
                    </span>
                    {"   "}
                    <button
                      className="btn btn-primary ml-2 d-none d-lg-inline-block"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                )}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
