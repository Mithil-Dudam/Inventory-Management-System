import { useNavigate } from "react-router-dom";

function Menu() {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen bg-black text-white flex">
      <div className="bg-gray-700 flex flex-col w-[10%] px-5 pt-10 text-2xl border-r-6 border-black">
        <button
          className="hover:bg-gray-600 py-2 cursor-pointer"
          onClick={() => navigate("/categories")}
        >
          Categories
        </button>
        <button
          className="mt-5 py-2 cursor-pointer hover:bg-gray-600"
          onClick={() => navigate("/products")}
        >
          Products
        </button>
        <button className="mt-5 py-2 cursor-pointer bg-black border rounded">
          Menu
        </button>
      </div>
      <div>
        <h1>Categories</h1>
      </div>
    </div>
  );
}

export default Menu;
