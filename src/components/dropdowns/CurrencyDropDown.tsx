import { useEffect, useState } from 'react'
import "./CurrencyDropDown.css"

type CurrencyDropDownProps = {
    options: string[];
    toggleDropDown: Function;
    selectedOption: Function;
}

export const CurrencyDropDown = ({ options, selectedOption }: CurrencyDropDownProps) => {
    const onClickHandler = (option: string): void => {
        selectedOption(option);
    }

    return (
        <>
            <div className="currency-dropdown-box">
                {options.map(
                    (option: string, index: number): JSX.Element => {
                        return (
                            <div className="currency-dropdown-box-options"
                                key={index}
                                onClick={(): void => {
                                    onClickHandler(option)
                                }}
                            >
                                {option}
                            </div>
                        );
                    }
                )}
            </div>
        </>
    )
}