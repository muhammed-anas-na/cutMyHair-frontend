
  
  const sampleServices= [
    { name: 'Hair Cut & Style', duration: 60, price: 85.00 },
    { name: 'Hair Color', duration: 120, price: 150.00 },
    { name: 'Highlights', duration: 90, price: 120.00 },
    { name: 'Deep Conditioning', duration: 30, price: 45.00 },
    { name: 'Keratin Treatment', duration: 180, price: 280.00 },
    { name: 'Manicure', duration: 45, price: 35.00 },
    { name: 'Pedicure', duration: 60, price: 45.00 },
    { name: 'Gel Nails', duration: 75, price: 55.00 },
    { name: 'Facial Treatment', duration: 90, price: 95.00 },
    { name: 'Eyebrow Threading', duration: 20, price: 25.00 },
    { name: 'Massage Therapy', duration: 60, price: 80.00 },
    { name: 'Makeup Application', duration: 45, price: 65.00 }
  ];
  
  const salonLocations = [
    'Downtown Salon',
    'Westside Beauty',
    'Uptown Studio',
    'Riverside Spa',
    'City Center Salon'
  ];
  
  const customerNames = [
    'Emma Johnson', 'Sophia Brown', 'Olivia Davis', 'Ava Wilson', 'Isabella Moore',
    'Mia Taylor', 'Charlotte Anderson', 'Amelia Thomas', 'Harper Jackson', 'Evelyn White',
    'Madison Harris', 'Elizabeth Martin', 'Sofia Thompson', 'Avery Garcia', 'Ella Martinez'
  ];
  
  const statuses= ['pending', 'confirmed', 'completed', 'cancelled'];
  
  function getRandomDate(daysBack = 30) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
    return date.toISOString().split('T')[0];
  }
  
  function getRandomTime() {
    const hours = Math.floor(Math.random() * 12) + 8; // 8 AM to 7 PM
    const minutes = Math.random() < 0.5 ? 0 : 30;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  function addMinutesToTime(time, minutes) {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  }
  
  function generateRandomServices(){
    const numServices = Math.floor(Math.random() * 3) + 1; // 1-3 services
    const selectedServices = [];
    
    for (let i = 0; i < numServices; i++) {
      const randomService = sampleServices[Math.floor(Math.random() * sampleServices.length)];
      if (!selectedServices.find(s => s.name === randomService.name)) {
        selectedServices.push(randomService);
      }
    }
    
    return selectedServices;
  }
  
  export function generateSampleBookings(count = 20){
    const bookings = [];
    
    for (let i = 0; i < count; i++) {
      const services = generateRandomServices();
      const totalDuration = services.reduce((sum, service) => sum + service.duration, 0);
      const totalAmount = services.reduce((sum, service) => sum + service.price, 0);
      const startTime = getRandomTime();
      const endTime = addMinutesToTime(startTime, totalDuration);
      
      const booking = {
        id: `booking-${i + 1}`,
        customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
        customerEmail: `${customerNames[Math.floor(Math.random() * customerNames.length)].toLowerCase().replace(' ', '.')}@email.com`,
        date: getRandomDate(),
        startTime,
        endTime,
        services,
        totalAmount,
        totalDuration,
        salonLocation: salonLocations[Math.floor(Math.random() * salonLocations.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)]
      };
      
      bookings.push(booking);
    }
    
    // Sort by date (most recent first)
    return bookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }