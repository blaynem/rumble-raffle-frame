import { Activities } from "@prisma/client";
import {
  ActivitiesObjType,
  ActivityTypes,
} from "../../../../RumbleRaffle/types/index";
import { prisma } from "./client";

const convertKillCountToNum = (data: Activities): ActivityTypes => ({
  ...data,
  killCounts: data.killCounts.map((k) => k.toNumber()),
});

/**
 * Get all activities from the database.
 */
export const getAllActivities = async (): Promise<ActivitiesObjType> => {
  const pveData: ActivityTypes[] = (await prisma.activities.findMany({
    where: {
      environment: "PVE",
    },
  })).map(convertKillCountToNum);

  const pvpData: ActivityTypes[] = (await prisma.activities.findMany({
    where: {
      environment: "PVP",
    },
  })).map(convertKillCountToNum);

  const reviveData: ActivityTypes[] = (await prisma.activities.findMany({
    where: {
      environment: "REVIVE",
    },
  })).map(convertKillCountToNum);

  return {
    PVE: pveData,
    PVP: pvpData,
    REVIVE: reviveData,
  };
};
