import NavBar from "../components/NavBar";
import Header from "./components/Header";
import RestaurantCart from "./components/RestaurantCart";
import SideBar from "./components/SideBar";

export default function SearchPage() {
  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SideBar />
        <div className="w-5/6">
          <RestaurantCart />
        </div>
      </div>
    </>
  );
}
