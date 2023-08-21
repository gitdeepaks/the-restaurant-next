import NavBar from "@/app/components/NavBar";
import Header from "@/app/reserve/[slug]/components/Header";
import RestaurantNavBar from "../components/RestaurantNavBar";
import RestaurantMenu from "../components/RestaurantMenu";

export default function RestaurantMenuPage() {
  return (
    <>
      <div className="bg-white w-[100%] rounded p-3 shadow">
        <RestaurantNavBar />
        <RestaurantMenu />
      </div>
    </>
  );
}
