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
  } = useAppContext();

  const BackToSelectLogin = () => {
    setFlag(0);
    setRole("");
    setEmail("");
    setPassword("");
  };

  const ToRegister = () => {
    setFlag(2);
    setEmail("");
    setPassword("");
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
            onClick={BackToSelectLogin}
          />
          <h1 className="text-center text-xl">Welcome back {role}!</h1>
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
            />
          </div>
          <div className="mt-5 flex">
            <div className="flex-grow" />
            <div className="cursor-pointer text-gray-400 text-sm hover:border-b">
              Forgot Password ?
            </div>
          </div>
          <div className="mt-5 flex justify-center">
            <button className="px-2 py-1 text-xl border cursor-pointer">
              Login
            </button>
          </div>
          <p className="text-center my-5 text-sm">
            Don't have an account ?{" "}
            <span className="text-gray-400 hover:border-b cursor-pointer">
              Sign Up
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default Login;
