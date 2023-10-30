import React from 'react';
import Slider from 'react-slick';
import { Card } from './cards';
import { useWindowSize } from '@/hooks';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { StrategyCard } from '../features';

type ICarousel = {
    items?: any[];
    type?: 'strategies' | 'default';
};

const defaultStyle = `absolute top-1/2 -translate-y-1/2 h-full transition duration-150 rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-800 min-w-[25px] flex items-center justify-center`;
function PrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
        <button className={`${defaultStyle} -left-[30px]`} onClick={onClick}>
            <HiOutlineChevronLeft className="dark:text-neutral-400" />
        </button>
    );
}
function NextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
        <button className={`${defaultStyle} -right-[30px]`} onClick={onClick}>
            <HiOutlineChevronRight className="dark:text-neutral-400" />
        </button>
    );
}

const defaultSettings = {
    dots: true,
    infinite: true,
    speed: 400,
};

const hardcodedStrategies: { [key: string]: { token0: string; token1: string; name: string } } = {
    '0xf04458f7B21265b80FC340dE7Ee598e24485c5bB': {
        name: 'sAMMV2-USDC/LUSD',
        token0: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        token1: '0xc40F949F8a4e094D1b49a23ea9241D289B7b2819',
    },
    '0x6387765ffa609ab9a1da1b16c455548bfed7cbea': {
        name: 'vAMMV2-WETH/LUSD',
        token0: '0x4200000000000000000000000000000000000006',
        token1: '0xc40F949F8a4e094D1b49a23ea9241D289B7b2819',
    },
    '0x6d5ba400640226e24b50214d2bbb3d4db8e6e15a': {
        name: 'sAMMV2-USDC/sUSD',
        token0: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        token1: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
    },
    '0x19715771e30c93915a5bbda134d782b81a820076': {
        name: 'sAMMV2-USDC/DAI',
        token0: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        token1: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    },
    '0x6da98bde0068d10ddd11b468b197ea97d96f96bc': {
        name: 'vAMMV2-wstETH/WETH',
        token0: '0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb',
        token1: '0x4200000000000000000000000000000000000006',
    },
    '0x0493bf8b6dbb159ce2db2e0e8403e753abd1235b': {
        name: 'vAMMV2-WETH/USDC',
        token0: '0x4200000000000000000000000000000000000006',
        token1: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    },
};

export const Carousel = ({ items, type }: ICarousel) => {
    const { breakpoints } = useWindowSize();

    const supportedItems = items?.filter(
        (x) => !!hardcodedStrategies[x.assetAddress.toLowerCase()],
    );
    console.log('supportedItems', supportedItems);

    const settings = {
        ...defaultSettings,
        slidesToShow: 4,
        slidesToScroll: 4,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        swipe: false,
        responsive: [
            {
                breakpoint: breakpoints['2xl'],
                settings: {
                    ...defaultSettings,
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: breakpoints.lg,
                settings: {
                    ...defaultSettings,
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: breakpoints.sm,
                settings: {
                    ...defaultSettings,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    if (type === 'strategies') {
        return (
            <div className="mt-2">
                <h2 className="text-2xl dark:text-neutral-100">Featured Strategies</h2>

                <div className="px-6 lg:px-8">
                    <Slider {...settings}>
                        {supportedItems?.length
                            ? supportedItems.map((el, i) => (
                                  <StrategyCard
                                      key={`carousel-item-${i}-${el}`}
                                      {...el}
                                      {...hardcodedStrategies[el.assetAddress.toLowerCase()]}
                                  />
                              ))
                            : [1, 2, 3, 4].map((el, i) => (
                                  <Card
                                      key={`carousel-item-${i}`}
                                      className="min-h-[350px]"
                                      loading={!supportedItems?.length}
                                  >
                                      {'Loading'}
                                  </Card>
                              ))}
                    </Slider>
                </div>
            </div>
        );
    }
    return (
        <div className="px-6 lg:px-8">
            <Slider {...settings}>
                {items?.length
                    ? items.map((el, i) => <Card key={`carousel-item-${i}`}>{i}</Card>)
                    : [1, 2, 3, 4].map((el, i) => <Card key={`carousel-item-${i}`}>{i}</Card>)}
            </Slider>
        </div>
    );
};
