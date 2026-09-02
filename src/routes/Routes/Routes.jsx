import { createBrowserRouter } from "react-router-dom";
import Main from "../../layout/Main";
import Home from "../../pages/Home/Home";
import Login from "../../pages/Login/Login"
import Register from "../../pages/Register/Register"
import Websites from "../../pages/Websites/Websites";
import AddWebsiteDashboard from "../../pages/Dashboard/AddWebsiteDashboard/AddWebsiteDashboard";



export const router = createBrowserRouter([
    {
        path: '/',
        element: <Main></Main>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/sites',
                element: <Websites></Websites>
            },
            {
                path: 'login',
                element: <Login></Login>
            },
            {
                path: 'register',
                element: <Register></Register>
            },
            {
                // TODO: wrap with <PrivateRoutes> once that component exists,
                // so only logged-in users can reach the add-website form.
                path: 'add-website',
                element: <AddWebsiteDashboard></AddWebsiteDashboard>
            }
        ]
    },
    // {
    //     path: 'dashboard',
    //     element: <PrivateRoutes><Dashboard></Dashboard></PrivateRoutes>,
    //     children: [

    //         // admin role 
    //         {
    //             path: 'manageMenuItem',
    //             element: <AdminRoutes><ManageMenuItem></ManageMenuItem></AdminRoutes>
    //         },
    //         {
    //             path: 'updateMenuItem/:id',
    //             element: <AdminRoutes><UpdateMenuItem></UpdateMenuItem></AdminRoutes>,
    //             loader: ({ params }) => fetch(`https://zestora-restaurant-server.vercel.app/menu/${params.id}`)
    //         },
    //         {
    //             path: 'addDesh',
    //             element: <AdminRoutes><AddNewDesh></AddNewDesh></AdminRoutes>
    //         },
    //         {
    //             path: 'manageReservation',
    //             element: <AdminRoutes><ManageReservation></ManageReservation></AdminRoutes>
    //         },
    //         {
    //             path: 'viewOrder',
    //             element: <AdminRoutes><ViewOrder></ViewOrder></AdminRoutes>
    //         },
    //         {
    //             path: 'manageUser',
    //             element: <AdminRoutes><ManageUser></ManageUser></AdminRoutes>
    //         },

    //         // user role 
    //         {
    //             path: 'userCart',
    //             element: <PrivateRoutes><UsersCart></UsersCart></PrivateRoutes>
    //         },
    //         {
    //             path: 'userReservation',
    //             element: <PrivateRoutes><UserReservation></UserReservation></PrivateRoutes>
    //         }
    //     ]
    // }
])