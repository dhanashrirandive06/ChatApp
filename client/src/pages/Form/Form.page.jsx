import React, { useEffect, useState } from "react";
import Input from "../../components/Input/Input.Component";
import Button from "../../components/Button/Button.Component";
import SendIcon from "../../assets/sendIcon.gif";
import Notification from "../../components/Notification/Notification.Component";
import { useNavigate } from "react-router-dom";

const Form = ({ isSignInPage = false }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    ...(!isSignInPage && {
      fullName: "",
    }),
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setIsRegister(false);
    }, 3000);
  }, [isRegister]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("formdata: ", formData);
    if (!isSignInPage) {
      setIsRegister(true);
    }
    const res = await fetch(
      `http://localhost:8000/api/${isSignInPage ? "login" : "register"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );
    if (res.status === 400) {
      alert("Invalid Credentials");
    } else {
      const data = await res.json();
      //  console.log(" data in else", data);

      if (data.token) {
        localStorage.setItem("user:token", data.token);
        localStorage.setItem("user:detail", JSON.stringify(data.user));
        navigate("/");
      }
    }
  };
  //console.log(isRegister);
  return (
    <>
      {isRegister && <Notification />}
      <div className="formBackground h-screen flex flex-col justify-center items-center">
        <div className="flex place-items-end mb-4">
          <h1 className="text-white text-3xl font-semibold  mb-3">
            CHATTERBOX
          </h1>
          <img className="w-[4rem]" src={SendIcon} alt="Send Icon" />
        </div>
        <div className="bg-white w-[400px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
          <div className="text-4xl font-bold text-[#260538]">
            {isSignInPage ? "Hello Again!" : "Welcome"}
          </div>
          <div className="text-md font-normal mb-14 mt-2">
            {isSignInPage
              ? "Welcome back you've been missed!"
              : "Let's get you set up"}
          </div>

          <form
            className="w-full flex flex-col items-center"
            onSubmit={(e) => handleSubmit(e)}
          >
            {!isSignInPage && (
              <Input
                label=" Name"
                name="name"
                placeholder="Enter your Name"
                className="mb-6 w-[75%]"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            )}
            <Input
              label="Email "
              name="email"
              placeholder="Enter your Email"
              className="mb-6 w-[75%]"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your Password"
              className="mb-8 w-[75%]"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <Button
              label={isSignInPage ? "Login" : "Register"}
              className="w-[75%] mb-2"
              type="submit"
            />
          </form>

          <div>
            {isSignInPage
              ? "Did'n have an account?"
              : " Already have an account?"}
            <span
              className="text-primary cursor-pointer underline"
              onClick={() =>
                navigate(`/users/${isSignInPage ? "signup" : "signin"}`)
              }
            >
              {isSignInPage ? "Register" : "Login"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
