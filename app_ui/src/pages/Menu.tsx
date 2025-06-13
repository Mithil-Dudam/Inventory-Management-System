import { useNavigate } from "react-router-dom";
import { useAppContext } from "./AppContext";
import api from "../api";
import { useEffect } from "react";

function Menu() {
  const navigate = useNavigate();
  const {categories,setError,category,setCategories} = useAppContext()

  const GetAllCategories = async () => {
    setError(null)
    const formData = new FormData()
    formData.append("category",category)
    try{
      const response = await api.get("/all-categories",{
        params:{category}
      })
      if(response.status===200){
        setCategories(response.data)
      }
    }catch(error:any){
      setError("Error: Couldnt get all categories")
    }
  }

  useEffect(()=>{
    GetAllCategories()
  },[])

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
      <div className="w-full">
        <h1 className="text-center w-full mt-10 text-3xl"><span className="border-b">Menu</span></h1>
        {categories?.length===0?(
          <div className="text-center">No categories</div>
        ):(
          <div className="mt-10 border">
            {categories?.map((category,index)=>(
              <div key={index} className="">
                <p className="hover:bg-gray-700 cursor-pointer mb-5">{category.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
