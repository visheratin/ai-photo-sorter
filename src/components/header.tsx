"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useTranslation } from "@/app/i18n/client";
import { Link } from "react-router-dom";

interface HeaderProps {
  lng: string;
}

const HeaderComponent = (props: HeaderProps) => {
  const { t } = useTranslation(props.lng, "header");
  return (
    <header className="sticky top-0 z-40 w-full border-b moving-gradient backdrop-blur">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link
            to={`/${props.lng}/`}
            className="mr-6 flex items-center space-x-2"
          >
            <span className="hidden font-bold sm:inline-block">
              Organize AI
            </span>
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to={`/${props.lng}/collections`}>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {t("collections")}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};
export default HeaderComponent;
