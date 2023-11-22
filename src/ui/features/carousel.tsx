import React from 'react';
import Slider from 'react-slick';
import { Card } from '../components/card';
import { useWindowSize } from '@/hooks';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { StrategyCard } from '@/ui/components';
import { NETWORKS, getNetworkName } from '@/utils';

type ICarousel = {
    items?: any[];
    type?: 'strategies' | 'default';
};

const defaultStyle = `absolute top-1/2 -translate-y-1/2 h-full transition duration-150 rounded-sm hover:from-transparent hover:to-[rgb(200,200,200)] dark:hover:to-neutral-950 dark:hover:bg-neutral-800 min-w-[36px] flex items-center justify-center`;
function PrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
        <button className={`${defaultStyle} -left-[30px] hover:bg-gradient-to-l`} onClick={onClick}>
            <HiOutlineChevronLeft className="dark:text-neutral-400" />
        </button>
    );
}
function NextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
        <button
            className={`${defaultStyle} -right-[30px] hover:bg-gradient-to-r`}
            onClick={onClick}
        >
            <HiOutlineChevronRight className="dark:text-neutral-400" />
        </button>
    );
}

const defaultSettings = {
    dots: true,
    infinite: true,
    speed: 400,
};

export const Carousel = ({ items, type }: ICarousel) => {
    const { breakpoints, width } = useWindowSize();
    const network = getNetworkName();

    const renderStrategy = (address: string) => {
        if (NETWORKS[network]['strategies']) {
            return NETWORKS[network]['strategies'][address];
        } else {
            return {};
        }
    };

    const renderStrategyItems = () => {
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
        return (
            <div className="mt-2">
                <h2 className="text-[22px] 2xl:text-2xl dark:text-neutral-100">
                    Featured Strategies
                </h2>

                <div className="px-6">
                    <Slider {...settings}>
                        {items?.length
                            ? renderStrategyItems().map((el: any, i: number) => (
                                  <StrategyCard
                                      key={`carousel-item-${i}-${el}`}
                                      {...el}
                                      {...renderStrategy(el.assetAddress?.toLowerCase())}
                                  />
                              ))
                            : [1, 2, 3, 4, 5].map((el, i) => (
                                  <Card
                                      key={`carousel-item-${i}`}
                                      className="min-h-[225px]"
                                      loading={!items?.length}
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
