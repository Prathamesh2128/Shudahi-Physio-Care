import { Outlet } from "react-router-dom";
import SidebarComponent from "./SidebarComponent";
import FooterComponent from "./FooterComponent";

const MainLayoutComponent = () => {
  return (
    <div>
      <p>In MainLayoutComponent</p>
      <SidebarComponent />
      <div>
        <Headers />
        <main>
          <Outlet />
        </main>

        <FooterComponent />
      </div>
    </div>
  );
};

export default MainLayoutComponent;
