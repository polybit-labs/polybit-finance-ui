import { useEffect, useState } from 'react'
import "./CurrencyDropDown.css"

type CurrencyDropDownProps = {
    options: string[];
    showDropDown: boolean;
    toggleDropDown: Function;
    selectedOption: Function;
}

export const CurrencyDropDown = ({ options, selectedOption }: CurrencyDropDownProps) => {
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const onClickHandler = (option: string): void => {
        selectedOption(option);
    };

    useEffect(() => {
        setShowDropDown(showDropDown)
    }, [showDropDown])

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