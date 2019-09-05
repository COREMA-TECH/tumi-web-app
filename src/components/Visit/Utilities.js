import moment from 'moment';

export const OP_MANAGER_ROL_ID = 3; // Rol id from Operation Manager

export const getUrlMap = (latitude, longitude) => `https://www.google.com/maps/embed/v1/place?key=AIzaSyBC2IjBT-AA9frz0ZHpfo8IxzFQ0LlIEhA&q=${latitude},${longitude}`;

export const getDefaultTime = () => moment(new Date(), 'MM/DD/YYYY HH:mm:ss').set({hour:0,minute:0,second:0,millisecond:0});

export const getTime = (time) => moment(time, 'MM/DD/YYYY HH:mm:ss');

export const durationToTime = (startTime,days,hours,minutes,seconds) => {
    return moment(startTime || new Date(), 'MM/DD/YYYY HH:mm:ss').add(days, 'days')
        .set({
            hour:hours,
            minute:minutes,
            second:seconds,
            millisecond:0
        });
}