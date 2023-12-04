import {Contract as LidoContract} from '../abi/Lido';
import {Contract as NodeOperatorsRegistryContract} from '../abi/NodeOperatorsRegistry';
import {Contract as StakingRouterContract} from '../abi/StakingRouter';

export const getTotalPooledEtherFromLidoContract = async (contractAddress: string, ctx: any, logEvent: any): Promise<bigint> => {
    const contract = new LidoContract(ctx, {height: logEvent.block.height}, contractAddress);
    return await contract.getTotalPooledEther();
}

export const getRewardsDistributionFromNodeOperatorsRegistryContract = async (contractAddress: string, ctx: any, logEvent: any, sharesToOperators: bigint) => {
    const contract = new NodeOperatorsRegistryContract(ctx, {height: logEvent.block.height}, contractAddress);
    return await contract.getRewardsDistribution(sharesToOperators);
}

export const getStakingRouterModules = async (contractAddress: string, ctx: any, logEvent: any) => {
    const contract = new StakingRouterContract(ctx, {height: logEvent.block.height}, contractAddress);
    return await contract.getStakingModules();
}