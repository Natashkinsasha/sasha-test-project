import * as functions from "firebase-functions";
import {Metaplex} from "@metaplex-foundation/js";
import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const verifyTokenAddress = functions.https.onRequest(async (request, response) => {
  const address = request.query.address;
  if (!address) {
    response.status(400).send("Bad Request");
    return;
  }
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const metaplex = new Metaplex(connection);
  const nftTask = await metaplex.nfts().findByMint({mintAddress: new PublicKey(address as string)});
  const nft = await nftTask.run();
  if (nft?.creators[0]?.verified) {
    response.send("Nft is verified!");
    return;
  }
  response.send("Nft is not verified!");
  return;
});


