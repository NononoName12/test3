import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUser = () => {
  const navigate = useNavigate;
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "customer",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(
        `http://localhost:5000/admin/edit-user/${id}`,
        {
          method: "GET", // Chỉ định phương thức GET
          headers: {
            "Content-Type": "application/json", // Đặt tiêu đề Content-Type nếu cần
          },
          credentials: "include", // Bao gồm cookie trong yêu cầu
        }
      );
      const data = await response.json();
      console.log(data);
      setUser(data);
      setFormData(data); // Cập nhật formData với dữ liệu sản phẩm
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputForm = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
    };
    console.log(inputForm);


    try {
      const response = await fetch(
        `http://localhost:5000/admin/edit-user/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputForm),
          credentials: "include", // Bao gồm cookie trong yêu cầu
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        if (response.status === 401) {
          // Nếu nhận được mã lỗi 401, chuyển hướng đến trang login
          navigate("/login");
        } else if (response.status === 403) {
          // Nếu nhận được mã lỗi 403, chuyển hướng đến trang login
          navigate("/login", {
            state: { message: "This account does not have access rights" },
          });
        }
        alert("Đã xảy ra lỗi: " + result.message);
      }
      window.location.href = "/users";
    } catch (error) {
      console.error("Error:", error);
      alert("Đã xảy ra lỗi khi gửi yêu cầu!");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <form
            style={{ width: "50%", marginLeft: "40px" }}
            enctype="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                placeholder="Enter Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="text"
                name="email"
                className="form-control"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input
                type="phone"
                name="phone"
                className="form-control"
                placeholder="Enter Phone"
                value={formData.phone}
                onChange={handleChange}
              ></input>
            </div>
            <div class="form-group">
              {user && user.role && user.role === "admin" ? (
                <label style={{ marginRight: "10px" }}>Role: Admin</label>
              ) : (
                <div style={{ marginBottom: "100px" }}>
                  <label style={{ marginRight: "10px" }}>Role</label>
                  <select
                    id="role"
                    name="role"
                    style={{
                      marginRight: "10px",
                      width: "150px",
                      padding: "5px",
                      cursor: "pointer",
                      transition: "border-color 0.3s",
                    }}
                    value={formData.role}
                    onChange={handleChange} // Gán hàm handleChange cho sự kiện onChange
                  >
                    <option value="customer">Customer</option>
                    <option value="consultant">Consultant</option>
                  </select>
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
