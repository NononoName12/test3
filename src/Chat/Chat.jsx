import React, { useEffect, useState } from "react";
import "./Chat.css";
import { Link, useNavigate } from "react-router-dom";

import io from "socket.io-client";

function Chat(props) {
  const navigate = useNavigate();
  const [checkRoomID, setCheckRoomID] = useState(false);
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeRooms, setActiveRooms] = useState([]);
  const onChangeText = (e) => {
    setMessage(e.target.value);
  };

  console.log(activeRooms);

  useEffect(() => {
    const fetchActiveRooms = async () => {
      try {
        const response = await fetch("http://localhost:5000/chat/chatrooms", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const rooms = await response.json();
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
        } else {
          setActiveRooms(rooms);
        }
      } catch (error) {
        console.error("Error fetching active rooms:", error);
      }
    };

    fetchActiveRooms();

    const newSocket = io("http://localhost:5000", {
      transports: ["websocket"], //phương thức truyền thông mà Socket.IO sẽ sử dụng để kết nối
    });
    setSocket(newSocket);

    // Khi admin chọn phòng nào đó
    if (roomId) {
      newSocket.emit("joinRoom", { roomId, userId: "admin" });
    }

    newSocket.on("activeRooms", (rooms) => {
      console.log("activeRooms");
      setActiveRooms(rooms);
    });

    // Lắng nghe tin nhắn cũ
    newSocket.on("loadMessages", (loadedMessages) => {
      setMessages(loadedMessages); // Load lịch sử chat từ MongoDB
    });

    // Lắng nghe tin nhắn mới
    newSocket.on("message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    newSocket.on("endMess", () => {
      setMessages([]); // Xóa tất cả tin nhắn hiện tại
      setRoomId(null); // Đặt lại roomId về null (hoặc một giá trị mặc định)
      setMessage(""); // Xóa nội dung ô nhập tin nhắn
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, checkRoomID]);

  // Hàm này dùng để gửi tin nhắn cho khách hàng
  const handlerSend = () => {
    // Kiểm tra nếu tin nhắn là "/end" để kết thúc chat
    if (message.trim() === "/end") {
      socket.emit("endChat", { roomId });
      setMessage(""); // Xóa nội dung tin nhắn
      return;
    }

    // Gửi tin nhắn bình thường
    socket.emit("chatMessage", {
      roomId,
      sender: "Admin",
      message: message.trim(),
    });

    // Sau khi gửi tin nhắn, xóa nội dung ô tin nhắn
    setMessage("");
  };

  const handleRoomChat = (roomId) => {
    setCheckRoomID(!checkRoomID);
    console.log(activeRooms);
    // Tìm phòng chat dựa trên roomId
    const selectedRoom = activeRooms.find((room) => room._id === roomId);

    console.log(selectedRoom);

    if (selectedRoom) {
      // Nếu tìm thấy phòng, cập nhật messages state
      setMessages(selectedRoom.messages);
      setRoomId(selectedRoom.roomId);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="col-7 align-self-center">
            <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
              Chat
            </h4>
            <div className="d-flex align-items-center">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 p-0">
                  <li
                    className="breadcrumb-item text-muted active"
                    aria-current="page"
                  >
                    Apps
                  </li>
                  <li
                    className="breadcrumb-item text-muted"
                    aria-current="page"
                  >
                    Chat
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="row no-gutters">
                <div className="col-lg-3 col-xl-2 border-right">
                  <div className="card-body border-bottom">
                    <form>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Search Contact"
                      />
                    </form>
                  </div>
                  <div
                    className="scrollable position-relative"
                    style={{ height: "calc(80vh - 111px)" }}
                  >
                    <ul className="mailbox list-style-none">
                      <li>
                        <div className="message-center">
                          {activeRooms &&
                            activeRooms.map((value) => (
                              <a
                                key={value._id}
                                onClick={() => handleRoomChat(value._id)}
                                className="message-item d-flex align-items-center border-bottom px-3 py-2 active_user"
                              >
                                <div className="user-img">
                                  {" "}
                                  <img
                                    src="https://img.icons8.com/color/36/000000/administrator-male.png"
                                    alt="user"
                                    className="img-fluid rounded-circle"
                                    width="40px"
                                  />{" "}
                                  <span className="profile-status away float-right"></span>
                                </div>
                                <div className="w-75 d-inline-block v-middle pl-2">
                                  <h6 className="message-title mb-0 mt-1">
                                    {value._id}
                                  </h6>
                                </div>
                              </a>
                            ))}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-9  col-xl-10">
                  <div
                    className="chat-box scrollable position-relative"
                    style={{ height: "calc(80vh - 111px)" }}
                  >
                    <ul className="chat-list list-style-none px-3 pt-3">
                      {messages &&
                        messages.map((value) =>
                          value.sender === "Admin" ? (
                            <li
                              className="chat-item odd list-style-none mt-3"
                              key={value.id}
                            >
                              <div className="chat-content text-right d-inline-block pl-3">
                                <div className="box msg p-2 d-inline-block mb-1">
                                  You: {value.message}
                                </div>
                                <br />
                              </div>
                            </li>
                          ) : (
                            <li
                              className="chat-item list-style-none mt-3"
                              key={value.id}
                            >
                              <div className="chat-img d-inline-block">
                                <img
                                  src="https://img.icons8.com/color/36/000000/administrator-male.png"
                                  alt="user"
                                  className="rounded-circle"
                                  width="45"
                                />
                              </div>
                              <div className="chat-content d-inline-block pl-3">
                                <h6 className="font-weight-medium">
                                  {value.name}
                                </h6>
                                <div className="msg p-2 d-inline-block mb-1">
                                  Client: {value.message}
                                </div>
                              </div>
                              <div className="chat-time d-block font-10 mt-1 mr-0 mb-3"></div>
                            </li>
                          )
                        )}
                    </ul>
                  </div>
                  <div className="card-body border-top">
                    <div className="row">
                      <div className="col-9">
                        <div className="input-field mt-0 mb-0">
                          <input
                            id="textarea1"
                            placeholder="Type and enter"
                            className="form-control border-0"
                            type="text"
                            onChange={onChangeText}
                            value={message}
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <a
                          className="btn-circle btn-lg btn-cyan float-right text-white"
                          onClick={handlerSend}
                        >
                          <i className="fas fa-paper-plane"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer text-center"></footer>
    </div>
  );
}

export default Chat;
