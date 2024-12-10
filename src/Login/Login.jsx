import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./Login.css";

const Login = () => {
  const location = useLocation();
  const { state } = location;
  const [errorMessage, setErrorMessage] = useState(state ? state.message : "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const inputLogin = {
      email,
      password,
    };
    console.log(inputLogin);
    try {
      const response = await fetch("http://localhost:5000/auth/signin", {
        method: "POST", // Chỉ định phương thức POST
        headers: {
          "Content-Type": "application/json", // Đặt tiêu đề Content-Type nếu cần
        },
        body: JSON.stringify(inputLogin), // Chuyển đổi inputLogin thành chuỗi JSON và thêm vào body
        credentials: "include", // Bao gồm cookie trong yêu cầu
      });

      const responseData = await response.json();
      if (!response.ok) {
        setErrorMessage(responseData.errorMessage);
        throw new Error("Network response was not ok");
      }
      // return responseData;
      window.location.href = "/";
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div class="login">
            <div class="heading">
              <h2>Sign in</h2>
              {errorMessage && (
                <div id="formError" class="error">
                  {errorMessage}
                </div>
              )}
              <form action="#">
                <div className="input-group input-group-lg">
                  <span className="input-group-addon">
                    <i className="fa fa-user"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="input-group input-group-lg">
                  <span className="input-group-addon">
                    <i className="fa fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button type="button" className="float" onClick={handleSubmit}>
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
