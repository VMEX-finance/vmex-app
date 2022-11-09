import React from 'react';
import { IoIosClose } from 'react-icons/io';
import { AssetDisplay } from '../displays';
import { BasicToggle } from '../toggles';

export interface IListInput {
    coin?: boolean;
    list?: string[];
    setList?: any;
    placeholder?: string;
    title?: string;
    toggle?: boolean;
}

export const ListInput = ({ coin, list, setList, placeholder, title, toggle }: IListInput) => {
    const [value, setValue] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);

    const handleType = (e: any) => {
        e.preventDefault();
        if (e.key === 'Enter') {
            const shallow = list && list.length !== 0 ? [...list] : [];
            shallow.push(value);
            console.log(shallow);
            setList(shallow);
            setValue('');
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            setValue(value.slice(0, -1));
        } else if (e.key.length === 1) {
            setValue(value + e.key);
        }
    };

    const removeFromList = (itemToRemove: any) => {
        if (list && list.length > 0) {
            const shallow = [...list];
            shallow.map((el, i) => {
                if (el === itemToRemove) {
                    shallow.splice(i, 1);
                }
            });
            setList(shallow);
        }
    };

    const turnOff = () => {
        setList([]);
        setIsOpen(!isOpen);
    };
    // TODO: implement dropdown for available coins
    return (
        <>
            <div className="flex justify-between items-end">
                <h3 className="mt-6 mb-1 text-gray-400">{title}</h3>
                {toggle && <BasicToggle checked={isOpen} onChange={turnOff} />}
            </div>
            {!toggle && !isOpen ? (
                <div className="w-full flex flex-col justify-between mt-1 rounded-xl border border-gray-300 p-2">
                    <div className="flex flex-col justify-between gap-3">
                        <input
                            type="text"
                            value={value}
                            className="text-2xl focus:outline-none"
                            placeholder={placeholder}
                            onKeyDown={handleType}
                        />
                        <div className="flex gap-2 flex-wrap min-h-[26.3px]">
                            {list?.map((el, i: number) => (
                                <div
                                    key={i}
                                    onClick={(e) => removeFromList(el)}
                                    className="border border-black pl-4 pr-2 rounded-md flex items-center gap-2 cursor-pointer"
                                >
                                    {coin ? (
                                        <AssetDisplay
                                            name={el}
                                            size="sm"
                                            className="max-h-[26.28px]"
                                        />
                                    ) : (
                                        <span>{el}</span>
                                    )}
                                    <IoIosClose className="w-6 h-6" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                isOpen && (
                    <div className="w-full flex flex-col justify-between mt-1 rounded-xl border border-gray-300 p-2">
                        <div className="flex flex-col justify-between gap-3">
                            <input
                                type="text"
                                value={value}
                                className="text-2xl focus:outline-none"
                                placeholder={placeholder}
                                onKeyDown={handleType}
                            />
                            <div className="flex gap-2 flex-wrap min-h-[26.3px]">
                                {list?.map((el, i: number) => (
                                    <div
                                        key={i}
                                        onClick={(e) => removeFromList(el)}
                                        className="border border-black pl-4 pr-2 rounded-md flex items-center gap-2 cursor-pointer"
                                    >
                                        {coin ? (
                                            <AssetDisplay
                                                name={el}
                                                size="sm"
                                                className="max-h-[26.28px]"
                                            />
                                        ) : (
                                            <span>{el}</span>
                                        )}
                                        <IoIosClose className="w-6 h-6" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            )}
        </>
    );
};
