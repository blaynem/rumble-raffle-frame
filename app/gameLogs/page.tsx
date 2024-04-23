import GameLogs from "./index";
import { BASE_WEB_URL } from "../api/constants";
import { GetAllGameLogsForSlug } from "../api/raffle/route";
import { RoomDataFetchType } from "./displayRoom";

const fetchCurrentRaffleData = async ({
  slug,
  paramsId,
}: {
  slug: string;
  paramsId: string | null;
}): Promise<GetAllGameLogsForSlug> => {
  const fetchUrl = new URL(`${BASE_WEB_URL}/api/raffle`);
  fetchUrl.searchParams.append("slug", slug);
  if (paramsId) {
    fetchUrl.searchParams.append("paramId", paramsId);
  }

  const raffleFetchData = await fetch(fetchUrl);
  const data = (await raffleFetchData.json()) as GetAllGameLogsForSlug;

  return data;
};

export default async function PageIndex({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const paramsId = searchParams["paramsId"];
  const res = await fetchCurrentRaffleData({ slug: "default", paramsId });
  let latestGame: RoomDataFetchType | null = null;
  let allParamIds: string[] = [];
  if ("error" in res) {
    latestGame = null;
    allParamIds = [];
  } else {
    latestGame = res.latestGame;
    allParamIds = res.allParamIds;
  }

  return <GameLogs allParamIds={allParamIds} roomData={latestGame} />;
}
