import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import ProductRow from '../../../components/ProductRow';
import Modal from '../../../components/modals/Modal'; 
import ProductForm from './ProductForm';

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface Product {
    id: number;
    items: string;
    price: number;
    in_stock: number;
    total_sold: number;
    category: string;
}

const ProductList = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token"); 
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]); // Array of Product
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [deletingProducts, setDeletingProducts] = useState<{[key: string]: boolean}>({});
    
    const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);

    const fetchData = useCallback(async () => {
        if (!token) {
            toast.error("No token found");
            setTimeout(() => navigate("/"), 1500);
            return;
        }

        setProductsLoading(true);
        setProductsError("");
        try {
            const response = await axios.get(`${API_URL}/api/get_product`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            // console.log("Fetch Products response:", response);
            if (response.status === 200) {
                const products = response.data.products || response.data.data || response.data;
                setAvailableProducts(products);
                toast.success(response.data.message || "Products fetched successfully");
            } else {
                toast.error(response.data.message || "Failed to fetch products");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    setProductsError("Session expired. Please login again.");
                    localStorage.removeItem("token");
                    setTimeout(() => navigate("/"), 1500);
                } else {
                    setProductsError(error.response.data.message || "Failed to load products");
                }
            } else {
                setProductsError("Error fetching products. Please try again.");
            }
            setAvailableProducts([]);
        } finally {
            setProductsLoading(false);
            toast.dismiss();
        }
    }, [token, navigate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteProduct = async (id: number) => {
        setDeletingProducts((prev) => ({ ...prev, [id]: true }));
        try {
            const response = await axios.delete(`${API_URL}/api/delete_product/${id}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            // console.log("Delete Product response:", response.data);
            if (response.status === 200) {
                toast.success(response.data.message || "Product deleted successfully");
                setAvailableProducts(prevProducts => prevProducts.filter(p => p.id !== id));
            } else {
                toast.error(response.data.message || "Failed to delete product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            if (axios.isAxiosError(error) && error.response) {
                console.error("Delete error details:", error.response.data);
                toast.error(error.response.data.message || "Failed to delete product");
            } else {
                toast.error("Error deleting product. Please try again.");
            }
        } finally {
            setDeletingProducts((prev) => ({ ...prev, [id]: false }));
            toast.dismiss();
        }
    };
    
    const handleUpdateProduct = (productData: Product) => {
        setProductToUpdate(productData);
    };

    const handleModalClose = () => {
        setProductToUpdate(null);
    };


    const filteredProducts = availableProducts.filter((product) => {
        const searchQueryLower = searchQuery.toLowerCase();
        const productItemLower = product?.items?.toLowerCase() || "";
        const productCategoryLower = product?.category?.toLowerCase() || "";

        const matchesSearchTerm = productItemLower.includes(searchQueryLower);
        const matchesCategory =
            selectedCategory === "all" ||
            productCategoryLower.includes(selectedCategory.toLowerCase());

        return matchesSearchTerm && matchesCategory;
    });

    return (
        <div className=''>
            <div className="mb-6 flex md:flex-row gap-4 flex-col md:items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-900">Products</h3>
                <div className="flex md:w-3/5 items-center gap-6">
                    <input 
                        type="search" 
                        name="searchQuery" 
                        id="searchQuery" 
                        placeholder='Search Products'
                        value={searchQuery}
                        className='w-full py-2 border border-black/30 outline-0 indent-3 rounded-md'
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        type='button'
                        onClick={fetchData}
                        disabled={productsLoading}
                        className='py-2 bg-black text-white rounded flex items-center justify-center px-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    >{productsLoading ? "Refreshing..." : "Refresh"}</button>
                </div>
            </div>
            <div className="flex flex-wrap gap-4 mb-8">
                {['all', 'seasoning', 'oil', 'foodstuff'].map((category) => (
                <button
                    key={category}
                    type="button"
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-black cursor-pointer ${
                    selectedCategory === category
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-black hover:text-white'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
                ))}
            </div>
            
            <div>
                {productsLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent"></div>
                    </div>
                ) : productsError ? (
                    <div className="text-center py-10 text-red-600 font-medium">{productsError}</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 font-medium">
                        No products found {availableProducts.length > 0 ? 'matching your criteria.' : '.'}
                    </div>
                ) : (
                <div className='overflow-x-auto styled-scrollbar'>
                    <table className="w-full table-fixed border-collapse">
                        <thead className="">
                            <tr className="text-sm capitalize font-medium">
                            <th className="px-6 py-2 text-left">Item</th>
                            <th className="px-6 py-2 text-left">Price</th>
                            <th className="px-6 py-2 text-left">Available</th>
                            <th className="px-6 py-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                            <ProductRow
                                key={product.id}
                                {...product}
                                onAdd={() => {}} 
                                buttonText=""
                                increaseAction={() => {}}
                                decreaseAction={() => {}}
                                removeAction={() => {}}
                                onUpdate={handleUpdateProduct}
                                onDelete={handleDeleteProduct}
                                isDeleting={deletingProducts[product.id] || false}
                            />
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
            </div>

            {/* 3. NEW LOGIC: Update Product Modal */}
            {productToUpdate && (
                <Modal onClose={handleModalClose}>
                    <div className="p-4">
                        <h3 className="text-xl font-bold mb-4">Update Product: {productToUpdate.items}</h3>
                        <ProductForm
                            productData={productToUpdate}
                            onSuccess={() => {
                                fetchData();
                                handleModalClose();
                            }}
                            onCancel={handleModalClose}
                        />
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default ProductList;