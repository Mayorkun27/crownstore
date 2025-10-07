import React, { useRef, useState } from "react";
import { FaPhone } from "react-icons/fa6";
import SelectedProductRow from "./SelectedProductRow";
import { formatterUtility } from "../utilities/formatterutility";
import { assets } from "../assets/assets";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface CartItem {
  id: number;
  items: string;
  price: number;
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  handleClearCart: () => void;
  handleIncreaseQuantity: (id: number) => void;
  handleDecreaseQuantity: (id: number) => void;
  handleRemoveFromCart: (id: number) => void;
}

interface OrderResponse {
  message: string;
  order_id: string;
}

interface User {
  id: string;
  username: string;
}

const Cart: React.FC<CartProps> = ({
  cart,
  handleClearCart,
}) => {
  const receiptRef = useRef<HTMLDivElement | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  const rawUser = localStorage.getItem("user");
  const user: User | null = rawUser ? JSON.parse(rawUser) : null;


  const subTotalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = 0;

  const handleConfirmAndPrint = async () => {
    setIsProcessing(true)
    if (cart.length === 0) {
      toast.error("Cart is empty. Please add items before confirming.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to complete your order");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
      return;
    }

    const loadingToast = toast.loading("Processing order...");

    const payload = {
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      issued_by: user?.username,
    };

    try {
      const orderResponse = await axios.post<OrderResponse>(
        `${API_URL}/api/order`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Order response:", orderResponse.data);

      setOrderId(orderResponse.data?.order_id)
      setIsPrinting(true);
      setTimeout(() => {
        toast.dismiss(loadingToast);
        window.print();
        setTimeout(() => {
          handleClearCart();
          setIsPrinting(false);
        }, 500);
      }, 800);
    } catch (err) {
      toast.dismiss(loadingToast);

      const error = err as AxiosError<{ message?: string }>;

      console.error("Order or stock update error:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to process order or update stock"
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id="receipt-area"
      ref={receiptRef}
      className={`${
        isPrinting ? "print:w-[58mm] print:px-0 print:pb-4" : "w-full p-2"
      } font-bold relative z-2 bg-white overflow-hidden rounded-lg`}
    >
      {/* Background watermark */}
      <div className="absolute inset-0 -z-1 opacity-10 print:opacity-70 flex flex-col items-center justify-center">
        <img src={assets.logo} alt="Crown store logo" className="w-[60%]" />
      </div>

      <div className={`space-y-4`}>
        {/* Header */}
        <div className={`receipt-top flex gap-2 items-center justify-center text-center text-black border-b border-dashed ${isPrinting ? "border-t border-t-black/10 pb-4 !pt-2" : "pb-6"}`}>
          <img src={assets.logo} alt="Crown store logo" className={`${isPrinting ? "w-10 brightness-[0%] object-contain" : "w-8 object-cover"}`} />
          <h4 className="text-lg font-semibold text-start leading-4">Crown Global Store</h4>
        </div>

        {/* Date and time */}
        <div
          className={`${
            isPrinting ? "text-[10px]" : "text-xs"
          } flex items-center justify-between text-black`}
        >
          <span>Date: {date}</span>
          <span>Time: {time}</span>
        </div>

        <span className="text-sm">Issued By: <span className="capitalize">{user?.username}</span></span>

        {/* Product List */}
        <div className="space-y-2 mt-2">
          <div className="flex items-center justify-between">
            <h6 className={`${isPrinting ? "text-xs" : "text-sm"}`}>
              Selections
            </h6>
            {
              orderId && (<span>{orderId}</span>)
            }
            {(!isPrinting && !isProcessing) && cart.length > 0 && (
              <button
                title="Clear cart"
                type="button"
                className="border border-black text-xs cursor-pointer px-4 py-1 rounded"
                onClick={handleClearCart}
              >
                Clear
              </button>
            )}
          </div>

          <ul
            className={`text-xs flex flex-col gap-1 ${
              !isPrinting && "max-h-[200px] overflow-y-auto"
            }`}
          >
            {cart.length === 0 ? (
              <li className="text-center text-black/60 py-2 text-xs">
                Cart is empty. Add some products!
              </li>
            ) : (
              cart.map((selectedProduct) => (
                <SelectedProductRow
                  key={selectedProduct.id}
                  id={selectedProduct.id}
                  item={selectedProduct.items}
                  price={selectedProduct.price}
                  quantity={selectedProduct.quantity}
                  isPrinting={isPrinting}
                />
              ))
            )}
          </ul>
        </div>

        {/* Totals */}
        <div
          className={`py-2 ${
            isPrinting ? "text-[12px]" : "text-xs"
          } border-y border-dashed space-y-1`}
        >
          <li className="flex items-center justify-between">
            <span className={`${isPrinting ? "text-[10px]" : "text-[10px]"}`}>
              Sub Total
            </span>
            <span>{formatterUtility(subTotalPrice)}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className={`${isPrinting ? "text-[10px]" : "text-[10px]"}`}>
              VAT (0%)
            </span>
            <span>{formatterUtility(tax)}</span>
          </li>
        </div>

        {/* Grand Total */}
        <div
          className={`pb-2 ${
            isPrinting ? "text-[12px]" : "text-xs"
          } border-b border-dashed`}
        >
          <li className="flex items-center justify-between text-pryClr">
            <span>Total</span>
            <h4>{formatterUtility(subTotalPrice + tax)}</h4>
          </li>
        </div>

        {/* Footer */}
        <div
          className={`receipt-bottom text-[10px] ${
            isPrinting && "border-b !h-[25mm]"
          }`}
        >
          <div
            className={`${
              isPrinting ? "flex-col" : "flex-row"
            } flex items-center justify-between`}
          >
            <h6 className={`${isPrinting ? "text-[8px]" : ""}`}>
              Thank you for your visit!
            </h6>
            <small className={`${isPrinting ? "text-[8px]" : "text-[6px]"}`}>
              Please keep the receipts for your records
            </small>
          </div>

          <div
            className={`flex gap-2 justify-center items-center mt-2 ${
              isPrinting ? "text-xs" : "text-sm"
            }`}
          >
            <FaPhone size={12} />
            <small className="leading-2 max-w-3/5">08136758977</small>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      {(!isPrinting && !isProcessing) && cart.length > 0 && (
        <div className="text-center">
          <button
            title="Finish Order"
            type="button"
            disabled={isProcessing}
            className="bg-black text-white mt-4 px-4 py-2 cursor-pointer rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleConfirmAndPrint}
          >
            {isProcessing ? "Processing..." : "Confirm and Print"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
