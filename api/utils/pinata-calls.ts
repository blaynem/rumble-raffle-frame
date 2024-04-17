import { BLAYNE_EVM_ADDRESS } from "../constants.js";

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

type UserNameProofsByFID = {
  proofs: {
    timestamp: number;
    name: string;
    owner: string;
    signature: string;
    fid: number;
    type: string;
  }[];
};

/**
 * Gets the username proofs for a given FID
 *
 * Note: We take the first proof for now.
 * @param fid Farcaster ID
 * @returns The username proofs
 */
export const getUserNameProofsByFID = async (fid: number) => {
  const res = await fetch(
    `https://hub.pinata.cloud/v1/userNameProofsByFid?fid=${fid}`,
  );
  const json = (await res.json()) as UserNameProofsByFID;
  return json.proofs[0];
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
  const proofs = await getUserNameProofsByFID(fid);
  const address = await getConnectedAddressForUser(fid);
  return { username: proofs.name, address };
};
