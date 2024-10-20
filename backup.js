const mysqlBackup = require('mysqldump');
const fs = require('fs');

const initBackup = async () => {

    const msInSecond = 1000;
    const msInMinute = 60 * msInSecond;
    const msInHour = 60 * msInMinute;
    const msInDay = 24 * msInHour;

    const desiredTimeInHoursInUTC = 18; // fill out your desired hour in UTC!
    const desiredTimeInMinutesInUTC = 30; // fill out your desired minutes in UTC!
    const desiredTimeInSecondsInUTC = 0; // fill out your desired seconds in UTC!

    const currentDate = new Date();

    const controlDate = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), desiredTimeInHoursInUTC, desiredTimeInMinutesInUTC, desiredTimeInSecondsInUTC);
    let desiredDate;

    if (currentDate.getTime() <= controlDate.getTime()) {
        desiredDate = controlDate;
    } else {
        desiredDate = new Date(controlDate.getTime() + msInDay);
    }

    const msDelta = desiredDate.getTime() - currentDate.getTime();
    console.log(`Backup will be created at ${desiredDate}`, `Delta in ms: ${msDelta}`);

    backup();
    setTimeout(setupInterval, msDelta);

    function setupInterval() {
        backup();

        setInterval(backup, msInDay);
    }

}

async function backup() {
    if (!fs.existsSync('backups')) {
        fs.mkdirSync('backups');
    }
    const dumpFile = 'backups/' + `${(new Date().toISOString())}.dump.sql`;

    mysqlBackup({
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        },
        dumpToFile: dumpFile,
    });
    console.log("Backup completed");
}

module.exports = initBackup;