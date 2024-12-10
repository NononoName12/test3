import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    short_desc: "",
    long_desc: "",
    file: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files, // Lưu trữ tất cả các tệp
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Tạo FormData từ state
    const data = new FormData();
    data.append("name", formData.name); // Sử dụng formData.name
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("short_desc", formData.short_desc);
    data.append("long_desc", formData.long_desc);
    // data.append("file", formData.file); // Thêm file vào FormData

    // Lặp qua các tệp đã chọn
    if (formData.file && formData.file.length > 0) {
      // Kiểm tra nếu có tệp
      for (let i = 0; i < formData.file.length; i++) {
        data.append("files", formData.file[i]); // Đảm bảo rằng tên trường 'files' khớp với tên bạn đã dùng trong multer
      }
    }

    try {
      const response = await fetch("http://localhost:5000/admin/add-product", {
        method: "POST",
        body: data,
        credentials: "include", // Bao gồm cookie trong yêu cầu
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        window.location.href = "/products";
      } else {
        if (response.status === 401) {
          // Nếu nhận được mã lỗi 401, chuyển hướng đến trang login
          navigate("/login");
        } else if (response.status === 403) {
          // Nếu nhận được mã lỗi 403, chuyển hướng đến trang login
          navigate("/login", {
            state: { message: "This account does not have access rights" },
          });
        } else if (response.status === 400) {
          alert(result.message);
        }
        // alert(result.message);
      }
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
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter Product Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                className="form-control"
                placeholder="Enter Category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="text"
                name="price"
                className="form-control"
                placeholder="Enter Price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div class="form-group">
              <label>Short Description</label>
              <textarea
                type="text"
                class="form-control"
                rows="3"
                placeholder="Enter Short Description"
                name="short_desc"
                value={formData.short_desc}
                onChange={handleChange}
              ></textarea>
            </div>
            <div class="form-group">
              <label>Long Description</label>
              <textarea
                type="text"
                class="form-control"
                rows="6"
                placeholder="Enter Long Description"
                name="long_desc"
                value={formData.long_desc}
                onChange={handleChange}
              ></textarea>
            </div>
            <div class="form-group">
              <label for="exampleFormControlFile1">
                Upload image (5 images)
              </label>
              <input
                type="file"
                class="form-control-file"
                id="exampleFormControlFile1"
                name="file"
                onChange={handleFileChange}
                multiple
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
