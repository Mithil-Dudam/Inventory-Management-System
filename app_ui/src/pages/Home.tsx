function Home(){
    return(
        <div className="bg-black text-white w-screen h-screen flex flex-col">
            <h1 className="text-center text-3xl pt-10 font-bold">
                <span className="border-b">Inventory Management System</span>
            </h1>
            <div className="my-auto mx-auto border p-2 bg-lime-400 rounded-2xl font-semibold">
                <button
                    className="cursor-pointer m-8 border p-2 bg-black hover:bg-blue-600"
                    onClick={() => {
                    setRole("User");
                    setFlag(1);
                    }}
                >
                    Manage Categories
                </button>
                <button
                    className="cursor-pointer m-8 border p-2 bg-black hover:bg-red-600"
                    onClick={() => {
                    setRole("Admin");
                    setFlag(1);
                    }}
                >
                    Manage Products
                </button>
            </div>
        </div>
    )
}

export default Home