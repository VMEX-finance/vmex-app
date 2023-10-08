import React from 'react';
import Slider from 'react-slick';
import { Card } from './cards';
import { useWindowSize } from '@/hooks';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { AssetDisplay, PillDisplay } from './displays';
import { capFirstLetter, findInObjArr, percentFormatter } from 'utils/helpers';
import { ModalTableDisplay } from '../modals';
import { Button } from './buttons';
import { useApyData } from '@/api';

type ICarousel = {
    items?: any[];
    type?: 'strategies' | 'default';
};

const defaultStyle = `absolute top-1/2 -translate-y-1/2 h-full transition duration-150 rounded-sm hover:bg-neutral-300 min-w-[25px] flex items-center justify-center`;
function PrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
        <button className={`${defaultStyle} -left-[30px]`} onClick={onClick}>
            <HiOutlineChevronLeft />
        </button>
    );
}
function NextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
        <button className={`${defaultStyle} -right-[30px]`} onClick={onClick}>
            <HiOutlineChevronRight />
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
    const { queryAssetApys } = useApyData();
    const collateralAssets = ['ETH', 'wstETH']; // TODO: get available assets to zap

    const settings = {
        ...defaultSettings,
        slidesToShow: 4,
        slidesToScroll: 4,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
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
                <h2 className="text-2xl">Featured Strategies</h2>

                <div className="px-6 lg:px-8">
                    <Slider {...settings}>
                        {items?.length
                            ? items.map((el, i) => {
                                  const rewardApy = findInObjArr(
                                      'symbol',
                                      el?.asset,
                                      queryAssetApys.data,
                                  );
                                  const { apysByToken, asset, assetType, name, symbol, totalApy } =
                                      rewardApy;
                                  return (
                                      <Card
                                          key={`carousel-item-${i}`}
                                          className="h-full flex flex-col justify-between"
                                      >
                                          <div>
                                              <div className="flex justify-between">
                                                  <AssetDisplay name={el?.asset || ''} />
                                                  <div className="flex flex-col items-end">
                                                      <span className="text-xs">Max APY</span>
                                                      <span className="font-medium">
                                                          {percentFormatter.format(el.supplyApy)}
                                                      </span>
                                                  </div>
                                              </div>
                                              <div>
                                                  <ModalTableDisplay
                                                      title="APY Breakdown"
                                                      content={apysByToken
                                                          .sort(
                                                              (a: any, b: any) =>
                                                                  a.symbol.length - b.symbol.length,
                                                          )
                                                          .map((x: any) => ({
                                                              label:
                                                                  x?.symbol?.length >= 5
                                                                      ? capFirstLetter(x?.symbol) ||
                                                                        x.asset
                                                                      : x?.symbol || x.asset,
                                                              value: percentFormatter.format(
                                                                  Number(x.apy) / 100,
                                                              ),
                                                          }))}
                                                      valueClass="text-right"
                                                      size="sm"
                                                  />
                                              </div>
                                              <div className="mt-3 2xl:mt-4 ">
                                                  <p className="text-xs leading-tight">
                                                      Open this strategy by providing any of the
                                                      assets as collateral:
                                                  </p>
                                                  <div className="flex gap-1 flex-wrap mt-1">
                                                      {collateralAssets.map((el, i) => (
                                                          <PillDisplay
                                                              type="asset"
                                                              asset={el}
                                                              key={`collateral-asset-${el}-${i}`}
                                                              size="sm"
                                                          />
                                                      ))}
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="mt-3 2xl:mt-4 flex w-full">
                                              <Button label="Supply" className="w-full" primary />
                                          </div>
                                      </Card>
                                  );
                              })
                            : [1, 2, 3, 4].map((el, i) => (
                                  <Card key={`carousel-item-${i}`}>{i}</Card>
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
