import React from 'react';
import { useAppSelector } from '../redux';
import { ITokenData } from '../../store/token-data';
import _ from 'lodash';

function formatResponseData(data: any) {
    try {
        const formattedData = _.zipWith(
            data.tokens,
            data.balances,
            data.data['0'].debt,
            data.data['0'].income,
            data.data['1'].debt,
            data.data['1'].income,
            data.data['2'].debt,
            data.data['2'].income,
            (a, b, c, d, e, f, g, h) => {
                return {
                    [String(a)]: {
                        balance: b,
                        tranche_1: {
                            debt: c,
                            income: d,
                        },
                        tranche_2: {
                            debt: e,
                            income: f,
                        },
                        tranche_3: {
                            debt: g,
                            income: h,
                        },
                    },
                };
            },
        );

        console.log(formattedData);
        return formattedData;
    } catch (error) {
        console.log(error);
        return data;
    }
}

export function TokenData() {
    const { isLoading, error, error_msg, data }: ITokenData = useAppSelector<any>(
        (state) => (state as any).token_data,
    );
    if (!isLoading) {
        const formated_data = formatResponseData(data);

        return {
            isLoading,
            error,
            error_msg,
            formated_data,
        };
    } else
        return {
            isLoading,
            error,
            error_msg,
            data,
        };
}
