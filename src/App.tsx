import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import TodayOrder from "./pages/rep/TodayOrder";
import ManageProducts from "./pages/admin/ManageProducts";
import AllOrder from "./pages/admin/AllOrder";
import ResetRepPassword from "./pages/admin/ResetRepPassword";

function App() {
 
  return (
    <>
      <Toaster 
        position="bottom-left"
      />
      <Routes>
        <Route 
          index
          element={<Login />}
        />
        <Route 
          path="/home"
          element={<Home />}
        />
        <Route 
          path="/today"
          element={<TodayOrder />}
        />
        <Route 
          path="/adminhome"
          element={<ManageProducts />}
        />
        <Route 
          path="/history"
          element={<AllOrder />}
        />
        <Route 
          path="/reset"
          element={<ResetRepPassword />}
        />
      </Routes>
    </>
  )
}

export default App
