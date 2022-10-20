export const truncateAddress = (address: string) => {
    if (!address) return "No Account";
    const match = address.match(
        /^(0x[a-zA-Z0-9]{3})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
    );
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
};

export const getNumValueColor = (num: number) => {
    if (num > 0) {
        return '#0FC421';
    }
    if (num < 0) {
        return '#C20000';
    }
    return '#000000';
}