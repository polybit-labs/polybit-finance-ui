import React, { useEffect, useState } from 'react';
import "./DateTypeDropDown.css"
type DropDownProps = {
    dateFormats: string[];
    showDropDown: boolean;
    toggleDropDown: Function;
    dateFormatSelection: Function;
};

const DateTypeDropDown: React.FC<DropDownProps> = ({
    dateFormats,
    dateFormatSelection,
}: DropDownProps): JSX.Element => {
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const onClickHandler = (dateFormat: string): void => {
        dateFormatSelection(dateFormat);
    };

    useEffect(() => {
        setShowDropDown(showDropDown);
    }, [showDropDown]);

    return (
        <>
            <div className="dropdown">
                {dateFormats.map(
                    (dateFormat: string, index: number): JSX.Element => {
                        return (
                            <p
                                key={index}
                                onClick={(): void => {
                                    onClickHandler(dateFormat);
                                }}
                            >
                                {dateFormat}
                            </p>
                        );
                    }
                )}
            </div>
        </>
    );
};

export default DateTypeDropDown;
