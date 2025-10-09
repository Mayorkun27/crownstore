import React from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface FormValues {
  items: string;
  price: string | number;
  category: string;
  in_stock: string | number;
}

interface ProductFormProps {
  productData?: FormValues & { id: number }; 
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const isEditMode = !!productData;
  const productID = productData?.id;

  const initialValues: FormValues = {
    items: isEditMode ? productData.items : "",
    price: isEditMode ? productData.price : "",
    category: isEditMode ? productData.category : "",
    in_stock: isEditMode ? "" : "",
  };

    const formik = useFormik({
      initialValues,
      validationSchema: Yup.object({
        items: Yup.string()
          .required("Item name is required!"),
        price: Yup.number()
          .required("Price is required!")
          .positive("Price must be positive"),
        category: Yup.string()
          .when([], {
            is: () => !isEditMode,
            then: (schema) => schema.required("Category is required!"),
            otherwise: (schema) => schema.optional(),
          }),
        in_stock: Yup.number()
          .when([], {
            is: () => !isEditMode,
            then: (schema) => schema.required("Quantity is required").min(0, "Quantity cannot be negative"),
            otherwise: (schema) => schema.min(0).optional(),
          })
          .typeError("Stock quantity must be a number"),
      }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
          if (!token) {
            toast.error("Authentication required.");
            setTimeout(() => navigate("/"), 1500);
            return;
          }
          
          const endpoint = isEditMode 
            ? `${API_URL}/api/products/update/${productID}`
            : `${API_URL}/api/create_product`;
      
            const payload = isEditMode ? { ...values, product_id: productID } : values;
            
            try {
              const response = await axios.post(endpoint, payload, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });

              // console.log(`${isEditMode ? "Update" : "Create"} Product response:`, response);
              
              if (response.status === 200 || response.status === 201) {
                toast.success(response.data.message || `Product ${isEditMode ? "updated" : "created"} successfully`);
                
                if (isEditMode) {
                  onSuccess?.();
                  onCancel && onCancel();
                } else {
                  resetForm(); 
                }
              }
            } catch (err) {
                console.error(`${isEditMode ? "Update" : "Create"} Product error:`, err);
                if (axios.isAxiosError(err) && err.response) {
                  if (err.response.status === 401) {
                    toast.error(err.response.data.message || "Session expired.");
                    localStorage.removeItem("token");
                    setTimeout(() => navigate("/"), 1500);
                  } else {
                    toast.error(err.response.data.message || `Failed to ${isEditMode ? "update" : "create"} product`);
                  }
                } else {
                  toast.error(`Product ${isEditMode ? "update" : "creation"} failed. Please try again.`);
                }
            } finally {
                setSubmitting(false);
                toast.dismiss();
            }
        },
    });

    return (
      <div className={isEditMode ? 'p-0' : 'bg-white p-8 rounded-xl shadow-lg sticky top-4 z-10'}>
          
          {!isEditMode && (
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Add New Product</h3>
          )}
          
          <form onSubmit={formik.handleSubmit} className="space-y-5">
              {/* 1. Item Name Field */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name
                  </label>
                  <input
                      type="text"
                      name="items"
                      value={formik.values.items}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition-all duration-200 ${
                          formik.touched.items && formik.errors.items ? "border-red-500" : ""
                      }`}
                      placeholder="Enter product name"
                  />
                  {formik.touched.items && formik.errors.items && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.items}</p>
                  )}
              </div>

              {/* 2. Price Field */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₦)
                  </label>
                  <input
                      type="number"
                      name="price"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition-all duration-200 ${
                          formik.touched.price && formik.errors.price ? "border-red-500" : ""
                      }`}
                      placeholder="Enter price"
                      step="0.01"
                  />
                  {formik.touched.price && formik.errors.price && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
                  )}
              </div>

              {/* 3. Category Field */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formik.values.category || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2 capitalize border border-gray-300 rounded-lg focus:outline-none transition-all duration-200 ${
                        formik.touched.category && formik.errors.category ? "border-red-500" : ""
                    }`}
                  >
                    <option value="" disabled>Select a category</option>
                    <option value="seasoning">seasoning</option>
                    <option value="oil">oil</option>
                    <option value="foodstuffs">foodstuffs</option>
                    <option value="others">others</option>
                  </select>
                  {formik.touched.category && formik.errors.category && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.category}</p>
                  )}
              </div>

              {/* 4. Quantity Field */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                  </label>
                  <input
                      type="number"
                      name="in_stock"
                      value={formik.values.in_stock}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition-all duration-200 ${
                          formik.touched.in_stock && formik.errors.in_stock ? "border-red-500" : ""
                      }`}
                      placeholder="Enter quantity"
                  />
                  {formik.touched.in_stock && formik.errors.in_stock && (
                      <p className="text-red-500 text-sm mt-1">{formik.errors.in_stock}</p>
                  )}
              </div>

              {/* Submit/Action Button(s) */}
              {isEditMode ? (
                  // Edit Mode Buttons (Submit and Cancel)
                  <div className="flex justify-end space-x-3 pt-2">
                      <button
                          type="button"
                          onClick={onCancel} // Use the onCancel prop to close the modal
                          disabled={formik.isSubmitting}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                      >
                          Cancel
                      </button>
                      <button
                          type="submit"
                          disabled={formik.isSubmitting || !formik.isValid}
                          className={`px-4 py-2 text-sm font-medium text-white bg-black rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                          {formik.isSubmitting ? "Saving Changes..." : "Save Changes"}
                      </button>
                  </div>
              ) : (
                  // Create Mode Button (Single submit button)
                  <button
                      type="submit"
                      disabled={formik.isSubmitting}
                      className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-300 cursor-pointer bg-black disabled:bg-black/50 disabled:cursor-not-allowed`}
                  >
                      {formik.isSubmitting ? "Adding..." : "Add Product"}
                  </button>
              )}
          </form>
      </div>
    )
}

export default ProductForm;