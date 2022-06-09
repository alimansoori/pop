export default class MyDate {
    static dateDiff(date1: Date, date2: Date) {
        let t1 = date1.getTime();
        let t2 = date2.getTime();

        return Math.floor((t1-t2)/(24*3600*1000));
    }
}