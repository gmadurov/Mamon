import "./App.css";
import { FullProvider } from "./context/FullContext";
import Cart from "./pages/Cart";
import Products from "./pages/Products";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./pages/NavBar";
import LoginPage from "./pages/Login";
import PrivateRoute from "./utils/PrivateRoute";
import ProductForm from "./pages/ProductForm";

function App() {
  const API_URL = "http://127.0.0.1:8000";

  return (
    <Router>
      <FullProvider>
        <NavBar />
        <div className="columns is-centered is-multiline">
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/sell"
              element={
                <PrivateRoute>
                  <Cart sell={true} />
                  <Products />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              exact
              element={
                <PrivateRoute>
                  <Cart sell={true} />
                  <Products />
                </PrivateRoute>
              }
            />
            <Route
              path="/log"    
              element={
                <PrivateRoute>
                  <Cart sell={false} />
                  <Products />
                </PrivateRoute>
              }
            />
            <Route
              path="/addProduct"    
              element={
                <PrivateRoute>
                  <ProductForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/editProduct/:id"    
              element={
                <PrivateRoute>
                  <ProductForm />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </FullProvider>
    </Router>
  );
}

export default App;
