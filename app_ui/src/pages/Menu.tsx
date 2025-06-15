import { useNavigate } from "react-router-dom";
import { useAppContext } from "./AppContext";
import api from "../api";
import { useEffect } from "react";

function Menu() {
  const navigate = useNavigate();
  const {
    categories,
    setError,
    category,
    setCategories,
    setCategory,
    products,
    setProducts,
  } = useAppContext();

  const GetAllCategories = async () => {
    setError(null);
    const formData = new FormData();
    formData.append("category", category);
    try {
      const response = await api.get("/all-categories", {
        params: { category },
      });
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error: any) {
      setError("Error: Couldnt get all categories");
    }
  };

  const GetAllProducts = async () => {
    setError(null);
    if (categories?.length === 0) {
      try {
        const response = await api.get("/all-products", {
          params: { category },
        });
        if (response.status === 200) {
          setProducts(response.data);
        }
      } catch (error: any) {
        setError("Error: Couldnt fetch all products");
      }
    }
  };

  useEffect(() => {
    if (category !== "") {
      GetAllCategories();
    }
  }, [category]);

  useEffect(() => {
    if (categories?.length === 0) {
      GetAllProducts();
    }
  }, [categories]);

  return (
    <div className="w-screen h-screen bg-black text-white flex">
      <div className="bg-gray-700 flex flex-col w-[10%] px-5 pt-10 text-2xl border-r-6 border-black">
        <button
          className="hover:bg-gray-600 py-2 cursor-pointer overflow-hidden text-ellipsis"
          onClick={() => navigate("/categories")}
        >
          Categories
        </button>
        <button
          className="mt-5 py-2 cursor-pointer hover:bg-gray-600 overflow-hidden text-ellipsis"
          onClick={() => navigate("/products")}
        >
          Products
        </button>
        <button className="mt-5 py-2 cursor-pointer bg-black border rounded overflow-hidden text-ellipsis">
          Menu
        </button>
      </div>
      <div className="w-full flex flex-col">
        <h1 className="text-center w-full mt-10 text-3xl">
          <span className="border-b">Menu</span>
        </h1>
        {categories?.length === 0 ? (
          <div className="border h-[80%] w-[50%] mx-auto my-auto rounded bg-gray-700 overflow-auto">
            <h1 className="text-center text-5xl font-semibold mt-5">
              <span className="border-b">{category}</span>
            </h1>
            {products?.map((product, index) => (
              <div key={index} className="">
                <div className="hover:bg-black cursor-pointer my-10 text-center text-3xl ">
                  {product.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border h-[80%] w-[50%] mx-auto my-auto rounded bg-gray-700 overflow-auto">
            {categories?.map((category, index) => (
              <div key={index} className="">
                <div
                  className="hover:bg-black cursor-pointer my-10 text-center text-3xl "
                  onClick={() => {
                    setCategory(category.name);
                  }}
                >
                  <span className="">{category.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
