export const formatCompetition = (competitionData: any) => {
    const { competition, races } = competitionData;
    let output = [];

    // Main Competition Details
    output.push('📍 COMPETITION DETAILS');
    output.push('────────────────────────');
    output.push(`Location: ${competition.location}, ${competition.country}`);
    output.push(`Date: ${competition.date}`);
    output.push(`Category: ${competition.category}`);
    output.push(`Discipline: ${competition.discipline.join(', ')}\n`);

    // Races Section
    races.forEach((race: any) => {
        output.push(`🏁 RACE DETAILS (${race.gender})`);
        output.push('────────────────────────');
        output.push(`Date: ${new Date(race.date).toLocaleString()}`);
        output.push(`Discipline: ${race.discipline}`);
        
        // Runs Section
        output.push('\n⏱️  SCHEDULED RUNS');
        race.runs.forEach((run: any) => {
            output.push(`   Run ${run.number}`);
            output.push(`   • Start Time: ${run.time}`);
            output.push(`   • Status: ${run.status}`);
            if (run.info) {
                output.push(`   • Info: ${run.info}`);
            }
            output.push('');  // Add spacing between runs
        });

        // Live Timing Information
        if (race.has_live_timing) {
            output.push('📺 LIVE TIMING');
            output.push('────────────────────────');
            output.push(`Follow live at: ${race.live_timing_url}\n`);
        }

        output.push(''); // Add spacing between races
    });

    return output.join('\n');
}

export const formatMultipleCompetitions = (competitions: any[]) => {
    let output = [];
    
    // Header
    output.push('🎿 FIS COMPETITIONS UPDATE');
    output.push('═══════════════════════════');
    output.push(`${new Date().toLocaleDateString()} - ${competitions.length} Events\n`);

    // Group competitions by date
    const groupedCompetitions = competitions.reduce((acc: any, comp: any) => {
        const date = comp.competition.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(comp);
        return acc;
    }, {});

    // Format each day's competitions
    Object.entries(groupedCompetitions).forEach(([date, comps]: [string, any]) => {
        output.push(`📅 ${date.toUpperCase()}`);
        output.push('═══════════════════════════\n');

        comps.forEach((comp: any, index: number) => {
            output.push(formatCompetition(comp));
            
            // Add separator between competitions if not the last one
            if (index < comps.length - 1) {
                output.push('\n⚡ ───────────────────── ⚡\n');
            }
        });

        // Add spacing between days
        output.push('\n\n');
    });

    // Footer
    output.push('───────────────────────────────────────────');
    output.push('End of FIS Competitions Update');
    output.push(`Generated: ${new Date().toLocaleString()}`);

    return output.join('\n');
}