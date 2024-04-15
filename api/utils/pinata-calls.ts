type VerificationByFIDMessage = {
  data: {
    type: string;
    fid: number;
    timestamp: number;
    network: string;
    verificationAddAddressBody: {
      address: string;
      claimSignature: string;
      blockHash: string;
      verificationType: number;
      chainId: number;
      protocol: string;
      ethSignature: string;
    };
    verificationAddEthAddressBody: {
      address: string;
      claimSignature: string;
      blockHash: string;
      verificationType: number;
      chainId: number;
      protocol: string;
      ethSignature: string;
    };
  };
  hash: string;
  hashScheme: string;
  signature: string;
  signatureScheme: string;
  signer: string;
};

type VerificationByFID = {
  messages: VerificationByFIDMessage[];
  nextPageToken: string;
};

export const getVerificationAddressBodyForUser = async (
  fid: number
): Promise<VerificationByFIDMessage["data"]["verificationAddAddressBody"]> => {
  const res = await fetch(
    `https://hub.pinata.cloud/v1/verificationsByFid?fid=${fid}`
  );
  const json = (await res.json()) as VerificationByFID;
  return json.messages[0].data.verificationAddAddressBody;
};

/**
 * Get the connected address for a users Farcaster ID (FID)
 * @param fid
 * @returns
 */
export const getConnectedAddressForUser = async (
  fid: number
): Promise<string> => {
  // TODO: We are hardcoding the address for now
  return "0x6b5750f9E2C60AE6C6AcacB6558760BedAd2E761";
  const data = await getVerificationAddressBodyForUser(fid);
  return data.address;
};
