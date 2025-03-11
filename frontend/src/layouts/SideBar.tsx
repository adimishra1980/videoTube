import { Clapperboard, Home, Library, Repeat } from "lucide-react";
import { ElementType } from "react";
import { Link } from "react-router-dom";
import { buttonStyles } from "../components/ui/Button";
import { twMerge } from "tailwind-merge";

const SideBar = () => {
  return (
    <>
    <aside className=" sticky top-0 overflow-y-auto scrollbar-hidden pb-4 flex flex-col ml-1 lg:hidden">
      <SmallSideBarItem Icon={Home} title="Home" url="/" />
      <SmallSideBarItem Icon={Repeat} title="Shorts" url="/shorts" />
      <SmallSideBarItem Icon={Clapperboard} title="Subscriptions" url="/subscriptions" />
      <SmallSideBarItem Icon={Library} title="Library" url="/library" />
    </aside>

    <aside className="w-56">

    </aside>
    </>
    
  );
};

export default SideBar;

type SmallSideBarItemProps = {
  Icon: ElementType;
  title: string;
  url: string;
};

function SmallSideBarItem({ Icon, title, url }: SmallSideBarItemProps) {
  return (
    <Link to={url} className={twMerge(buttonStyles({variant: "ghost" }), "py-4 px-1 flex flex-col items-center rounded-lg gap-1")}>
      <Icon className="w-6 h-6" />
      <div className=" text-sm">{title}</div>
    </Link>
  );
}
