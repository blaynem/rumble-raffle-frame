import { useState, useEffect } from "react";
import { Popover } from "@headlessui/react";
import { usePreferences } from "../containers/preferences";
import EmojiEventsOutlinedIcon from "@mui/icons-material/ContrastOutlined";
import Link from "next/link";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Nav = () => {
  const { preferences, setDarkmode } = usePreferences();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(preferences?.darkMode);
  }, [preferences?.darkMode]);

  return (
    <div className={`${darkMode ? "dark" : "light"}`}>
      <Popover
        as="header"
        className={({ open }) =>
          classNames(
            open ? "fixed inset-0 z-40 overflow-y-auto" : "",
            "dark:bg-black bg-rumbleBgLight border-b-2 dark:border-rumbleNone border-rumbleOutline lg:static lg:overflow-y-visible"
          )
        }
      >
        <div className="max-w-full mx-auto flex items-center justify-between">
          <div className="flex">
            <p className="px-4 py-2 uppercase font-medium text-xl dark:text-rumbleNone text-rumbleOutline">
              <span className="dark:text-rumbleSecondary text-rumblePrimary">
                ((
              </span>
              Beta
              <span className="dark:text-rumbleSecondary text-rumblePrimary">
                ))
              </span>
            </p>
            <Link
              href="/"
              className="px-4 py-2 uppercase font-medium text-l hover:underline dark:text-rumbleNone text-rumbleOutline"
            >
              Home
            </Link>
            <Link
              href="/gameLogs"
              className="px-4 py-2 uppercase font-medium text-l hover:underline dark:text-rumbleNone text-rumbleOutline"
            >
              Past Games
            </Link>
          </div>
          <button onClick={setDarkmode} className="mr-6">
            <EmojiEventsOutlinedIcon className="dark:fill-rumbleBgLight fill-rumbleBgDark" />
          </button>
        </div>
      </Popover>
    </div>
  );
};

export default Nav;
