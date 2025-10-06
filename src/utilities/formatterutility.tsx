export const formatterUtility = (amount: number, noSign=false) => {
    const sign = noSign ? "" : "₦";
    return `${sign}${amount.toLocaleString()}`
}