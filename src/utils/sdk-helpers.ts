import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { usdFormatter, nativeTokenFormatter } from './helpers';

export const NETWORK = process.env.REACT_APP_NETWORK ? process.env.REACT_APP_NETWORK : 'mainnet';

console.log('network is', NETWORK);

export const SDK_PARAMS = {
    network: NETWORK,
    test: process.env.REACT_APP_TEST ? true : false,
    providerRpc: process.env.REACT_APP_RPC,
    signer: new JsonRpcProvider(process.env.REACT_APP_RPC).getSigner(),
};

export const MAINNET_ASSET_MAPPINGS = new Map<string, string>([
    ['AAVE', '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9'],
    ['BAT', '0x0d8775f648430679a709e98d2b0cb6250d2887ef'],
    ['BUSD', '0x4Fabb145d64652a948d72533023f6E7A623C7C53'],
    ['DAI', '0x6B175474E89094C44Da98b954EedeAC495271d0F'],
    ['ENJ', '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c'],
    ['KNC', '0xdd974D5C2e2928deA5F71b9825b8b646686BD200'],
    ['LINK', '0x514910771AF9Ca656af840dff83E8264EcF986CA'],
    ['MANA', '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942'],
    ['MKR', '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2'],
    ['REN', '0x408e41876cCCDC0F92210600ef50372656052a38'],
    ['SNX', '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F'],
    ['SUSD', '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51'],
    ['TUSD', '0x0000000000085d4780B73119b644AE5ecd22b376'],
    ['UNI', '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'],
    ['USDC', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
    ['USDT', '0xdAC17F958D2ee523a2206206994597C13D831ec7'],
    ['WBTC', '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'],
    ['WETH', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'],
    ['YFI', '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e'],
    ['ZRX', '0xE41d2489571d322189246DaFA5ebDe1F4699F498'],
    ['Tricrypto2', '0xc4AD29ba4B3c580e6D59105FFf484999997675Ff'],
    ['ThreePool', '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490'],
    ['StethEth', '0x06325440D014e39736583c165C2963BA99fAf14E'],
    ['Steth', '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'],
    ['FraxUSDC', '0x3175Df0976dFA876431C2E9eE6Bc45b65d3473CC'],
    ['Frax3Crv', '0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B'],
    ['Frax', '0x853d955aCEf822Db058eb8505911ED77F175b99e'],
    ['BAL', '0xba100000625a3754423978a60c9317c58a424e3D'],
    ['CRV', '0xD533a949740bb3306d119CC777fa900bA034cd52'],
    ['CVX', '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B'],
    ['BADGER', '0x3472A5A71965499acd81997a54BBA8D852C6E53d'],
    ['LDO', '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32'],
    ['ALCX', '0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF'],
    ['Oneinch', '0x111111111117dC0aa78b770fA6A738034120C302'],
    ['yvTricrypto2', '0x8078198Fc424986ae89Ce4a910Fc109587b6aBF3'],
    ['yvThreePool', '0x84E13785B5a27879921D6F685f041421C7F482dA'],
    ['yvStethEth', '0x5B8C556B8b2a78696F0B9B830B3d67623122E270'],
    ['yvFraxUSDC', '0x1A5ebfF0E881Aec34837845e4D0EB430a1B4b737'],
    ['yvFrax3Crv', '0xb37094c1B5614Bd6EcE40AFb295C26F4377069d3'],
]);

export const flipAndLowerCase = (data: Map<string, string>): Map<string, string> =>
    new Map(Array.from(data, (entry) => [entry[1].toLowerCase(), entry[0]]));

export const REVERSE_MAINNET_ASSET_MAPPINGS = flipAndLowerCase(MAINNET_ASSET_MAPPINGS);

export const DECIMALS = new Map<string, number>([
    ['AAVE', 18],
    ['BAT', 18],
    ['BUSD', 18],
    ['DAI', 18],
    ['ENJ', 18],
    ['KNC', 18],
    ['LINK', 18],
    ['MANA', 18],
    ['MKR', 18],
    ['REN', 18],
    ['SNX', 18],
    ['SUSD', 18],
    ['TUSD', 18],
    ['UNI', 18],
    ['USDC', 6],
    ['USDT', 6],
    ['WBTC', 8],
    ['WETH', 18],
    ['YFI', 18],
    ['ZRX', 18],
    ['Tricrypto2', 18],
    ['ThreePool', 18],
    ['StethEth', 18],
    ['Steth', 18],
    ['FraxUSDC', 18],
    ['Frax3Crv', 18],
    ['Frax', 18],
    ['BAL', 18],
    ['CRV', 18],
    ['CVX', 18],
    ['BADGER', 18],
    ['LDO', 18],
    ['ALCX', 18],
    ['Oneinch', 18],
    ['yvTricrypto2', 18],
    ['yvThreePool', 18],
    ['yvStethEth', 18],
    ['yvFraxUSDC', 18],
    ['yvFrax3Crv', 18],
]);

export const bigNumberToUSD = (
    number: BigNumberish | undefined,
    decimals: number,
    dollarSign = true,
): string => {
    if (!number) {
        console.error('given invalid bignumber');
        return '$0';
    }
    const formatted = usdFormatter(false).format(
        parseFloat(ethers.utils.formatUnits(number, decimals)),
    );
    return dollarSign ? formatted : formatted.slice(1).replaceAll(',', '');
};

export const nativeAmountToUSD = (
    amount: BigNumber,
    decimals: number,
    assetUSDPrice: BigNumber,
): number => {
    return parseFloat(
        Number(
            ethers.utils.formatUnits(
                BigNumber.from(amount).mul(assetUSDPrice).div(ethers.utils.parseEther('1')),
                decimals,
            ),
        ).toFixed(2),
    );
};

export const bigNumberToNative = (number: BigNumber | undefined, asset: string): string => {
    if (!number) {
        console.error('given invalid bignumber');
        return '0';
    }

    let decimals =
        DECIMALS.get(REVERSE_MAINNET_ASSET_MAPPINGS.get(asset.toLowerCase()) || asset) || 18;

    return nativeTokenFormatter.format(parseFloat(ethers.utils.formatUnits(number, decimals)));
};

export const bigNumberToUnformattedString = (
    number: BigNumber | undefined,
    asset: string,
): string => {
    if (!number) {
        console.error('given invalid bignumber');
        return '0';
    }

    if (number.lt(10)) {
        number = BigNumber.from('0');
    }

    return ethers.utils.formatUnits(
        number,
        DECIMALS.get(REVERSE_MAINNET_ASSET_MAPPINGS.get(asset.toLowerCase()) || asset) || 18,
    );
};

export const unformattedStringToBigNumber = (
    number: string | undefined,
    asset: string,
): BigNumber => {
    if (!number) {
        console.error('given invalid number');
        return BigNumber.from('0');
    }

    try {
        return ethers.utils.parseUnits(
            number,
            DECIMALS.get(REVERSE_MAINNET_ASSET_MAPPINGS.get(asset.toLowerCase()) || asset) || 18,
        );
    } catch {
        return BigNumber.from('0');
    }
};

export const rayToPercent = (number: BigNumber): number => {
    return (
        number
            .div(
                BigNumber.from('10000000000000000000000'), // div by 10^22
            )
            .toNumber() / 1000
    ); // div by 10^3 to get percent
};

export const addDollarAmounts = (list: Array<string> | undefined, dollarSign = true) => {
    if (!list) return dollarSign ? `$0` : 0;
    const withoutDollarSign = list.map((el) => parseFloat(el.slice(1).replaceAll(',', '')));
    const sum = withoutDollarSign.reduce((partial, next) => partial + next, 0);
    return dollarSign ? `$${sum.toFixed(2).toString()}` : sum.toFixed(2);
};

export const calculateHealthFactorFromBalances = (
    borrowFactorTimesDebt: BigNumber,
    liquidationThresholdTimesCollateral: BigNumber,
) => {
    if (borrowFactorTimesDebt.lte(BigNumber.from('0'))) {
        return undefined;
    }
    return (
        liquidationThresholdTimesCollateral
            .mul(ethers.utils.parseEther('1'))
            // .div(BigNumber.from('10000'))
            .div(borrowFactorTimesDebt)
    );
};
