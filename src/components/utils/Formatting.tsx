export const TruncateAddress = (address: string) => {
    if (!address) return "No Account";
    const match = address.match(
        /^(0x[a-zA-Z0-9]{3})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
    );
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
};

export const ColourNumbers = (num: number) => {
    if (num > 0) {
        return '#0FC421';
    }
    if (num < 0) {
        return '#C20000';
    }
    return '#000000';
}

export const ColourCategories = (category: string) => {
    if (category === "Defi") { return "#2100E9" }
    if (category === "Governance") { return "#2EB100" }
    if (category === "Web3 Gaming") { return "#FF0000" }
    if (category === "BSC Index Top 10") { return "#0094E8" }
    if (category === "Metaverse") { return "#E5008A" }
    return "#000000"
}