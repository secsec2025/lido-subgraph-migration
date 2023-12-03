import {Contract as LidoContract} from '../abi/Lido';

export const getTotalPooledEtherFromLidoContract = async (contractAddress: string, ctx: any, logEvent: any): Promise<bigint> => {
    const contract = new LidoContract(ctx, {height: logEvent.block.height}, contractAddress);
    return await contract.getTotalPooledEther();
}