export const GetTimeToUnlock = (timeToUnlock: number) => {
    if (timeToUnlock > 0) {
        const moment = require('moment');
        let now = moment().unix()
        let lockedUntil = moment.unix(now + timeToUnlock).local().format("D MMM YYYY hh:mm")
        return <div style={{ color: "#909090" }}>Locked until {lockedUntil}</div>
    }
    return "Unlocked"
}