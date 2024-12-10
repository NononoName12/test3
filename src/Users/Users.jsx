import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import ProductAPI from "../API/ProductAPI";
import Pagination from "./Component/Pagination";

function Users(props) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [documentsUsers, setDocumentsUsers] = useState([]);

  // Cập nhật documentsHotels khi hotels thay đổi
  useEffect(() => {
    if (users) {
      setDocumentsUsers(users);
    }
  }, [users]);

  const [pagination, setPagination] = useState({
    page: "1",
    count: "8",
    search: "",
    category: "all",
  });

  const onChangeText = (e) => {
    const value = e.target.value;

    setPagination({
      page: pagination.page,
      count: pagination.count,
      search: value,
      category: pagination.category,
    });
  };

  //Tổng số trang
  const [totalPage, setTotalPage] = useState();

  //Hàm này dùng để thay đổi state pagination.page
  //Nó sẽ truyền xuống Component con và nhận dữ liệu từ Component con truyền lên
  const handlerChangePage = (value) => {
    console.log("Value: ", value);

    //Sau đó set lại cái pagination để gọi chạy làm useEffect gọi lại API pagination
    setPagination({
      page: value,
      count: pagination.count,
      search: pagination.search,
      category: pagination.category,
    });
  };

  //Gọi hàm useEffect tìm tổng số sản phẩm để tính tổng số trang
  //Và nó phụ thuộc và state pagination
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const url = "http://localhost:5000/admin/users";
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
        //Tính tổng số trang = tổng số user / số lượng user 1 trang
        const totalPage = Math.ceil(
          parseInt(dataJson.length) / parseInt(pagination.count)
        );
        console.log(totalPage);
        setTotalPage(totalPage);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchAllData();
  }, [pagination]);

  // Gọi hàm Pagination
  useEffect(() => {
    const fetchData = async () => {
      const params = {
        page: pagination.page,
        count: pagination.count,
        search: pagination.search,
        category: pagination.category,
      };

      const query = queryString.stringify(params);

      const newQuery = "?" + query;

      const response = await ProductAPI.getPaginationUser(newQuery);
      console.log(response);

      setUsers(response.users);
    };

    fetchData();
  }, [pagination]);

  const handleUpdate = (id) => {
    console.log(id);
    navigate(`/updateUser/${id}`);
  };

  const handleDelete = async (id) => {
    // Hiển thị thông báo xác nhận
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:5000/admin/delete-user/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Nếu cần gửi cookie
          }
        );
        const data = await response.json();
        if (response.ok) {
          // Cập nhật lại danh sách document bằng cách loại bỏ document vừa xóa
          setDocumentsUsers((prevDocuments) =>
            prevDocuments.filter((doc) => doc._id !== id)
          );
        } else {
          const err = window.confirm(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

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
                      Home
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
                <h4 className="card-title">Users</h4>
                <input
                  className="form-control w-25"
                  type="text"
                  placeholder="Enter Search!"
                  onChange={onChangeText}
                />
                <br />
                <div className="table-responsive">
                  <table className="table table-striped table-bordered no-wrap">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Fullname</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentsUsers &&
                        documentsUsers.map((value) => (
                          <tr key={value._id}>
                            <td>{value._id}</td>
                            <td>{value.fullName}</td>
                            <td>{value.email}</td>
                            <td>{value.phone}</td>
                            <td>
                              <a
                                style={{
                                  cursor: "pointer",
                                  color: "white",
                                }}
                                className="btn btn-success"
                                onClick={() => handleUpdate(value._id)}
                              >
                                Update
                              </a>
                              &nbsp;
                              <a
                                style={{
                                  cursor: "pointer",
                                  color: "white",
                                }}
                                className="btn btn-danger"
                                onClick={() => handleDelete(value._id)}
                              >
                                Delete
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <Pagination
                    pagination={pagination}
                    handlerChangePage={handlerChangePage}
                    totalPage={totalPage}
                  />
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

export default Users;
