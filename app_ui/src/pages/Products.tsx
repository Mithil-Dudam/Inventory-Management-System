import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

function Products() {
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
        <button className="mt-5 py-2 cursor-pointer bg-black border rounded">
          Products
        </button>
        <button
          className="mt-5 py-2 cursor-pointer hover:bg-gray-600"
          onClick={() => navigate("/menu")}
        >
          Menu
        </button>
      </div>
      <div className="w-full h-full flex">
        <div className=" my-auto mx-auto w-[85%] h-[85%] bg-gray-700">
          <div className="flex justify-end mx-5 py-1">
            <div className="cursor-pointer flex bg-black rounded-full pl-2 pr-3 py-1">
              <Plus className="mr-2 my-auto" size={20} />
              <button className="cursor-pointer">Add Product</button>
            </div>
          </div>
          <div className="h-[95%] bg-amber-200">
            <h1>Products</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
