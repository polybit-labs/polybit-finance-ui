export const FormatCurrency = (amount: number, currency: string, decimals: number) => {
    if (currency === ("USD" || "AUD")) {
        return `${currency} $${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    if (currency === "BNB") {
        return `${currency} ${parseFloat(amount.toString()).toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }
}