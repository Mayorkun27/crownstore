import { MdOutlineShoppingCart } from "react-icons/md";
import { CiTrash } from 'react-icons/ci'
import { GoPlus } from 'react-icons/go'
import { PiMinusThin } from 'react-icons/pi'
import { BiPencil } from 'react-icons/bi'; // Icon for Update
import { formatterUtility } from '../utilities/formatterutility'; // Assuming this is correct
import { useLocation } from "react-router-dom";

// Define the shape of the product data object passed to actions
interface ProductData {
    id: number;
    items: string;
    price: number;
    in_stock: number;
    total_sold: number;
    category: string;
}

interface ProductRowProps {
    id: number;
    items: string;
    price: number;
    in_stock: number;
    total_sold: number;
    category: string;
    
    onAdd: (data: ProductData) => void;
    buttonText: string;

    onUpdate?: (data: ProductData) => void;
    onDelete?: (id: number) => void;

    isDeleting?: boolean;
    isInCart?: boolean;
    increaseAction: () => void;
    decreaseAction: () => void;
    removeAction: () => void;
}

const ProductRow = ({ 
    id, 
    items, 
    price, 
    in_stock, 
    total_sold, 
    category,
    onAdd, 
    buttonText, 
    onUpdate, 
    onDelete, 
    isDeleting, 
    isInCart, 
    increaseAction, 
    decreaseAction, 
    removeAction 
}: ProductRowProps) => {
    const location = useLocation();

    const productData: ProductData = { id, items, price, in_stock, total_sold, category }; 
    const remainingQuantity = Number(in_stock) - Number(total_sold);
    const isOutOfStock = remainingQuantity <= 0;
    // const isOutOfStock = in_stock <= 0;
    const role = localStorage.getItem("role")

    const baseButtonClass = "flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-300";
    const disabledClass = 'bg-gray-400 mx-auto text-white cursor-not-allowed';

    return (
        <tr className="hover:bg-yellow-50/50 transition-all duration-200 border-y border-black/20 last:border-b-0 first:border-t-0">
            <td className="md:px-6 px-2 py-2 text-left text-sm font-medium">{items}</td>
            <td className="px-6 py-2 text-left text-sm">{formatterUtility(Number(price))}</td>
            <td className="px-6 py-2 text-left text-sm">{remainingQuantity}</td>
            {/* <td className="px-6 py-2 text-left text-sm">{in_stock}</td> */}
            <td className="px-6 py-2 text-right">
                {isInCart ? (
                    // Logic for items already in cart (Quantity controls)
                    <div className='flex justify-center gap-2'>
                        <button 
                            title='Increase Quantity'
                            type='button'
                            className='border border-black text-s cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-black hover:text-white'
                            onClick={increaseAction}
                        >
                            <GoPlus />
                        </button>
                        <button 
                            title='Decrease Quantity'
                            type='button'
                            className='border border-black text-s cursor-pointer w-8 h-8 rounded-full flex items-center justify-center hover:bg-black hover:text-white'
                            onClick={decreaseAction}
                        >
                            <PiMinusThin />
                        </button>
                        <button 
                            title='Remove from Cart'
                            type='button'
                            className='border text-s cursor-pointer w-8 h-8 rounded-full flex items-center justify-center back-hover-red hover:text-white border-red-600 text-red-600'
                            onClick={removeAction}
                        >
                            <CiTrash />
                        </button>
                    </div>
                ) : (
                    // Logic for items in the product list
                    <div className="flex gap-2 justify-start">
                        {
                            role === "admin" && location.pathname !== "/home" ? (
                                <>
                                    <button
                                        className={`${baseButtonClass} bg-black text-white`}
                                        onClick={() => onUpdate?.(productData)}
                                        title="Update Product Details"
                                    >
                                        <BiPencil />
                                        <span className="md:inline-flex hidden">Update</span>
                                    </button>

                                    <button
                                        className={`${baseButtonClass} ${isDeleting ? disabledClass : 'back-red text-white hover:bg-red-700'}`}
                                        disabled={isDeleting}
                                        onClick={() => onDelete?.(id)}
                                        title={isDeleting ? "Deleting..." : "Delete Product"}
                                    >
                                        <CiTrash />
                                        <span className="md:inline-flex hidden">{isDeleting ? "Deleting..." : "Delete"}</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                  className={`${baseButtonClass} ${isDeleting || isOutOfStock ? disabledClass : 'bg-black text-white mx-auto hover:bg-gray-800'}`}
                                  disabled={isDeleting || isOutOfStock}
                                  onClick={() => onAdd(productData)}
                                  title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
                                >
                                  <MdOutlineShoppingCart />
                                  {buttonText}
                                </button>
                            )
                        }
                    </div>
                )}
            </td>
        </tr>
    );
};

export default ProductRow;