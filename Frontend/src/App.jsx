import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import PublicLayout from "./layout/PublicLayout";
import HomePage from "./Pages/Home/Home";
import AuthPage from "./Pages/Auth/Auth";
import NotFound from "./Pages/NotFound";
import ProductPage from "./Pages/Products/Home";
import ProductDetailPage from "./Pages/Products/ProductDetail/Home";
import SpecializationSelect from "./Pages/Consultations/SpecializationSelect";
import DoctorList from "./Pages/Consultations/DoctorList";
import DoctorDetail from "./Pages/Consultations/DoctorDetail";
import ConsultationPayment from "./Pages/Consultations/ConsultationPayment";
import ConsultationSuccess from "./Pages/Consultations/Success";

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
      {
        path: "products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "consultations",
        element: <SpecializationSelect />,
      },
      {
        path: "consultations/doctors",
        element: <DoctorList />,
      },
      {
        path: "consultations/doctors/:doctorId",
        element: <DoctorDetail />,
      },
      {
        path: "consultations/:id/payment",
        element: <ConsultationPayment />,
      },
      {
        path: "consultations/success",
        element: <ConsultationSuccess />,
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
