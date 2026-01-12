import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";

const MainLayout = () => {
  const { pathname } = useLocation();
  const isVendorRegister = pathname === "/vendor/register";

  if (isVendorRegister) {
    return (
      <main className="w-full h-screen overflow-hidden">
        <Outlet />
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-36">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
