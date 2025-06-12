import { useNavigate } from "react-router-dom";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { useAppContext } from "./AppContext";
import api from "../api";
import { useEffect } from "react";

function Products() {
  const navigate = useNavigate();
  const {
    setUserChoice,
    products,
    setError,
    setProducts,
    flag,
    setFlag,
    name,
    setName,
    category,
    setCategory,
  } = useAppContext();

  const GetAllProducts = async () => {
    setError(null);
    try {
      const response = await api.get("/all-products");
      if (response.status === 200) {
        setProducts(response.data);
      }
    } catch (error: any) {
      setError("Error: Couldnt fetch all products");
    }
  };

  useEffect(() => {
    GetAllProducts();
  }, []);

  const DeleteProduct = async () => {
    setError(null);
    try {
      const response = await api.delete(
        `/delete-product?name=${name}&category=${category}`
      );
      if (response.status === 200) {
        setFlag(0);
        setName("");
        setCategory("");
        await GetAllProducts();
      }
    } catch (error: any) {
      setError("Error: Couldnt delete product");
    }
  };

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
          {flag === 0 && (
            <div>
              <div className="flex justify-end mx-5 py-1">
                <div className="cursor-pointer flex bg-black rounded-full pl-2 pr-3 py-1">
                  <Plus className="mr-2 my-auto" size={20} />
                  <button
                    className="cursor-pointer text-lg"
                    onClick={() => {
                      setUserChoice("Product");
                      navigate("/add");
                    }}
                  >
                    Add Product
                  </button>
                </div>
              </div>
              <div className="h-[95%] bg-slate-900 border-black border flex flex-col">
                {products?.length === 0 ? (
                  <div className="flex h-[100%]">
                    <p className="mx-auto my-auto text-2xl font-semibold">
                      No products added yet.
                    </p>
                  </div>
                ) : (
                  <table className="table-fixed w-full border-collapse border border-gray-500 text-center text-white mt-10">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="border border-gray-500 px-4 py-2 w-2/6">
                          Name
                        </th>
                        <th className="border border-gray-500 px-4 py-2 w-2/6">
                          Category
                        </th>
                        <th className="border border-gray-500 px-4 py-2 w-1/6">
                          Price
                        </th>
                        <th className="border border-gray-500 px-4 py-2 w-1/6">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products?.map((product, index) => (
                        <tr
                          key={index}
                          className="bg-gray-700 hover:bg-gray-600"
                        >
                          <td className="border border-gray-500 px-4 py-2 truncate">
                            {product.name}
                          </td>
                          <td className="border border-gray-500 px-4 py-2 truncate">
                            {product.category}
                          </td>
                          <td className="border border-gray-500 px-4 py-2">
                            {product.price}
                          </td>
                          <td className="border border-gray-500 px-4 py-2">
                            <div className="flex justify-center space-x-4">
                              <SquarePen className="cursor-pointer text-blue-400" />
                              <Trash2
                                className="cursor-pointer text-red-400"
                                onClick={() => {
                                  setFlag(1);
                                  setName(product.name);
                                  setCategory(product.category);
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
          {flag === 1 && (
            <div className="flex h-full">
              <div className=" mx-auto my-auto w-[50%] border p-5 text-lg">
                <p className="text-center">
                  Are you sure you want to delete '
                  <span className="inline-block truncate max-w-[450px] overflow-hidden whitespace-nowrap align-bottom">
                    {name}
                  </span>
                  ' ?
                </p>
                <div className="text-center">
                  <button
                    className="border p-2 mr-5 mt-5 cursor-pointer hover:bg-gray-800 hover:text-blue-400"
                    onClick={() => {
                      setFlag(0);
                      setName("");
                      setCategory("");
                    }}
                  >
                    Go Back
                  </button>
                  <button
                    className="border p-2 mt-5 cursor-pointer hover:bg-gray-800 hover:text-red-500 "
                    onClick={DeleteProduct}
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
