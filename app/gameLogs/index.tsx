"use client";
import RumbleRoom, { RoomDataFetchType } from "./displayRoom";
import Nav from "../components/nav";
import { PreferencesProvider } from "../containers/preferences";

export default function GameLogs({
  allParamIds,
  roomData,
}: {
  allParamIds: string[];
  roomData: RoomDataFetchType | null;
}) {
  return (
    <PreferencesProvider>
      <Nav />
      <RumbleRoom allParamIds={allParamIds} roomData={roomData} />
    </PreferencesProvider>
  );
}
