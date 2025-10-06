import { useEffect, useState } from 'react'
import { formatterUtility } from '../../utilities/formatterutility'
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { FaStoreAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';
import { IoIosLogOut } from "react-icons/io";

const API_URL = import.meta.env.VITE_API_BASE_URL

interface OrderProduct {
  item_price: string;
  product_name: string;
  quantity: number;
}
interface Order {
  order_id: string;
  items: OrderProduct[];
  total_amount: string;
  created_at: string;
}

interface TodayOrdersData {
  message: string;
  orders: Order[];
  total_amount_made_today: number;
  total_order: number;
}

const TodayOrder = () => {
  const token = localStorage.getItem('token');
  const [orderData, setOrderData] = useState<TodayOrdersData>();
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const fetchTodayOrders = async () => {
      setOrdersLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/todayorder`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log("response", response);
        if (response.status === 200) setOrderData(response.data);

      } catch (error: any) {
        console.error('Error fetching today\'s orders:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          toast.error('Failed to load today\'s orders');
        }
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchTodayOrders();
  }, []);

  const Card = ({label, value}: {label:string; value:string}) => {
    return (
      <div className='w-full border border-black/20 rounded-md p-4 bg-amber-50 shadow'>
        <small className='font-medium text-gray-700'>{label}</small>
        <h3 className='text-5xl font-bold !font-[Raleway]'>{value}</h3>
      </div>
    )
  }

  return (
    <div className='md:pt-[64px] pt-[74px]'>
      <header className='bg-white fixed left-0 top-0 z-99 w-full flex flex-col gap-4 items-center justify-between shadow-md border-b border-black/20 py-4 md:px-8 px-4'>
        <div className='w-full flex items-center justify-between'>
          <div className="flex items-center gap-2">
            <img src={assets.logo} alt="Crownstore logo" className='w-10 mx-auto' />
            <h4 className='text-lg font-bold leading-4'>Crown Store</h4>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to={"/home"}
              className='bg-black text-white flex items-center gap-2 p-2 rounded-md'
            >
              <FaStoreAlt />
              <span>Shop</span>
            </Link>
            <button
              type='button'
              className='bg-red-600 text-white flex items-center gap-2 p-2 rounded-md'
            >
              <IoIosLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>
      <div className='bg-yellow-50/20 md:p-8 p-4 flex lg:flex-row flex-col items-start gap-8 justify-between'>
        <div className="lg:w-1/4 w-full grid lg:grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            label={"Product Sold Count"}
            value={formatterUtility(Number(orderData?.total_order), true)}
          />
          <Card 
            label={"Today's Sales"}
            value={formatterUtility(Number(orderData?.total_amount_made_today))}
          />
        </div>
        <div className="lg:w-3/4 w-full shadow-md">
          <div className="bg-white p-6 rounded-lg shadow">
            {ordersLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accClrYellow"></div>
              </div>
            ) : (
              <>
                {orderData?.orders?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No orders found for today.
                  </div>
                ) : (
                  <table className="w-full table-fixed divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="w-[15%] px-2 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="w-[25%] px-2 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="w-[10%] px-2 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Total Amount
                        </th>
                        <th className="w-[15%] px-2 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="w-[10%] px-2 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orderData?.orders?.map((item) => (
                        <tr key={item.order_id}>
                          <td className="px-2 lg:px-4 py-4 text-xs lg:text-sm font-medium text-gray-900">
                            {item.order_id}
                          </td>
                          <td className="px-2 lg:px-4 py-4 text-xs lg:text-sm text-gray-500 break-words">
                            {item?.items.map((product) => (
                              <div>
                                {product?.product_name} &nbsp;
                                X{product.quantity}
                              </div>
                            ))}
                          </td>
                          <td className="px-2 lg:px-4 py-4 text-xs lg:text-sm text-gray-500">
                            #{item.total_amount}
                          </td>
                          <td className="px-2 lg:px-4 py-4 text-xs lg:text-sm text-gray-500">
                            {item.created_at.split(" ")[0]}
                          </td>
                          <td className="px-2 lg:px-4 py-4 text-xs lg:text-sm text-gray-500">
                            {item.created_at.split(" ")[1]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodayOrder