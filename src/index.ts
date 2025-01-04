import cron from 'node-cron';
import {sendMail} from "./utils/mail.ts";
import { fetchRelevantCompetitions } from "./fetch-relevant-competitions.ts";
import { formatMultipleCompetitions } from "./utils/format.ts";

cron.schedule(process.env.CRON ?? '0 0 2 * * *', main, { timezone: 'Europe/Zurich' });

function main() {
    fetchRelevantCompetitions().then((competitions) => {
        if (competitions.length === 0) {
            console.log('No upcoming competitions');
            return;
        }
        const formattedCompetitions = formatMultipleCompetitions(competitions);        
        sendMail("Upcoming Races", formattedCompetitions);
    })
    .catch(err => {
        console.error(err);
    });
}