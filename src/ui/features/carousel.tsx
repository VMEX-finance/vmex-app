import React from 'react';
import Slider from 'react-slick';
import { Card } from '../components/card';
import { useWindowSize } from '@/hooks';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { StrategyCard } from '@/ui/components';
import { NETWORKS, getNetworkName } from '@/utils';
import { useLoopData } from '@/api';
import { useAccount } from 'wagmi';

type ICarousel = {
    items?: any[];
    type?: 'strategies' | 'default';
};

const defaultStyle = `absolute top-1/2 -translate-y-1/2 h-full transition duration-150 rounded text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white from-transparent dark:via-[rgba(20,20,20,0.8)] dark:to-brand-background via-[rgba(234,234,234,0.8)] to-[rgb(234,234,234)] min-w-[36px] flex items-center justify-center z-50`;
function PrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
        <button className={`${defaultStyle} -left-[4px] bg-gradient-to-l`} onClick={onClick}>
            <HiOutlineChevronLeft size="24px" className="" />
        </button>
    );
}
function NextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
        <button className={`${defaultStyle} -right-[4px] bg-gradient-to-r`} onClick={onClick}>
            <HiOutlineChevronRight size="24px" className="" />
        </button>
    );
}

const defaultSettings = {
    dots: true,
    infinite: true,
    speed: 300,
};

export const Carousel = ({ items, type }: ICarousel) => {
    const { breakpoints, width } = useWindowSize();
    const { address } = useAccount();
    const { queryUserLooping } = useLoopData(address);
    const network = getNetworkName();

    const renderStrategy = (address: string) => {
        if (NETWORKS[network]['strategies']) {
            return NETWORKS[network]['strategies'][address];
        } else {
            return {};
        }
    };

    const renderStrategyItems = (userLoops?: any[]) => {
        if (NETWORKS[network]['strategies']) {
            const displayItems = items?.filter(
                (x) => !!NETWORKS[network]['strategies'][x.assetAddress.toLowerCase()],
            );
            // Remove duplicates
            const filteredArr = displayItems?.reduce((acc, current) => {
                const x = acc.find((item: any) => item.assetAddress === current.assetAddress);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);
            if (address) {
                const _userLoops = userLoops?.map((l: any) => l.depositAssetAddress.toLowerCase());
                if (_userLoops?.length) {
                    return filteredArr?.sort(
                        (a: any, b: any) =>
                            _userLoops.indexOf(b.assetAddress.toLowerCase()) -
                            _userLoops.indexOf(a.assetAddress.toLowerCase()),
                    );
                }
            }
            return filteredArr || [];
        } else {
            return items || [];
        }
    };

    const settings = {
        ...defaultSettings,
        slidesToShow: 5,
        slidesToScroll: 5,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        centerMode: true,
        swipe: false,
        responsive: [
            {
                breakpoint: breakpoints['2xl'],
                settings: {
                    ...defaultSettings,
                    slidesToShow: 4,
                    slidesToScroll: 4,
                },
            },
            {
                breakpoint: breakpoints['xl'],
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
        const { data, isLoading } = queryUserLooping;
        return (
            <div className="mt-2">
                <h2 className="text-[22px] 2xl:text-2xl dark:text-neutral-100">
                    Featured Strategies
                </h2>

                <Slider {...settings}>
                    {items?.length && !isLoading
                        ? renderStrategyItems(data)?.map((el: any, i: number) => (
                              <StrategyCard
                                  key={`carousel-item-${i}-${el}`}
                                  userLoops={address ? data : []}
                                  {...el}
                                  {...renderStrategy(el.assetAddress?.toLowerCase())}
                              />
                          ))
                        : [1, 2, 3, 4, 5]?.map((el, i) => (
                              <Card
                                  key={`carousel-item-${i}`}
                                  className="min-h-[225px]"
                                  loading={true}
                              >
                                  {'Loading'}
                              </Card>
                          ))}
                </Slider>
            </div>
        );
    }
    return (
        <div className="px-6 lg:px-8">
            <Slider {...settings}>
                {items?.length
                    ? items?.map((el, i) => <Card key={`carousel-item-${i}`}>{i}</Card>)
                    : [1, 2, 3, 4]?.map((el, i) => <Card key={`carousel-item-${i}`}>{i}</Card>)}
            </Slider>
        </div>
    );
};
