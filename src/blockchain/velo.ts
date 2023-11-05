import { Signer, ethers } from 'ethers';
import { NETWORKS } from '../utils/network';
import { VeloRouterABI } from '@/utils/abis/VeloRouter';

// function zapIn(
//     address tokenIn,
//     uint256 amountInA,
//     uint256 amountInB,
//     Zap calldata zapInPool,
//     Route[] calldata routesA,
//     Route[] calldata routesB,
//     address to,
//     bool stake
// )

// IRouter.Zap memory zap = IRouter.Zap({
//     tokenA: params.token0,
//     tokenB: params.token1,
//     stable: params.stable,
//     factory: address(veloFactory),
//     amountOutMinA: 1,
//     amountOutMinB: 1,
//     amountAMin: 1,
//     amountBMin: 1
// });

// export const zapIn = (signer: Signer, chainName: string, tokenIn: string, supplyAmount) => {
//     const chainConfig = NETWORKS[chainName];
//     if (!chainConfig?.veloRouterAddress) {
//         throw new Error(`Velo doesnt exist on chain ${chainName}`);
//     }

//     const router = new ethers.Contract(chainConfig.veloRouterAddress, VeloRouterABI, signer);

//     return router.zapIn(tokenIn, supplyAmount.div(2), supplyAmount.div(2));
// };
