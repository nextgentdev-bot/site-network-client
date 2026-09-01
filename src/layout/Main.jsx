import { Outlet } from "react-router-dom";
import Navbar from "../pages/shared/Navbar/Navbar";



const Main = () => {
    return (
        <div className="p-4">
            <Navbar />
            <Outlet />
        </div>
    );
};

export default Main;