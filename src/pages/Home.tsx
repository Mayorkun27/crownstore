import { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { HiBars3 } from "react-icons/hi2";
import { FaPersonWalking } from "react-icons/fa6";
import ProductRow from "../components/ProductRow.tsx"
import { toast } from 'sonner';
import axios from 'axios';
import Cart from '../components/Cart.tsx';

interface ProductProps {
  id: number;
  items: string;
  price: number;
  in_stock: number;
  total_sold: number;
  category: string;
}

interface CartItemProps extends ProductProps {
    quantity: number;
}

const API_URL = import.meta.env.VITE_API_BASE_URL

const Home = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [cart, setCart] = useState<CartItemProps[]>([]);
    const [availableProducts, setAvailableProducts] = useState<ProductProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/get_product`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
            });

            console.log("response", response);

            if (response.status === 200) {
                setAvailableProducts(response.data.products);
                // toast.success('Products loaded successfully');
            }
        } catch (error: any) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/';
            }
        } finally {
            setLoading(false);
        }
        };

        fetchProducts();
    }, []);

    const filteredProducts = availableProducts.filter(product => {
        const searchQueryLower = searchQuery.toLowerCase();
        const productItemLower = product.items.toLowerCase();
        const productCategoryLower = product.category.toLowerCase();

        const matchesSearchTerm = productItemLower.includes(searchQueryLower);
        const matchesCategory = selectedCategory === "all" || productCategoryLower.includes(selectedCategory.toLowerCase());

        return matchesSearchTerm && matchesCategory;
    });
    const handleAddToCart = (productToAdd: ProductProps) => {
        const stockProduct = availableProducts.find(p => p.id === productToAdd.id);

        if (!stockProduct || stockProduct.in_stock <= 0) {
            toast.error(`Sorry, ${productToAdd.items} is out of stock!`);
            return;
        }

        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === productToAdd.id);

            if (existing) {
            return prevCart.map(item =>
                item.id === productToAdd.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            } else {
            return [...prevCart, { ...productToAdd, quantity: 1 }];
            }
        });

        // Reduce in-stock count
        setAvailableProducts(prev =>
            prev.map(p =>
            p.id === productToAdd.id
                ? { ...p, in_stock: p.in_stock - 1 }
                : p
            )
        );
    };

    const handleIncreaseQuantity = (productId: number) => {
        const stockProduct = availableProducts.find(p => p.id === productId);
        const cartItem = cart.find(c => c.id === productId);

        if (!stockProduct || stockProduct.in_stock <= 0) {
            toast.error(`Cannot add more. ${cartItem?.items} is out of stock!`);
            return;
        }

        setCart(prev =>
            prev.map(item =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );

        setAvailableProducts(prev =>
            prev.map(p =>
            p.id === productId ? { ...p, in_stock: p.in_stock - 1 } : p
            )
        );
    };


    const handleDecreaseQuantity = (productId: number) => {
        setCart(prevCart =>
            prevCart
            .map(item =>
                item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter(item => item.quantity > 0)
        );

        setAvailableProducts(prev =>
            prev.map(p =>
            p.id === productId ? { ...p, in_stock: p.in_stock + 1 } : p
            )
        );
    };

    const handleRemoveFromCart = (productId: number) => {
        const removedItem = cart.find(c => c.id === productId);
        if (removedItem) {
            setAvailableProducts(prev =>
            prev.map(p =>
                p.id === productId
                ? { ...p, in_stock: p.in_stock + removedItem.quantity }
                : p
            )
            );
        }
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const handleClearCart = () => {
        setAvailableProducts(prev =>
            prev.map(p => {
            const inCart = cart.find(c => c.id === p.id);
            if (inCart) {
                return { ...p, in_stock: p.in_stock + inCart.quantity };
            }
            return p;
            })
        );
        setCart([]);
    };

    
    return (
        <div className='bg-yellow-50/20 md:px-8 px-4 min-h-screen md:pt-[74px] pt-[130px] pb-8'>
            <header className='bg-white fixed left-0 top-0 z-99 w-full flex flex-col gap-4 items-center justify-between shadow-md border-b border-black/20 py-4 md:px-8 px-4'>
                <div className='w-full flex items-center justify-between'>
                    <div className="flex items-center gap-2">
                        <img src={assets.logo} alt="Crownstore logo" className='w-10 mx-auto' />
                        <h4 className='text-lg font-bold leading-4'>Crown Global Store</h4>
                    </div>
                    <input 
                        type="search" 
                        name="searchQuery" 
                        id="searchQuery" 
                        placeholder='Search Products'
                        value={searchQuery}
                        className='md:inline-flex hidden w-1/2 py-2 border border-black/30 outline-0 indent-3 rounded-md'
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Link
                        to={"/today"}
                        className='bg-black text-white flex items-center gap-2 p-2 rounded-md'
                    >
                        <FaPersonWalking />
                        <span>Personnel</span>
                    </Link>
                </div>
                <div className="flex gap-4 w-full md:hidden">
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
                        className='w-14 border border-black/20 rounded flex items-center justify-center text-2xl'
                    >
                        <HiBars3 />
                    </button>
                </div>
            </header>
            <div className="py-4 flex items-center md:justify-center gap-4 overflow-x-scroll styled-scrollbar">
                {['all', 'seasoning', 'oil', 'foodstuff', 'others'].map((category) => (
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
            <div className="flex relative md:flex-row flex-col items-start gap-8">
                <div className="md:w-[70%] w-full overflow-x-auto">
                    {searchQuery && <p className='md:text-2xl text-lg my-3 font-medium'>Showing results for <span className='!italic text-yellow-600'>&#34;{searchQuery}&#34;</span></p>}
                    <table className='w-full'>
                        <thead className='sticky top-0'>
                            <tr className='text-start'>
                                <th className='text-start px-6 py-2'>Product Name</th>
                                <th className='text-start px-6 py-2'>Price</th>
                                <th className='text-start px-6 py-2'>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ? (
                                    <tr>
                                        <td colSpan={3}>
                                            <div className='w-10 h-10 border-4 border-black mx-auto border-t-transparent rounded-full animate-spin'></div>
                                        </td>
                                    </tr>
                                ) : filteredProducts.map((product, index) => {
                                    const itExists = cart.find(cart => cart.id === product.id);
                                    return (
                                        <ProductRow 
                                            key={index}
                                            {...product}
                                            buttonText='Add'
                                            onAdd={handleAddToCart}
                                            isInCart={!!itExists}
                                            increaseAction={() => handleIncreaseQuantity(product.id)}
                                            decreaseAction={() => handleDecreaseQuantity(product.id)}
                                            removeAction={() => handleRemoveFromCart(product.id)}
                                        />
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className="md:w-[30%] w-full p-4 sticky top-[100px] bg-white shadow-lg rounded-md">
                    <Cart
                        cart={cart}
                        handleClearCart={handleClearCart}
                        handleRemoveFromCart={handleRemoveFromCart}
                        handleIncreaseQuantity={handleIncreaseQuantity}
                        handleDecreaseQuantity={handleDecreaseQuantity}
                    />

                </div>
            </div>
        </div>
    )
}

export default Home