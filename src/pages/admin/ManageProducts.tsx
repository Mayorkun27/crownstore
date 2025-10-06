import Layout from "../../layout/Layout.js"
import ProductForm from "./products/ProductForm";
import ProductList from "./products/ProductList";

const ManageProducts = () => {

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Product Management
        </h2>
        <p className="text-gray-500 text-sm">Manage your product inventory with ease</p>
      </div>
      <div className="flex relative flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4 bg-white p-4 rounded-xl shadow-lg">
          <ProductList />
        </div>
        <div className="lg:w-1/3 sticky top-[200px] ">
          <ProductForm />
        </div>
      </div>
    </Layout>
  );
};

export default ManageProducts;