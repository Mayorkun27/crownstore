# Crown Store Point-of-Sale System 🛒

## Project Overview
Crown Store is a modern, intuitive Point-of-Sale (POS) application designed to streamline product management and sales operations. Developed with React and TypeScript, it provides distinct interfaces for administrators and sales representatives to efficiently handle inventory, process orders, and track sales data.

## Features
- **Role-Based Authentication**: Secure login for both Admin and Sales Representative roles.
- **Product Management**:
    - Admins can add new products, update existing product details (name, price, category, stock), and delete products.
    - Real-time stock quantity updates reflecting sales.
- **Shopping Cart System**:
    - Sales representatives can easily add products to a dynamic cart.
    - Adjust product quantities directly within the cart.
    - Clear cart functionality.
- **Order Processing**:
    - Confirms orders and processes them, reducing product stock.
    - Generates printable receipts for completed transactions.
- **Order History & Reporting**:
    - Admins can view a comprehensive history of all orders, with filtering by month and year.
    - Sales representatives can view their daily sales and total orders.
- **Search & Filter**: Efficiently search for products by name and filter by category.
- **Password Reset**: Admin functionality to reset sales representative passwords.
- **Responsive Interface**: Built with Tailwind CSS for a seamless experience across various devices.

## Getting Started

### Installation
To get Crown Store up and running on your local machine, follow these steps:

1.  ⬇️ **Clone the Repository**:
    ```bash
    git clone https://github.com/Sunmence-team/crownstore.git
    cd crownstore
    ```

2.  📦 **Install Dependencies**:
    ```bash
    npm install
    ```

### Environment Variables
Before running the application, you need to configure the following environment variable. Create a `.env` file in the root of the project:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```
**Example**:
`VITE_API_BASE_URL=http://localhost:8000` (Replace with your actual backend API URL)

### Running the Application
To start the development server:
```bash
npm run dev
```
The application will be accessible in your browser at the address provided by Vite (e.g., `http://localhost:5173`).

## Usage

### Logging In
Upon launching the application, you will be directed to the login page.
1.  Enter your `username` and `password`.
2.  Click "Log In".
3.  You will be redirected based on your role:
    -   **Admin**: Redirected to `/adminhome` (Product Management).
    -   **Sales Representative**: Redirected to `/home` (Product Selection).

### Sales Representative Workflow (Homepage)
The `/home` page is designed for sales representatives to process new orders.
1.  **Search Products**: Use the search bar to find products by name.
2.  **Filter by Category**: Select a category button (e.g., "Seasoning", "Oil", "Foodstuff") to narrow down the product list.
3.  **Add to Cart**: Click the "Add" button next to any product to add it to the cart. If a product is out of stock, the button will be disabled.
4.  **Manage Cart**:
    -   In the cart section on the right, you can see selected products.
    -   Use the `+` and `-` buttons to adjust product quantities.
    -   Click the trash icon to remove a product from the cart.
    -   Click "Clear" to empty the entire cart.
5.  **Confirm and Print**: After adding all desired items, click "Confirm and Print". This will create the order, update stock, and open a print dialogue for the receipt.

### Sales Representative Today's Orders
On the `/today` page, sales representatives can view a summary of their orders for the current day.
1.  **Access**: Click the "Personnel" link from the homepage or navigate directly to `/today`.
2.  **View Summary**: See the total number of products sold and the total sales amount for the day.
3.  **Order List**: A table displays detailed information for each order made today, including Order ID, items, total amount, and creation time.

### Admin Workflow (Product Management)
The `/adminhome` page is for administrators to manage products.
1.  **Add New Product**: Use the "Add New Product" form on the right:
    -   Enter `Item Name`.
    -   Enter `Price`.
    -   Select a `Category`.
    -   Enter initial `Quantity` in stock.
    -   Click "Add Product".
2.  **Product List**: The main table displays all available products.
    -   **Search & Filter**: Use the search bar and category buttons to find specific products.
    -   **Update Product**: Click the "Update" button next to a product to open a modal. Adjust product details and click "Save Changes".
    -   **Delete Product**: Click the "Delete" button to remove a product from the inventory.
3.  **Refresh Products**: Click the "Refresh" button to update the product list with the latest data.

### Admin Order History
On the `/history` page, administrators can view all past orders.
1.  **Access**: Navigate to `/history`.
2.  **Filter Orders**: Use the "Month" and "Year" dropdowns in the filter card to narrow down the order list. Click "Apply Filter".
3.  **View Orders**: A table displays detailed information for all orders, including Order ID, items, total amount, and creation date/time.

### Admin Reset Sales Representative Password
The `/reset` page allows administrators to reset a sales representative's login credentials.
1.  **Access**: Navigate to `/reset`.
2.  **Enter Details**: Provide the `username`, `email` (optional), and the `new password` for the sales representative.
3.  **Reset Credentials**: Click "Reset Credentials" to update their login information.

## Technologies Used
This project leverages a robust set of modern web technologies to deliver a high-performance and scalable solution.

| Technology              | Description                                                          |
| :---------------------- | :------------------------------------------------------------------- |
| **React**               | A JavaScript library for building user interfaces.                   |
| **TypeScript**          | A typed superset of JavaScript that compiles to plain JavaScript.    |
| **Vite**                | A fast build tool that provides an extremely quick development experience. |
| **Tailwind CSS**        | A utility-first CSS framework for rapidly building custom designs.   |
| **Axios**               | A promise-based HTTP client for making API requests.                |
| **React Router DOM**    | Declarative routing for React applications.                          |
| **Formik**              | A popular library for building forms in React, simplifying form state management and validation. |
| **Yup**                 | A schema builder for value parsing and validation.                  |
| **Sonner**              | An accessible and highly customizable toast library for React.       |
| **React Icons**         | A collection of popular SVG icons for React projects.                |
| **React To Print**      | A component to trigger browser print functionality for React components. |

## Author Info
Developed with dedication and precision.

- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/your_username)
- **Twitter**: [@YourTwitterHandle](https://twitter.com/your_username)
- **Portfolio**: [Your Portfolio Website](https://your-portfolio.com)

---

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)