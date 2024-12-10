const ProductAPI = {
  getAPI: async (navigate) => {
    const url = "http://localhost:5000/admin/products";
    const response = await fetch(url, {
      method: "GET", // Chỉ định phương thức GET
      headers: {
        "Content-Type": "application/json", // Đặt tiêu đề Content-Type nếu cần
      },
      credentials: "include", // Bao gồm cookie trong yêu cầu
    });

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

    return response.json(); // Chuyển đổi dữ liệu phản hồi thành JSON
  },

  getPagination: async (query) => {
    const url = `http://localhost:5000/admin/products/pagination${query}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Bao gồm cookie trong yêu cầu
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  },

  getPaginationUser: async (query) => {
    const url = `http://localhost:5000/admin/users/pagination${query}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Bao gồm cookie trong yêu cầu
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  },
};

export default ProductAPI;
