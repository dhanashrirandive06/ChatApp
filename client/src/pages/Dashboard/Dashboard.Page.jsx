import { useEffect, useState, useRef } from "react";
import Avatar from "../../assets/avatar.png";
import Input from "../../components/Input/Input.Component";
import NoMessage from "../../components/NoMessage/NoMessage.Component";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user:detail"))
  );

  const [conversations, setConversation] = useState([]);
  const [messages, setMessages] = useState({});
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const messageRef = useRef(null);
  const [currentUsers, setCurrentUsers] = useState([]);

  const navigate = useNavigate();

  //console.log("Messages: ", messages);
  //Socket Io
  useEffect(() => {
    setSocket(io("http://localhost:8080"));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", user?.id);
    socket?.on("getUsers", (users) => {
      console.log("activeUsers : ", users);
      setCurrentUsers([...users]);
    });

    socket?.on("getMessage", (data) => {
      console.log("Socket get Message", data);
      setMessages((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { user: data.user, message: data.message },
        ],
      }));
    });
  }, [socket]);

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.messages]);

  //To fetch all conversation of current user
  useEffect(() => {
    const fetchConversations = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));

      const res = await fetch(
        `http://localhost:8000/api/conversations/${loggedInUser?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("In conversation");
      const data = await res.json();
      //console.log("Conversations", data);
      setConversation(data);
    };

    fetchConversations();
  }, [conversations]);

  //To fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`http://localhost:8000/api/users/${user?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json  ",
        },
      });
      const data = await res.json();
      // console.log(data);
      setUsers(data);
    };
    fetchUsers();
  }, [users]);

  const fetchMessages = async (conversationId, receiver) => {
    console.log("Fetch message", messages?.receiverUser?.receiverId);
    const res = await fetch(
      `http://localhost:8000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    //console.log(data);
    setMessages({ messages: data, receiverUser: receiver, conversationId });
  };

  const sendMessage = async (e) => {
    socket?.emit("sendMessage", {
      senderId: user?.id,
      receiverId: messages?.receiverUser?.receiverId,
      message,
      conversationId: messages?.conversationId,
    });
    const res = await fetch("http://localhost:8000/api/message/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: messages?.conversationId,
        senderId: user?.id,
        message,
        receiverId: messages?.receiverUser?.receiverId,
      }),
    });

    setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("user:detail");
    localStorage.removeItem("user:token");
    navigate("/users/signin");
  };

  console.log("Current Users ", currentUsers);
  console.log("chat window", users);

  return (
    <div className="w-screen flex">
      {/* Users With Whom we are chatting */}
      <div className="w-[25%]  h-screen overflow-y-scroll conversationBackground ">
        <div className="flex items-center my-8 mx-4 conversationRow rounded-md">
          <img src={Avatar} width={75} height={75} alt="Avatar" />
          <div className="ml-4">
            <h3 className="text-xl">{user.fullName}</h3>
            <p className="text-md font-light">My Account</p>
          </div>
        </div>
        <hr className="text-primary" />
        <div className="mt-5">
          <div className="text-white text-lg ml-4">Messages</div>
          <div>
            {conversations.length > 0 ? (
              conversations.map((conversation, index) => {
                return (
                  <div className="flex items-center py-4  px-6 " key={index}>
                    <div
                      className="cursor-pointer flex conversationRow px-4 rounded-md w-full shadow-xl"
                      onClick={() =>
                        fetchMessages(
                          conversation.conversationId,
                          conversation.user
                        )
                      }
                    >
                      <img src={Avatar} width={60} height={60} alt="Avatar" />
                      <div className="ml-2">
                        <h3 className="text-lg font-semibold">
                          {conversation.user.fullName}
                        </h3>
                        <p className="text-sm font-light text-gray-600">
                          {conversation.user.email}
                        </p>
                      </div>
                      {/* Check user is online or not */}

                      {currentUsers.map((currUser, index) => {
                        if (currUser.userId === conversation.user.receiverId) {
                          return (
                            <p className="ml-auto bg-blue-500 border border-white-900 border-t-[2px] border-r-[2px] border-l-[2px] border-b-[2px] mt-2 w-[15px] h-[15px] rounded-full"></p>
                          );
                        }
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold my-12 text-white">
                No Conversation
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Window */}

      <div className="w-[50%] h-screen bg-white flex flex-col items-center">
        {messages?.receiverUser?.fullName && (
          <div className="w-[85%] bg-secondary h-[5rem] mt-4 mb-9 rounded-md flex items-center px-8 shadow-lg ">
            <div>
              <img
                className="cursor-pointer"
                src={Avatar}
                width={60}
                height={60}
                alt="Avatar"
              />
            </div>
            <div className="ml-2 mr-auto">
              <h3 className="text-lg font-semibold ">
                {messages?.receiverUser?.fullName}
              </h3>
              <p className="text-sm font-semibold ">
                {messages?.receiverUser?.email}
              </p>
            </div>

            {/* Check user is online or not */}

            {currentUsers.map((currUser, index) => {
              if (currUser.userId === messages?.receiverUser?.receiverId) {
                return (
                  <div className="ml-auto flex items-center">
                    <p className="text-blue-700 font-semibold">online</p>
                    <p className=" mx-2 bg-blue-500 border border-white-900 border-t-[2px] border-r-[2px] border-l-[2px] border-b-[2px]  w-[15px] h-[15px] rounded-full"></p>
                  </div>
                );
              }
            })}
          </div>
        )}

        <div
          className={`h-[75%] w-full  overflow-y-scroll ${
            messages?.messages?.length > 0 && "shadow-md"
          }`}
        >
          <div className=" p-10 ">
            {messages?.messages?.length > 0 ? (
              messages.messages.map(({ message, user: { id } = "" }, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className={`max-w-[40%] min-w-[20%] w-auto mb-6  p-4  rounded-b-2xl ${
                        id === user.id
                          ? "rounded-tl-2xl ml-auto bg-[#8118c2] text-white"
                          : "bg-secondary rounded-tr-2xl"
                      }`}
                    >
                      {message}
                    </div>
                    <div ref={messageRef}></div>
                  </>
                );
              })
            ) : (
              <NoMessage />
            )}
          </div>
        </div>
        {messages?.receiverUser?.fullName && (
          <div className="p-7 w-full flex items-end">
            <Input
              className="w-[90%]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              inputClassName="p-4 border-0 shadow-md rounded-xl bg-secondary focus:ring-0 focus:outline-0"
            />

            <div
              className={`ml-4 cursor-pointer ${
                !message && "pointer-events-none"
              }`}
              onClick={() => sendMessage()}
            >
              <i className="fas fa-paper-plane  py-3 px-4 text-xl shadow-md  bg-secondary rounded-full text-primary"></i>
            </div>
          </div>
        )}
      </div>

      {/* All Available Users  */}
      <div className="w-[25%] h-screen bg-light p-6 overflow-y-scroll">
        <div className="flex items-center justify-between pb-8">
          <div className="text-primary text-lg font-semibold ml-4">People</div>
          <div
            className="text-white bg-primary text-sm p-2 rounded-lg cursor-pointer"
            onClick={() => handleLogout()}
          >
            Logout <i className="fa-solid fa-right-from-bracket"></i>
          </div>
        </div>

        <div>
          {users.length > 0 ? (
            users.map(({ userId, user }) => {
              return (
                <div
                  className="flex py-2  bg-[#eee5f4] rounded-md shadow-md my-6"
                  key={userId}
                >
                  <div
                    className="cursor-pointer flex"
                    onClick={() => fetchMessages("new", user)}
                  >
                    <img src={Avatar} width={60} height={60} alt="Avatar" />
                    <div className="ml-2">
                      <h3 className="text-lg font-semibold">{user.fullName}</h3>
                      <p className="text-sm font-light text-gray-600">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {/* Check which users are online*/}
                  {currentUsers.map((currUser, index) => {
                    if (currUser.userId === user.receiverId) {
                      return (
                        <div className="relative ml-10   ">
                          <p className=" text-sm px-2 bg-white h-[1.3rem] rounded-md text-blue-700 font-semibold absolute">
                            Available
                          </p>
                        </div>
                      );
                    }
                  })}
                </div>
              );
            })
          ) : (
            <div className="text-center text-lg font-semibold my-12">
              No Conversation to Show
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
