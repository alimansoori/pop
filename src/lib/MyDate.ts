export default class MyDate {
    static dateDiff(date1: Date, date2: Date) {
        const t1 = date1.getTime();
        const t2 = date2.getTime();

        return Math.floor((t1-t2)/(24*3600*1000));
    }
}