import { BigNumber, constants, utils } from 'ethers';

type TUnknowValueType =
    | {
          error: Error;
          result?: undefined;
          status: 'failure';
      }
    | {
          error?: undefined;
          result: unknown;
          status: 'success';
      };
export function decodeAsBigInt(value: TUnknowValueType, defaultValue = BigNumber.from(0)) {
    if (!value?.status || value.status === 'failure') {
        return defaultValue;
    }
    try {
        if (typeof value.result !== 'bigint') {
            return defaultValue;
        }
        return BigInt(value.result);
    } catch (error) {
        return defaultValue;
    }
}

export function decodeAsString(value: TUnknowValueType, defaultValue = ''): string {
    if (!value?.status || value.status === 'failure') {
        return defaultValue;
    }
    try {
        if (typeof value.result !== 'string') {
            return defaultValue;
        }
        return value.result;
    } catch (error) {
        return defaultValue;
    }
}

export function decodeAsAddress(value: TUnknowValueType, defaultValue = constants.AddressZero) {
    if (!value?.status || value.status === 'failure') {
        return defaultValue;
    }
    try {
        if (typeof value.result !== 'string') {
            return defaultValue;
        }
        return utils.getAddress(value.result);
    } catch (error) {
        return defaultValue;
    }
}

export function decodeAsNumber(value: TUnknowValueType, defaultValue = 0): number {
    if (!value?.status || value.status === 'failure') {
        return defaultValue;
    }
    try {
        if (typeof value.result !== 'number') {
            return defaultValue;
        }
        return value.result;
    } catch (error) {
        return defaultValue;
    }
}

export function decodeAsBoolean(value: TUnknowValueType, defaultValue = false): boolean {
    if (!value?.status || value.status === 'failure') {
        return defaultValue;
    }
    try {
        if (typeof value.result !== 'boolean') {
            return defaultValue;
        }
        return value.result;
    } catch (error) {
        return defaultValue;
    }
}
