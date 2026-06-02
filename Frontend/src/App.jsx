import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PublicLayout from "./layout/PublicLayout";
import HomePage from "./Pages/Home/Home";
import AuthPage from "./Pages/Auth/Auth";
import NotFound from "./Pages/NotFound";
import ProductPage from "./Pages/Products/Home";
//bred
const routes = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "products",
        element: <ProductPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
