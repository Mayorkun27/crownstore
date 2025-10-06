import { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '../../layout/Layout';

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

interface AllOrdersData {
  message: string;
  orders: Order[];
  total_amount_made_today: number;
  total_order: number;
}

const AllOrder = () => {
  const token = localStorage.getItem('token');
  const [orderData, setOrderData] = useState<AllOrdersData>();
  const [ordersLoading, setOrdersLoading] = useState(false);

  // filter state
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  const fetchAllOrders = async () => {
    setOrdersLoading(true);
    try {
      let url = `${API_URL}/api/allorder`;

      if (month && year) {
        url = `${API_URL}/api/orders/month/${month}/${year}`;
      }

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) setOrderData(response.data);

    } catch (error: any) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        toast.error('Failed to load orders');
      }
    } finally {
      setOrdersLoading(false);
    }
  };

  // fetch initial (all orders) once on mount
  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <Layout>
      <div className=''>
        <div className='flex lg:flex-row flex-col items-start gap-8 justify-between'>
          
          {/* Filter Card */}
          <div className="lg:w-1/4 w-full bg-white shadow-md sticky top-[0px] p-6 rounded-lg">
            <h3 className='!font-[Raleway] text-2xl font-semibold mb-4'>Filter</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Month</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full border border-black/30 outline-0 rounded-md p-2"
                >
                  <option value="">All</option>
                  {Array.from({length: 12}, (_, i) => (
                    <option key={i+1} value={i+1}>
                      {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full border border-black/30 outline-0 rounded-md p-2"
                >
                  <option value="">All</option>
                  {Array.from({length: 5}, (_, i) => {
                    const y = new Date().getFullYear() - i;
                    return <option key={y} value={y}>{y}</option>;
                  })}
                </select>
              </div>

              <button
                onClick={fetchAllOrders}
                className="w-full bg-black text-white py-2 rounded-md"
              >
                Apply Filter
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="lg:w-3/4 w-full shadow-md">
            <div className="bg-white p-4 rounded-lg shadow">
              {ordersLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-black border-t-transparent"></div>
                </div>
              ) : (
                <>
                  {orderData?.orders?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No orders found.
                    </div>
                  ) : (
                    <table className="w-full table-fixed divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-2 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Items
                          </th>
                          <th className="px-2 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                            T. Amount
                          </th>
                          <th className="px-2 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-2 py-3 text-left text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orderData?.orders?.map((item) => (
                          <tr key={item.order_id}>
                            <td className="px-2 py-4 text-xs lg:text-sm font-medium text-gray-900">
                              {item.order_id}
                            </td>
                            <td className="px-2 py-4 text-xs lg:text-sm text-gray-500 break-words">
                              {item?.items.map((product, idx) => (
                                <div key={idx}>
                                  {product?.product_name} &nbsp;
                                  X{product.quantity}
                                </div>
                              ))}
                            </td>
                            <td className="px-2 py-4 text-xs lg:text-sm text-gray-500">
                              #{item.total_amount}
                            </td>
                            <td className="px-2 py-4 text-xs lg:text-sm text-gray-500">
                              {item.created_at.split(" ")[0]}
                            </td>
                            <td className="px-2 py-4 text-xs lg:text-sm text-gray-500">
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
    </Layout>
  )
}

export default AllOrder
