import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Reports from './Components/Reports/Reports';
import NoPage from './Components/NoPage';
import CollectionsListing from './Components/Collections/CollectionsListing';
import Settings from './Components/Settings/Settings';
import Displays from './Components/Displays';
import { SpinnerLoader } from './SpinnerLoader';

const router = createBrowserRouter([
  {
    path: "/",
    element: <CollectionsListing />,
  },

  {
    path: "/displays",
    element: <Displays />,
  },
  {
    path: "/reports",
    element: <Reports />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "*",
    element: <NoPage />,
  },

]);



const App = () => {
  return (
    <div>
    <SpinnerLoader />
    <RouterProvider router={router} />
  </div>
   
  );
}

export default App;
