export const formatTo12HourIST = (time) => {
    if (!time || time === "closed") return "Closed";
  
    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + 330; // Add 5 hours 30 minutes (IST offset)
    const adjustedHours = Math.floor(totalMinutes / 60) % 24;
    const adjustedMinutes = totalMinutes % 60;
  
    const period = adjustedHours >= 12 ? "PM" : "AM";
    const displayHours = adjustedHours % 12 || 12;
  
    return `${displayHours}:${adjustedMinutes.toString().padStart(2, "0")} ${period}`;
};

export const checkIfOpenToday = (salon) => {
    if (!salon || !salon.working_hours) return false;
  
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
    // Current date and time in IST
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const nowInIST = new Date(now.getTime() + (istOffset + now.getTimezoneOffset() * 60 * 1000));
  
    const todayInIST = daysOfWeek[nowInIST.getDay()];
  
    if (!salon.working_hours[todayInIST] || !salon.working_hours[todayInIST].isOpen) {
      return false;
    }
  
    // Current time in IST (in minutes)
    const currentHour = nowInIST.getHours();
    const currentMinute = nowInIST.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
    // Parse salon hours and adjust to IST
    const startTime = new Date(salon.working_hours[todayInIST].start); // 03:30 UTC
    const endTime = new Date(salon.working_hours[todayInIST].end);     // 10:30 UTC
  
    // Convert UTC to IST (add 5:30 hours)
    const istOffsetMinutes = 5.5 * 60; // 330 minutes
    const openingHour = startTime.getUTCHours();
    const openingMinute = startTime.getUTCMinutes();
    const openingTimeInMinutes = (openingHour * 60 + openingMinute) + istOffsetMinutes; // 210 + 330 = 540 (9:00 IST)
  
    const closingHour = endTime.getUTCHours();
    const closingMinute = endTime.getUTCMinutes();
    const closingTimeInMinutes = (closingHour * 60 + closingMinute) + istOffsetMinutes; // 630 + 330 = 960 (16:00 IST)
  
    return currentTimeInMinutes >= openingTimeInMinutes && currentTimeInMinutes < closingTimeInMinutes;
};