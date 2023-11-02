import React from 'react';
import Slider from 'react-slick';
import { Card } from '../components/card-default';
import { useWindowSize } from '@/hooks';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { StrategyCard } from '@/ui/components';

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

export const Carousel = ({ items, type }: ICarousel) => {
    const { breakpoints } = useWindowSize();

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
                        {items?.length
                            ? items.map((el, i) => (
                                  <StrategyCard key={`carousel-item-${i}-${el}`} {...el} />
                              ))
                            : [1, 2, 3, 4].map((el, i) => (
                                  <Card
                                      key={`carousel-item-${i}`}
                                      className="min-h-[350px]"
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
