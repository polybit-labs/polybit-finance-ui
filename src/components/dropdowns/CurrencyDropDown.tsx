import React, { useEffect, useState } from 'react';
import "./CurrencyDropDown.css"

type DropDownProps = {
    currencyFormats: string[];
    showDropDown: boolean;
    toggleDropDown: Function;
    currencyFormatSelection: Function;
};

const CurrencyDropDown: React.FC<DropDownProps> = ({
    currencyFormats,
    currencyFormatSelection,
}: DropDownProps): JSX.Element => {
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const onClickHandler = (currencyFormat: string): void => {
        currencyFormatSelection(currencyFormat);
    };

    useEffect(() => {
        setShowDropDown(showDropDown);
    }, [showDropDown]);

    return (
        <>
            <div className="currency-dropdown">
                {currencyFormats.map(
                    (currencyFormat: string, index: number): JSX.Element => {
                        return (
                            <p
                                key={index}
                                onClick={(): void => {
                                    onClickHandler(currencyFormat);
                                }}
                            >
                                {currencyFormat}
                            </p>
                        );
                    }
                )}
            </div>
        </>
    );
};

export default CurrencyDropDown;
