import { IAddress } from './wagmi';

export type INetworkContracts = {
    veloRouter: IAddress;
    veloFactory: IAddress;
    lendingPool: IAddress;
    leverageController: IAddress;
    dvmex: IAddress;
    vmex: IAddress;
    vevmex: IAddress;
    vmexRewards: IAddress;
    dvmexRewards: IAddress;
    gaugeFactory: IAddress;
    registry: IAddress;
    vmexWeth: IAddress;
    redemption: IAddress;
    vmexComputed: IAddress;
};
