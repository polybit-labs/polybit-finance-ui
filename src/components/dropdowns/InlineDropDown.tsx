import { useEffect, useState } from 'react'
import "./InlineDropDown.css"

type InlineDropDownProps = {
    options: string[];
    showDropDown: boolean;
    toggleDropDown: Function;
    selectedOption: Function;
}

export const InlineDropDown = ({ options, selectedOption }: InlineDropDownProps) => {
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const onClickHandler = (option: string): void => {
        selectedOption(option);
    };

    useEffect(() => {
        setShowDropDown(showDropDown)
    }, [showDropDown])

    return (
        <>
            <div className="inline-dropdown-box">
                {options.map(
                    (option: string, index: number): JSX.Element => {
                        return (
                            <div className="inline-dropdown-box-options"
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