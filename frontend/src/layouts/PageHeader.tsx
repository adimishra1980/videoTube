import { Link } from "react-router-dom";
import Logo from "../assets/Logo.jpg";
import { ArrowLeft, Bell, Menu, Mic, Search, Upload, User } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useState } from "react";

const PageHeader = () => {
  const [showFullWidthSearch, setShowFullWidthSeach] = useState(false);

  return (
    <div className="flex gap-10 lg:gap-20 justify-between pt-2 mb-6 mx-4">
      <div
        className={` gap-4 items-center flex-shrink-0 ${
          showFullWidthSearch ? "hidden" : "flex"
        } `}
      >
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
        <Link to="/">
          <img src={Logo} className=" h-6" />
        </Link>
      </div>

      <form
        className={` gap-4 flex-grow justify-center ${
          showFullWidthSearch ? "flex" : "md:flex hidden"
        } `}
      >
        {showFullWidthSearch && (
          <Button
            onClick={() => setShowFullWidthSeach(false)}
            type="button"
            size="icon"
            variant="ghost"
            className=" flex-shrink-0"
          >
            <ArrowLeft />
          </Button>
        )}
        <div className="flex flex-grow max-w-[600px]">
          <input
            type="search"
            placeholder="Search"
            className=" rounded-l-full border border-secondary-border shadow-inner shadow-secondary py-1 px-4 text-md w-full focus:border-blue-500 outline-none"
          />
          <Button className=" py-2 px-4 rounded-r-full border border-l-0 border-secondary-border flex-shrink-0">
            <Search />
          </Button>
        </div>
        <Button type="button" size="icon" className="flex-shrink-0">
          <Mic />
        </Button>
      </form>

      <div
        className={`flex-shrink-0 md:gap-2 justify-center ${
          showFullWidthSearch ? "hidden" : "flex"
        }`}
      >
        <Button
          size="icon"
          variant="ghost"
          className="md:hidden"
          onClick={() => setShowFullWidthSeach(true)}
        >
          <Search />
        </Button>

        <Button size="icon" variant="ghost" className="md:hidden">
          <Mic />
        </Button>

        <Button size="icon" variant="ghost">
          <Upload />
        </Button>

        <Button size="icon" variant="ghost">
          <Bell />
        </Button>

        <Button size="icon" variant="ghost">
          <User />
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
