import { Outlet } from "react-router-dom";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";

const MainLayout = () => {
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
