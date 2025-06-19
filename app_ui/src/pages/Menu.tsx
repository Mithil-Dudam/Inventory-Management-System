import { useNavigate } from "react-router-dom";
import { useAppContext } from "./AppContext";
import api from "../api";
import { useEffect } from "react";
import { MoveLeft } from "lucide-react";

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
    role,
  } = useAppContext();

  const GetAllCategories = async (category: string, parent = false) => {
    setError(null);
    const formData = new FormData();
    formData.append(parent ? "parent" : "category", category);
    try {
      const response = await api.post("/all-categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        setCategories(response.data);
        setCategory(response.data[0].parent);
      }
    } catch (error: any) {
      setError("Error: Couldnt get all categories");
    }
  };

  const GetAllProducts = async (category?: string, parent = false) => {
    setError(null);
    if (category) {
      const formData = new FormData();
      formData.append(parent ? "parent" : "category", category);
      try {
        const response = await api.post("/all-products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.status === 200) {
          setProducts(response.data);
        }
      } catch (error: any) {
        setError("Error: Couldnt fetch all products");
      }
    } else {
      try {
        const response = await api.post("/all-products");
        if (response.status === 200) {
          setProducts(response.data);
        }
      } catch (error: any) {
        setError("Error: Couldnt fetch all products");
      }
    }
  };

  useEffect(() => {
    GetAllCategories(category);
    GetAllProducts(category);
  }, []);

  useEffect(() => {
    if (products?.length !== 0) {
      GetAllProducts(category);
    }
  }, [category]);

  return (
    <div className="w-screen h-screen bg-black text-white flex">
      {role === "Admin" && (
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
            Inventory
          </button>
        </div>
      )}
      <div
        className={`flex flex-col ${
          role === "Admin" ? "w-[90%] " : "w-full justify-center"
        }`}
      >
        <h1 className="text-center w-full mt-10 text-3xl">
          <span className="border-b font-bold">Inventory</span>
        </h1>
        {categories?.length === 0 ? (
          <div className="border h-[80%] w-[50%] mx-auto my-auto rounded bg-gray-700 overflow-auto">
            <MoveLeft
              className="ml-5 cursor-pointer"
              onClick={() => {
                GetAllCategories(category, true);
              }}
            />
            <h1 className="text-center text-5xl font-semibold mt-5 truncate pb-4">
              <span className="border-b">{category}</span>
            </h1>
            {products?.map((product, index) => (
              <div key={index} className="">
                <div className="hover:bg-black cursor-pointer my-10 w-[90%] border mx-auto p-2 rounded bg-slate-900">
                  <h1 className="text-center text-3xl truncate">
                    {product.name}
                  </h1>
                  <div className="flex justify-between w-full">
                    <div className="w-[75%]">
                      <p className="my-5 line-clamp-3">{product.description}</p>
                      <p className="mt-5 font-semibold">
                        Price:{" "}
                        <span className="ml-2 font-bold">{product.price}</span>
                      </p>
                    </div>
                    <div className="w-[25%] flex justify-center my-2">
                      {product.image_url && (
                        <img
                          src={`http://localhost:8000/${product.image_url}`}
                          className="w-40 h-40 object-cover border rounded"
                          alt="Picture"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border h-[80%] w-[50%] mx-auto my-auto rounded bg-gray-700 overflow-auto">
            {categories && category !== "--PARENT--" && (
              <MoveLeft
                className="ml-5 cursor-pointer"
                onClick={async () => {
                  await GetAllCategories(categories[0].parent, true);
                  setProducts([]);
                }}
              />
            )}
            {categories?.map((category, index) => (
              <div key={index}>
                <div
                  className="hover:bg-black cursor-pointer my-10 text-center text-3xl w-[75%] mx-auto border rounded-full p-2 bg-slate-900 truncate"
                  onClick={() => {
                    GetAllCategories(category.name);
                    setCategory(category.name);
                    GetAllProducts(category.name);
                  }}
                >
                  <span>{category.name}</span>
                </div>
              </div>
            ))}
            {products?.length !== 0 && (
              <div>
                {products?.map((product, index) => (
                  <div key={index} className="">
                    <div className="hover:bg-black cursor-pointer my-10 w-[90%] border mx-auto p-2 rounded bg-slate-900">
                      <h1 className="text-center text-3xl truncate">
                        {product.name}
                      </h1>
                      <div className="flex justify-between w-full">
                        <div className="w-[75%]">
                          <p className="my-5 line-clamp-3">
                            {product.description}
                          </p>
                          <p className="mt-5 font-semibold">
                            Price:{" "}
                            <span className="ml-2 font-bold">
                              {product.price}
                            </span>
                          </p>
                        </div>
                        <div className="w-[25%] flex justify-center my-2">
                          {product.image_url && (
                            <img
                              src={`http://localhost:8000/${product.image_url}`}
                              className="w-40 h-40 object-cover border rounded"
                              alt="Picture"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
