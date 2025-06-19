import { useNavigate } from "react-router-dom";
import { useAppContext } from "./AppContext";
import { MoveLeft, Images } from "lucide-react";
import api from "../api";
import { useEffect, useState } from "react";

function Add() {
  const navigate = useNavigate();
  const {
    userChoice,
    setUserChoice,
    categories,
    name,
    setName,
    description,
    setDescription,
    category,
    setCategory,
    categoryID,
    setCategoryID,
    price,
    setPrice,
    error,
    setError,
    setCategories,
    editFlag,
    setEditFlag,
    id,
    setId,
  } = useAppContext();
  const [image, setImage] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const GetAllCategories = async () => {
    setError(null);
    try {
      const response = await api.post("/all-categories");
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

  const GoBack = () => {
    setError(null);
    setUserChoice("");
    setName("");
    setCategory("");
    setCategoryID(0);
    setDescription("");
    setImage(null);
    setPrice(0);
    setEditFlag(0);
    setId(0);
  };

  const CreateCategory = async () => {
    if (name === "" || category === "") {
      setError("Enter all fields.");
      return;
    }
    try {
      const response = await api.post("/create-category", {
        name,
        parent: category,
      });
      if (response.status === 201) {
        GoBack();
        navigate("/categories");
      }
    } catch (error: any) {
      setError("");
    }
  };

  const EditCategory = async () => {
    setError(null);
    if (name === "" || category === "") {
      setError("Enter all fields.");
      return;
    }
    try {
      const response = await api.post(`/edit-category?id=${id}`, {
        name,
        parent: category,
      });
      if (response.status === 200) {
        GoBack();
        navigate("/categories");
      }
    } catch (error: any) {
      setError("");
    }
  };

  useEffect(() => {
    if (name !== "" || category !== "" || price !== 0) {
      setError(null);
    }
  }, [name, category, price]);

  const CreateProduct = async () => {
    setError(null);
    if (name === "" || categoryID === 0 || price === 0) {
      setError("Enter all marked field.");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("categoryID", categoryID.toString());
    formData.append("price", price.toString());
    if (description) {
      formData.append("description", description);
    }
    if (image) {
      formData.append("image", image);
    }
    try {
      const response = await api.post("/create-product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        GoBack();
        navigate("/products");
      }
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.detail);
      } else {
        setError("Error: Couldnt create product");
      }
    }
  };

  const EditProduct = async () => {
    setError(null);
    if (name === "" || categoryID === 0 || price === 0) {
      setError("Enter all marked field.");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("categoryID", categoryID.toString());
    formData.append("price", price.toString());
    if (description) {
      formData.append("description", description);
    }
    if (image) {
      formData.append("image", image);
    }
    try {
      const response = await api.post(`/edit-product?id=${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        GoBack();
        navigate("/products");
      }
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.detail);
      } else {
        setError("Error: Couldnt create product");
      }
    }
  };

  return (
    <div className="w-screen h-screen bg-black text-white flex">
      <div className="bg-gray-700 flex flex-col w-[10%] px-5 pt-10 text-2xl border-r-6 border-black">
        <button
          className={`py-2 cursor-pointer overflow-hidden text-ellipsis ${
            userChoice === "Category"
              ? "border rounded bg-black"
              : "hover:bg-gray-600"
          }`}
          onClick={() => {
            navigate("/categories");
            GoBack();
          }}
        >
          Categories
        </button>
        <button
          className={`mt-5 py-2 cursor-pointer overflow-hidden text-ellipsis ${
            userChoice === "Product"
              ? "border rounded bg-black"
              : "hover:bg-gray-600"
          }`}
          onClick={() => {
            navigate("/products");
            GoBack();
          }}
        >
          Products
        </button>
        <button
          className={`mt-5 py-2 cursor-pointer hover:bg-gray-600 overflow-hidden text-ellipsis`}
          onClick={() => {
            navigate("/menu");
            GoBack();
          }}
        >
          Menu
        </button>
      </div>
      <div className="w-full h-full p-10 flex bg-gray-400">
        <div className="bg-black px-10 w-full rounded overflow-auto">
          <MoveLeft
            className="mt-1 cursor-pointer"
            onClick={() => {
              if (userChoice === "Category") {
                GoBack();
                navigate("/categories");
              } else {
                GoBack();
                navigate("/products");
              }
            }}
          />
          <h1 className=" text-center font-bold text-4xl mt-15">
            {editFlag === 0 ? "Create" : "Edit"} {userChoice}
          </h1>
          <div className="mt-10 flex justify-between">
            <label className="w-[15%]">
              Enter Name: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="border-b focus:outline-0 w-full focus:bg-gray-700 px-1 hover:bg-gray-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {userChoice === "Category" ? (
            <div className="mt-10 flex justify-between">
              <label className="w-[15%] ">
                Select Parent Category: <span className="text-red-500">*</span>
              </label>
              <select
                className="border-b focus:outline-0 w-full focus:bg-gray-700
                px-1 hover:bg-gray-600"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled hidden>
                  Please select an option
                </option>
                {categories?.length === 0
                  ? ""
                  : categories?.map((category, index) => (
                      <div key={index}>
                        <option value={category.name}>{category.name}</option>
                      </div>
                    ))}
              </select>
            </div>
          ) : (
            <div>
              <div className="mt-10 flex justify-between">
                <label className="w-[15%]">Enter Description:</label>
                <textarea
                  className="border-b focus:outline-0 w-full focus:bg-gray-700 px-1 hover:bg-gray-600 bg-gray-400"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="mt-10 flex justify-between">
                <label className="w-[15%]">
                  Select Category: <span className="text-red-500">*</span>
                </label>
                <select
                  className="border-b focus:outline-0 w-full focus:bg-gray-700
                px-1 hover:bg-gray-600"
                  value={categoryID}
                  onChange={(e) =>
                    setCategoryID(parseInt(e.currentTarget.value))
                  }
                >
                  <option value={0} disabled hidden>
                    Please select an option
                  </option>
                  {categories?.length === 0
                    ? ""
                    : categories?.slice(1).map((category, index) => (
                        <div key={index}>
                          <option value={category.id}>{category.name}</option>
                        </div>
                      ))}
                </select>
              </div>
              <div className="mt-10 flex justify-between">
                <label className="w-[15%]">
                  Enter Price: <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="border-b focus:outline-0 w-full focus:bg-gray-700 px-1 hover:bg-gray-600"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.currentTarget.value))}
                />
              </div>
              <div className="mt-10 flex justify-between">
                <label className="w-[15%]">Add an Image:</label>
                <div className="w-full flex">
                  <label className="flex items-center px-4 py-2 bg-white text-black border-gray-300 rounded cursor-pointer hover:bg-gray-100 transition">
                    <Images className="mr-2" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {fileName && (
                    <p className=" text-gray-300 ml-5 my-auto">{fileName}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className=" mt-25 mx-auto text-center">
            <button
              className="border px-3 py-2 cursor-pointer font-semibold hover:bg-gray-700 bg-green-800"
              onClick={() => {
                if (userChoice === "Category") {
                  if (editFlag === 0) {
                    CreateCategory();
                  } else {
                    EditCategory();
                  }
                } else {
                  if (editFlag === 0) {
                    CreateProduct();
                  } else {
                    EditProduct();
                  }
                }
              }}
            >
              {editFlag === 0 ? "Add" : "Edit"} {userChoice}
            </button>
          </div>
          <div>
            <p className="text-center text-red-500 my-10">{error}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Add;
