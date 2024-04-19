/**
 * Pinata API Docs:
 * https://docs.pinata.cloud/farcaster/hub-api-reference/
 */

/**
 * VerificationByFIDMessage
 */
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

export const getVerificationsByFID = async (
  fid: number,
): Promise<VerificationByFIDMessage["data"]["verificationAddAddressBody"]> => {
  const res = await fetch(
    `https://hub.pinata.cloud/v1/verificationsByFid?fid=${fid}`,
  );
  const json = (await res.json()) as VerificationByFID;
  return json.messages[0].data.verificationAddAddressBody;
};

/**
 * Get the connected address for a users Farcaster ID (FID)
 * @param fid Farcaster ID
 * @returns The connected address
 */
export const getConnectedAddressForUser = async (
  fid: number,
): Promise<string> => {
  // TODO: We are hardcoding the address for now
  const data = await getVerificationsByFID(fid);
  return data.address;
};

type UsedDataByFID = {
  hash: string;
  hashScheme: string;
  signature: string;
  signatureScheme: string;
  signer: string;
  data: {
    type: string;
    fid: number;
    timestamp: number;
    network: string;
    userDataBody: {
      type: string;
      value: string;
    };
  };
};

/**
 * Gets the user data for a given FID
 *
 * @param fid Farcaster ID
 * @returns The user data
 */
export const getUsedDataByFID = async (fid: number): Promise<UsedDataByFID> => {
  const res = await fetch(
    `https://hub.pinata.cloud/v1/userDataByFid?user_data_type=USER_DATA_TYPE_USERNAME&fid=${fid}`,
  );
  return (await res.json()) as UsedDataByFID;
};

/**
 * Given a users FID, we return the username and address
 * @param fid Farcaster ID
 * @returns The user data
 */
export const getUserDataByFID = async (fid: number): Promise<{
  username: string;
  address: string;
}> => {
  const userData = await getUsedDataByFID(fid);
  const address = await getConnectedAddressForUser(fid);
  return { username: userData.data.userDataBody.value, address };
};
