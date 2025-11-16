import "./App.css";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { itemLoader } from "./loaders/singleCardLoader";
import { useAdsLoader } from "./loaders/mainLoader";
import MainPage from "./pages/MainPage";
import Stats from "./pages/Stats";
import SingleCard from "./pages/SingleCardPage";
import { statsLoader } from "./loaders/statsLoader";

const routerProv = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/list" element={<MainPage />} loader={useAdsLoader} />
      <Route path="/item/:id" element={<SingleCard />} loader={itemLoader} />
      <Route path="/stats" loader={statsLoader} element={<Stats />} />
    </>
  )
);

export default function App() {
  return <RouterProvider router={routerProv}></RouterProvider>;
}
