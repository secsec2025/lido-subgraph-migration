import {Contract} from '../abi/AppRepo';


export const appRepoGetLatestForContractAddress = async (contractAddress: string, inputAddress: string, ctx: any, logEvent: any) => {
    const contract = new Contract(ctx, {height: logEvent.block.height}, contractAddress);
    return await contract.getLatestForContractAddress(inputAddress);
}