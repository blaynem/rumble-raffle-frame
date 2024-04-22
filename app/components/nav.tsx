import { useState, useEffect } from "react";
import { Menu, Popover } from "@headlessui/react";
import { usePreferences } from "../containers/preferences";
import EmojiEventsOutlinedIcon from "@mui/icons-material/ContrastOutlined";

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
        {({ open }) => (
          <>
            <div className="max-w-full mx-auto flex items-center justify-between">
              <p className="px-4 py-2 uppercase font-medium text-xl dark:text-rumbleNone text-rumbleOutline">
                <span className="dark:text-rumbleSecondary text-rumblePrimary">
                  ((
                </span>
                Beta
                <span className="dark:text-rumbleSecondary text-rumblePrimary">
                  ))
                </span>
              </p>
              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <div>
                  <button onClick={setDarkmode} className="mr-6">
                    <EmojiEventsOutlinedIcon className="dark:fill-rumbleBgLight fill-rumbleBgDark" />
                  </button>
                  {/* <Menu.Button className="dark:bg-rumbleSecondary bg-rumblePrimary text-rumbleNone border-l-2 dark:border-rumbleNone border-rumbleOutline px-6 py-4 focus:outline-none focus:ring-2 focus:ring-rumbleSecondary">
                    <span className="sr-only">Open user menu</span>
                    <WalletConnector />
                  </Menu.Button> */}
                </div>
              </Menu>
            </div>
          </>
        )}
      </Popover>
    </div>
  );
};

export default Nav;
