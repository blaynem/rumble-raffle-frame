import Link from "next/link";
import React from "react";

const minifyUuid = (uuid: string): string =>
  `${uuid.slice(0, 6)}...${uuid.slice(-6)}`;

const DisplayPastRooms = ({
  all_param_ids,
  selected_param_id,
}: {
  all_param_ids: string[];
  selected_param_id: string;
}) => {
  return (
    <div className="mb-8 w-80 py-6 pl-6 border-2 dark:border-rumbleNone border-rumbleOutline">
      <div className="dark:text-rumbleSecondary text-rumblePrimary uppercase text-lg font-medium leading-7 mb-2">
        View Different Games
      </div>
      <ul className="max-h-80 overflow-auto scrollbar-thin dark:scrollbar-thumb-rumbleSecondary scrollbar-thumb-rumblePrimary scrollbar-track-rumbleBgDark">
        {all_param_ids.map((paramId) => (
          <li
            className={`mr-6 mb-2 last:mb-0 dark:text-rumbleNone text-rumbleOutline text-base font-normal ${
              selected_param_id === paramId
                ? "dark:bg-rumbleNone/20 bg-rumbleTertiary/40"
                : ""
            }`}
            key={paramId}
          >
            <Link href={`/gameLogs?paramsId=${paramId}`}>
              {minifyUuid(paramId)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayPastRooms;
