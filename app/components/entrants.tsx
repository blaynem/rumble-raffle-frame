import React from "react";
import { ClickToCopyPopper } from "./Popper";
import { PlayerType } from "@/RumbleRaffle/types";

const DisplayEntrant = ({ entrant }: { entrant: PlayerType }) => {
  return (
    <li
      className={`mr-6 mb-2 last:mb-0 dark:text-rumbleNone text-rumbleOutline text-base font-normal`}
      key={entrant.id}
    >
      <ClickToCopyPopper text={entrant.name} popperText={entrant.id} />
    </li>
  );
};

const Entrants = ({
  loading,
  entrants,
}: {
  loading?: boolean;
  entrants: PlayerType[];
}) => {
  return (
    <div className="mb-8 w-80 py-6 pl-6 border-2 dark:border-rumbleNone border-rumbleOutline">
      <div className="dark:text-rumbleSecondary text-rumblePrimary uppercase text-lg font-medium leading-7 mb-2">
        Entrants
      </div>
      <ul className="max-h-80 overflow-auto scrollbar-thin scrollbar-thumb-rumblePrimary scrollbar-track-rumbleBgLight">
        {entrants.length < 1 ? (
          <li className="mb-0 dark:text-rumbleNone text-rumbleOutline text-base font-normal">
            {loading ? "Loading.." : "No entrants yet."}
          </li>
        ) : (
          entrants.map((entrant) => (
            <DisplayEntrant key={entrant.id} entrant={entrant} />
          ))
        )}
      </ul>
    </div>
  );
};

export default Entrants;
