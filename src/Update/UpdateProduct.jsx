import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {
  const navigate = useNavigate;
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    short_desc: "",
    long_desc: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(
        `http://localhost:5000/admin/edit-product/${id}`,
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
      setProduct(data);
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
    // Tạo FormData từ state
    const data = new FormData();
    data.append("name", formData.name); // Sử dụng formData.name
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("short_desc", formData.short_desc);
    data.append("long_desc", formData.long_desc);

    for (let pair of data.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    try {
      const response = await fetch(
        `http://localhost:5000/admin/edit-product/${id}`,
        {
          method: "PUT",
          body: data,
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
      window.location.href = "/products";
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
            <div className="file-names">
              <label for="exampleFormControlFile1">Image</label>
              {product && product.img1 && (
                <p>
                  <span style={{ fontWeight: "bold" }}>img1: </span>
                  {product.img1}
                </p>
              )}
              {product && product.img2 && (
                <p>
                  <span style={{ fontWeight: "bold" }}>img2: </span>
                  {product.img2}
                </p>
              )}
              {product && product.img3 && (
                <p>
                  <span style={{ fontWeight: "bold" }}>img3: </span>
                  {product.img3}
                </p>
              )}
              {product && product.img4 && (
                <p>
                  <span style={{ fontWeight: "bold" }}>img4: </span>
                  {product.img4}
                </p>
              )}
              {product && product.img5 && (
                <p>
                  <span style={{ fontWeight: "bold" }}>img5: </span>
                  {product.img5}
                </p>
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

export default UpdateProduct;
