export const validateScheduleData = (formData, rounds) => {
    const errors = {};
    const requiredFields = {
        selectedCandidate: "Candidate is required",
        selectedPosition: "Position is required",
        selectedDate: "Date is required",
        startTime: "Start time is required",
        endTime: "End time is required",
    };

    Object.entries(requiredFields).forEach(([field, message]) => {
        if (!formData[field]) {
            errors[field] = message;
        }
    });

    if (rounds.length === 0 || !rounds.some(round => round.round && round.mode && round.dateTime)) {
        errors.rounds = "At least one round must be fully filled";
    }

    return errors;
};