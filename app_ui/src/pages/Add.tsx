import { useNavigate } from "react-router-dom";
import { useAppContext } from "./AppContext";
import { MoveLeft } from "lucide-react";

function Add() {
  const navigate = useNavigate();
  const { userChoice, setUserChoice } = useAppContext();
  return (
    <div className="w-screen h-screen bg-black text-white flex">
      <div className="bg-gray-700 flex flex-col w-[10%] px-5 pt-10 text-2xl border-r-6 border-black">
        <button
          className={`py-2 cursor-pointer ${
            userChoice === "category"
              ? "border rounded bg-black"
              : "hover:bg-gray-600"
          }`}
        >
          Categories
        </button>
        <button
          className={`mt-5 py-2 cursor-pointer ${
            userChoice === "product"
              ? "border rounded bg-black"
              : "hover:bg-gray-600"
          }`}
          onClick={() => navigate("/products")}
        >
          Products
        </button>
        <button
          className={`mt-5 py-2 cursor-pointer hover:bg-gray-600`}
          onClick={() => navigate("/menu")}
        >
          Menu
        </button>
      </div>
      <div className="w-full h-full p-10 flex bg-gray-400">
        <div className="bg-black px-10 w-full rounded">
          <MoveLeft
            className="mt-1 cursor-pointer"
            onClick={() => {
              if (userChoice === "category") {
                setUserChoice("");
                navigate("/categories");
              } else {
                setUserChoice("");
                navigate("/products");
              }
            }}
          />
          <div className="border mt-10">
            <label>Enter Name:</label>
            <input type="text" className="border" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Add;
