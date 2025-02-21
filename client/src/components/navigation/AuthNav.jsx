/* eslint-disable react/prop-types */
import UserAvatar from "../ui/Avatar";
import { Link } from "react-router-dom";
import UserMenu from "../dropdown/UserMenu";
import OpenShop from "../dropdown/OpenShop";
import { Heart } from "lucide-react";
import ShoppingCart from "@/components/cart/ShoppingCart";
import NotificationMenu from "../dropdown/NotificationMenu";

const AuthNav = ({ user }) => {
  console.log(user);
  return (
    <nav className="flex items-center gap-x-6">
      <Heart />
      <NotificationMenu />
      <ShoppingCart />
      {user.role === "customer" ? (
        <OpenShop />
      ) : (
        <Link to="/store">
          <UserAvatar avatar={user.storeAvatar} />
        </Link>
      )}
      <UserMenu user={user} />
    </nav>
  );
};

export default AuthNav;
