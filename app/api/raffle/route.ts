import { RoomDataFetchType } from "@/app/components/displayRoom";
import {
  getAllParamIdsFromSlug,
  getGameLogByParamsId,
} from "../utils/database/rooms";
import { NextRequest, NextResponse } from "next/server";

export type GetAllGameLogsForSlug = {
  allParamIds: string[];
  latestGame: RoomDataFetchType;
} | { error: string };

export async function GET(
  req: NextRequest,
): Promise<NextResponse<GetAllGameLogsForSlug>> {
  try {
    const slug = req.nextUrl.searchParams.get("slug");
    const paramId = await getAllParamIdsFromSlug(slug!);
    if ("error" in paramId) {
      throw new Error("There are no rooms matching this slug: " + slug);
    }
    // Get the last
    const latestResult = await getGameLogByParamsId(paramId.data[0]);
    if ("error" in latestResult) {
      throw new Error(
        `Couldn't find latest game state for slug: ${slug}, paramId: ${
          paramId.data[0]
        }`,
      );
    }
    return NextResponse.json({
      allParamIds: paramId.data,
      latestGame: latestResult.data,
    });
  } catch (e) {
    console.error("Fetching all game state from slug error: ", e);
    return NextResponse.json({
      error: "There was an error fetching the game state.",
    }, { status: 404 });
  }
}
