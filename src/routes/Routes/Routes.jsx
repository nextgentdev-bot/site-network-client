import { createBrowserRouter } from "react-router-dom";
import Main from "../../layout/Main";



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
                path: 'menu',
                element: <Menu></Menu>
            },
            {
                path: 'signIn',
                element: <SignIn></SignIn>
            },
            {
                path: 'signUp',
                element: <SignUp></SignUp>
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