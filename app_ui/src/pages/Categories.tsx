import { useNavigate } from "react-router-dom";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { useAppContext } from "./AppContext";
import api from "../api";
import { useEffect, useState } from "react";

function Categories() {
  const navigate = useNavigate();
  const {
    setUserChoice,
    categories,
    setCategories,
    setError,
    flag,
    setFlag,
    name,
    setName,
    category,
    setCategory,
  } = useAppContext();

  const GetAllCategories = async () => {
    setError(null);
    try {
      const response = await api.get("/all-categories");
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error: any) {
      setError("Error: Couldnt fetch all categories");
    }
  };

  useEffect(() => {
    GetAllCategories();
  }, []);

  const [count, setCount] = useState(-1);

  const GetDeleteCount = async (name: string) => {
    setError(null);
    try {
      const response = await api.get(`/delete-count?name=${name}`);
      if (response.status === 200) {
        setCount(response.data.count);
      }
    } catch (error: any) {
      setError("Error: Couldnt get product's count");
    }
  };

  const DeleteCategory = async () => {
    setError(null);
    try {
      const response = await api.delete(
        `/delete-category?name=${name}&parent=${category}`
      );
      if (response.status === 200) {
        Reset();
        await GetAllCategories();
      }
    } catch (error: any) {
      setError("Error: Couldnt delete category");
    }
  };

  const Reset = () => {
    setFlag(0);
    setName("");
    setCategory("");
    setCount(-1);
  };

  return (
    <div className="w-screen h-screen bg-black text-white flex">
      <div className="bg-gray-700 flex flex-col w-[10%] px-5 pt-10 text-2xl border-r-6 border-black">
        <button
          className="bg-black py-2 cursor-pointer border rounded overflow-hidden text-ellipsis"
          onClick={() => {
            Reset();
          }}
        >
          Categories
        </button>
        <button
          className="mt-5 py-2 cursor-pointer hover:bg-gray-600 overflow-hidden text-ellipsis"
          onClick={() => {
            Reset();
            navigate("/products");
          }}
        >
          Products
        </button>
        <button
          className="mt-5 py-2 cursor-pointer hover:bg-gray-600 overflow-hidden text-ellipsis"
          onClick={() => {
            setFlag(0);
            setName("");
            setCategory("--PARENT--");
            setCount(-1);
            navigate("/menu");
          }}
        >
          Menu
        </button>
      </div>
      <div className="w-full h-full flex">
        <div className=" my-auto mx-auto w-[85%] h-[85%] bg-gray-700">
          <div className="flex justify-end mx-5 py-1">
            <div className="cursor-pointer flex bg-black rounded-full pl-2 pr-3 py-1">
              <Plus className="mr-2 my-auto" size={20} />
              <button
                className="cursor-pointer text-lg"
                onClick={() => {
                  setUserChoice("Category");
                  navigate("/add");
                }}
              >
                Add Category
              </button>
            </div>
          </div>
          <div className="h-[95%] bg-slate-900 border-black border overflow-auto">
            {flag === 0 && (
              <div>
                {categories?.slice(1).length === 0 ? (
                  <div className="flex h-[100%]">
                    <p className="mx-auto my-auto text-2xl font-semibold">
                      No categories added yet.
                    </p>
                  </div>
                ) : (
                  <table className="table-fixed w-full border-collapse border border-gray-500 text-center text-white mt-10">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="border border-gray-500 px-4 py-2 w-2/5">
                          Name
                        </th>
                        <th className="border border-gray-500 px-4 py-2 w-2/5">
                          Parent Category
                        </th>
                        <th className="border border-gray-500 px-4 py-2 w-1/5">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories?.slice(1).map((category, index) => (
                        <tr
                          key={index}
                          className="bg-gray-700 hover:bg-gray-600"
                        >
                          <td className="border border-gray-500 px-4 py-2 truncate">
                            {category.name}
                          </td>
                          <td className="border border-gray-500 px-4 py-2 truncate">
                            {category.parent}
                          </td>
                          <td className="border border-gray-500 px-4 py-2">
                            <div className="flex justify-center space-x-4">
                              <SquarePen className="cursor-pointer text-blue-400" />
                              <Trash2
                                className="cursor-pointer text-red-400"
                                onClick={async () => {
                                  setFlag(1);
                                  setName(category.name);
                                  setCategory(category.parent);
                                  await GetDeleteCount(category.name);
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
                  {count === 0 ? (
                    ""
                  ) : (
                    <p className="text-center">
                      {count} product{count !== 1 && "s"} will also be deleted
                      as a result
                    </p>
                  )}

                  <div className="text-center">
                    <button
                      className="border p-2 mr-5 mt-5 cursor-pointer hover:bg-gray-800 hover:text-blue-400"
                      onClick={() => {
                        setFlag(0);
                        setName("");
                        setCategory("");
                        setCount(-1);
                      }}
                    >
                      Go Back
                    </button>
                    <button
                      className="border p-2 mt-5 cursor-pointer hover:bg-gray-800 hover:text-red-500 "
                      onClick={DeleteCategory}
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
    </div>
  );
}

export default Categories;
