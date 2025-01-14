export const fetchRelevantCompetitions = async () => {
    const response = await fetch(process.env.API_BASE_URL + '/api/v1/competitions');
    const events = JSON.parse(await response.text());
    // Get current date and calculate date two days from now
    const currentDate = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(currentDate.getDate() + 2);

    // Set both dates to start of day for consistent comparison
    currentDate.setHours(0, 0, 0, 0);
    twoDaysFromNow.setHours(0, 0, 0, 0);

    // Filter events that are happening in the next two days
    const upcomingEvents = events.filter((event: any) => {
        const eventDate = parseEventDate(event.date);
        return eventDate.start <= twoDaysFromNow && eventDate.end >= currentDate;
    });

    const eventDetails = await Promise.all(upcomingEvents.map(async (event: any) => {
        const response = await fetch(process.env.API_BASE_URL + `/api/v1/competitions/${event.event_id}`);
        return JSON.parse(await response.text());
    }));

    // Filter events with non-training races happening in the next two days
    const upcomingEventsWithNonTrainingRaces = eventDetails.filter((event: any) => {
        // Get the detailed event info including races
        if (!event || !event.races) return false;

        // Check if there are any non-training races in the next two days
        return event.races.some((race: any) => {
            // Skip if it's a training race
            if (race.is_training) return false;

            // Convert race date to Date object
            const raceDate = new Date(race.date);
            
            // Set race date to start of day for consistent comparison
            raceDate.setHours(0, 0, 0, 0);
            
            // Check if race is within the date range
            return raceDate >= currentDate && raceDate <= twoDaysFromNow;
        });
    });

    const upcomingEventsWithFilteredRaces = upcomingEventsWithNonTrainingRaces.map((event: any) => {
        event.races = event.races.filter((race: any) => {
            const raceDate = new Date(race.date);
            return raceDate >= currentDate;
        });
        return event;
    });

    return upcomingEventsWithFilteredRaces;
}

const parseEventDate = (dateStr: any) => {
    if (!dateStr.includes('-')) {
        // Handle single date case
        const [day, month, year] = dateStr.split(' ');
        return {
            start: new Date(`${day} ${month} ${year}`),
            end: new Date(`${day} ${month} ${year}`)
        };
    }
    
    const parts = dateStr.split('-').map(d => d.trim());
    const startPart = parts[0];
    const endPart = parts[1];
    // Get all components from the full date (end part)
    const fullDateParts = endPart.split(' ');
    const endDay = fullDateParts[0];
    const month = fullDateParts[1];
    const year = fullDateParts[2];
    
    // Get the start day from the start part
    const startDateParts = startPart.split(' ');
    const startDay = startDateParts[0];
    // If end part includes month/year, use those; otherwise use from start part
    const startMonth = startDateParts[1] || month;
    const startYear = startDateParts[2] || year;
    
    return {
        start: new Date(`${startDay} ${startMonth} ${startYear}`),
        end: new Date(`${endDay} ${month} ${year}`)
    };
}
    