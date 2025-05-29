import { useEffect } from "react";
import api from "../api";
import { useAppContext } from "./AppContext";
import { Mail, LockKeyhole, MoveLeft } from "lucide-react";

function Login() {
  const {
    role,
    setRole,
    flag,
    setFlag,
    email,
    setEmail,
    password,
    setPassword,
    editFlag,
    setEditFlag,
    error,
    setError,
    setUserId,
  } = useAppContext();

  const BackToSelectLogin = () => {
    setFlag(0);
    setRole("");
    setEmail("");
    setPassword("");
    setError(null);
  };

  const ToRegister = () => {
    setEditFlag(1);
    setEmail("");
    setPassword("");
    setError(null);
  };

  const BackToLogin = () => {
    setEditFlag(0);
    setEmail("");
    setPassword("");
    setError(null);
    setFlag(1);
  };

  const ToForgotPassword = () => {
    setFlag(2);
    setEmail("");
    setPassword("");
    setError(null);
    setEditFlag(0);
  };

  const Register = async () => {
    setError(null);
    if (email === "" || password === "") {
      setError("Enter all fields.");
      return;
    }
    try {
      const response = await api.post("/register", {
        email,
        password,
        role,
      });
      if (response.status === 201) {
        BackToLogin();
      }
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.detail);
      } else {
        setError("Error: Couldnt register new user");
      }
    }
  };

  useEffect(() => {
    if (email !== "" || password !== "") {
      setError(null);
    }
  }, [email, password]);

  const Login = async () => {
    setError(null);
    if (email === "" || password === "") {
      setError("Enter all fields.");
      return;
    }
    try {
      const response = await api.post("/login", { email, password, role });
      if (response.status === 200) {
        setEmail("");
        setPassword("");
        setUserId(response.data.user_id);
      }
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.detail);
      } else {
        setError("Error: Couldnt perform login");
      }
    }
  };

  const GenerateCode = async () => {
    setError(null);
    if (email === "") {
      setError("Email cant be empty.");
      return;
    }
    try {
      const response = await api.post("/generate-code", { email: email });
      if (response.status === 201) {
        setError(null);
        setEditFlag(1);
      }
    } catch (error: any) {
      setError("Error: Couldnt Generate Code.");
    }
  };

  const BackToGenerateCode = () => {
    setEditFlag(0);
    setPassword("");
    setError(null);
  };

  const VerifyCode = async () => {
    setError(null);
    if (password === "") {
      setError("Enter Code in the Field.");
      return;
    }
    try {
      const response = await api.post("/verify-code", {
        code: password,
        email: email,
      });
      if (response.status === 200) {
        setPassword("");
        setEditFlag(2);
      }
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.detail);
      } else {
        setError("Error: Couldnt verify code.");
      }
    }
  };

  return (
    <div className="bg-black w-screen h-screen text-white flex flex-col">
      <h1 className="text-center text-3xl pt-10 font-bold">
        <span className="border-b">Inventory Management System</span>
      </h1>
      {flag === 0 && (
        <div className="my-auto mx-auto border p-2 bg-lime-400 rounded-2xl font-semibold">
          <button
            className="cursor-pointer m-8 border p-2 bg-black hover:bg-blue-600"
            onClick={() => {
              setRole("User");
              setFlag(1);
            }}
          >
            Login as User
          </button>
          <button
            className="cursor-pointer m-8 border p-2 bg-black hover:bg-red-600"
            onClick={() => {
              setRole("Admin");
              setFlag(1);
            }}
          >
            Login as Admin
          </button>
        </div>
      )}
      {flag === 1 && (
        <div className="my-auto mx-auto border w-[35%] px-5 rounded-md">
          <MoveLeft
            className="mt-2 cursor-pointer"
            onClick={() => {
              if (editFlag === 0) {
                BackToSelectLogin();
              } else BackToLogin();
            }}
          />
          <h1 className={`text-center text-xl`}>
            {editFlag === 0 ? "Welcome back" : "Hello new"} {role}!
          </h1>
          <p className="text-center text-gray-400">Please enter your details</p>
          <div className="flex justify-between mt-8">
            <label className="w-[10%]">
              <Mail />
            </label>
            <input
              type="email"
              value={email}
              className="border-b w-full focus:outline-0 px-1"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
            />
          </div>
          <div className="flex justify-between mt-5">
            <label className="w-[10%]">
              <LockKeyhole />
            </label>
            <input
              type="password"
              value={password}
              className="border-b w-full focus:outline-0 px-1"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <div className="mt-5 flex">
            <div className="flex-grow" />
            {editFlag === 0 && (
              <div
                className="cursor-pointer text-gray-400 text-sm hover:border-b"
                onClick={ToForgotPassword}
              >
                Forgot Password ?
              </div>
            )}
          </div>
          <div
            className={`flex justify-center ${
              role === "User" && editFlag === 0 ? "mt-5" : "my-5"
            }`}
          >
            <button
              className="px-2 py-1 text-xl border cursor-pointer"
              onClick={() => {
                if (editFlag === 0) {
                  Login();
                } else {
                  Register();
                }
              }}
            >
              {editFlag === 0 ? "Login" : "Register"}
            </button>
          </div>
          {role === "User" && editFlag === 0 ? (
            <p className="text-center my-5 text-sm">
              Don't have an account ?
              <span
                className="text-gray-400 hover:border-b cursor-pointer"
                onClick={ToRegister}
              >
                Sign Up
              </span>
            </p>
          ) : (
            ""
          )}
          <p className="text-center text-red-500 my-5">{error}</p>
        </div>
      )}
      {flag === 2 && (
        <div className="my-auto mx-auto border w-[30%] px-5">
          <MoveLeft
            className="mt-2 cursor-pointer"
            onClick={() => {
              if (editFlag === 0) {
                BackToLogin();
              } else BackToGenerateCode();
            }}
          />

          <div>
            <h1 className={`text-center text-xl`}>
              {editFlag === 0
                ? "Please enter your email"
                : "Verify the Code Sent to your Email"}
            </h1>
            <div className="flex justify-between mt-8">
              <label className={`${editFlag === 0 ? "w-[10%]" : "w-[25%]"}`}>
                {editFlag === 0 ? <Mail /> : "Enter Code: "}
              </label>
              <input
                type={`${editFlag === 0 ? "email" : "text"}`}
                value={editFlag === 0 ? email : password}
                className="border-b w-full focus:outline-0 px-1"
                onChange={(e) =>
                  editFlag === 0
                    ? setEmail(e.target.value)
                    : setPassword(e.target.value)
                }
                placeholder={editFlag === 0 ? "E-mail" : "Code"}
              />
            </div>
            <div
              className={`mb-5 mt-10 flex  ${
                editFlag === 0 ? "justify-center" : "justify-between"
              }`}
            >
              {editFlag === 1 && (
                <div className="flex justify-center w-full">
                  <button
                    className="border py-1 px-2 cursor-pointer"
                    onClick={GenerateCode}
                  >
                    Regenerate
                  </button>
                </div>
              )}
              <div
                className={`${
                  editFlag === 1 ? "w-full flex justify-center" : ""
                }`}
              >
                <button
                  className={`border py-1 cursor-pointer ${
                    editFlag === 0 ? "px-2" : "px-7"
                  }`}
                  onClick={() => {
                    if (editFlag === 0) {
                      GenerateCode();
                    } else {
                      VerifyCode();
                    }
                  }}
                >
                  {editFlag === 0 ? "Send Code" : "Verify"}
                </button>
              </div>
            </div>
          </div>
          <p className="text-red-500 text-center my-5">{error}</p>
        </div>
      )}
    </div>
  );
}

export default Login;
