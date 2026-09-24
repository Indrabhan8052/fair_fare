// Sample seed data — ported directly from the original app's METRO.lucknow and
// PLACES.lucknow constants. Add more cities here (Delhi, Mumbai, etc.) using the
// same shape, copying the rest of the data out of the original script.js.

export const cities = [
  {
    cityId: 'lucknow',
    name: 'Lucknow',
    center: { lat: 26.8467, lng: 80.9462 },
    zoom: 12,
    busFarePerKm: 2,
    lines: [
      {
        id: 'L1',
        name: 'Line 1 (N-S Corridor)',
        color: '#e11d48',
        fare: [10, 15, 20, 30, 40],
        freq: 'Every 8–12 min',
        firstLast: '06:00 – 22:00',
        stations: [
          { id: 'CCS', name: 'CCS Airport', lat: 26.7606, lng: 80.8893 },
          { id: 'TRN', name: 'Transport Nagar', lat: 26.7789, lng: 80.8972 },
          { id: 'KRI', name: 'Krishnanagar', lat: 26.7922, lng: 80.9012 },
          { id: 'SGN', name: 'Singar Nagar', lat: 26.8009, lng: 80.9035 },
          { id: 'ABT', name: 'Alambagh Bus Terminal', lat: 26.8061, lng: 80.9054 },
          { id: 'ALM', name: 'Alambagh', lat: 26.8089, lng: 80.9142 },
          { id: 'MWY', name: 'Mawaiya', lat: 26.8185, lng: 80.9152 },
          { id: 'CHB', name: 'Charbagh', lat: 26.8375, lng: 80.9095 },
          { id: 'HGJ', name: 'Hussainganj', lat: 26.8443, lng: 80.9218 },
          { id: 'SCH', name: 'Sachivalaya', lat: 26.8468, lng: 80.9302 },
          { id: 'HZG', name: 'Hazratganj', lat: 26.8512, lng: 80.9440 },
          { id: 'VDH', name: 'Vidhansabha', lat: 26.8566, lng: 80.9494 },
          { id: 'KDS', name: 'KD Singh Babu Stadium', lat: 26.8585, lng: 80.9575 },
          { id: 'ITC', name: 'IT College', lat: 26.8612, lng: 80.9665 },
          { id: 'LKU', name: 'Lucknow University', lat: 26.8640, lng: 80.9752 },
          { id: 'BSN', name: 'Badhshah Nagar', lat: 26.8720, lng: 80.9824 },
          { id: 'LKM', name: 'Lekhraj Market', lat: 26.8810, lng: 80.9942 },
          { id: 'ING', name: 'Indira Nagar', lat: 26.8946, lng: 81.0042 },
          { id: 'BWR', name: 'Bhootnath Market', lat: 26.8820, lng: 81.0110 },
          { id: 'MNP', name: 'Munshipulia', lat: 26.8686, lng: 80.9974 },
        ],
      },
    ],
    places: [
      // Railway / bus / air
      { name: 'Charbagh Railway Station', category: 'Charbagh', lat: 26.8375, lng: 80.9095 },
      { name: 'Lucknow Junction (NR)', category: 'Charbagh', lat: 26.8396, lng: 80.9078 },
      { name: 'Aishbagh Railway Station', category: 'Aishbagh', lat: 26.8460, lng: 80.8980 },
      { name: 'Gomti Nagar Railway Station', category: 'Gomti Nagar', lat: 26.8480, lng: 81.0050 },
      { name: 'Alambagh Bus Terminal', category: 'Alambagh', lat: 26.8066, lng: 80.9054 },
      { name: 'Kaiserbagh Bus Stand', category: 'Kaiserbagh', lat: 26.8500, lng: 80.9380 },
      { name: 'Charbagh Bus Stand', category: 'Charbagh', lat: 26.8360, lng: 80.9110 },
      { name: 'Lucknow Airport (Amausi)', category: 'Amausi', lat: 26.7606, lng: 80.8893 },

      // Central Lucknow
      { name: 'Hazratganj', category: 'Central Lucknow', lat: 26.8512, lng: 80.9440 },
      { name: 'Aminabad', category: 'Old Lucknow', lat: 26.8518, lng: 80.9271 },
      { name: 'Husainganj', category: 'Central Lucknow', lat: 26.8430, lng: 80.9210 },
      { name: 'Lalbagh', category: 'Central Lucknow', lat: 26.8480, lng: 80.9350 },
      { name: 'Kaiserbagh', category: 'Central Lucknow', lat: 26.8500, lng: 80.9390 },
      { name: 'Chowk', category: 'Old Lucknow', lat: 26.8630, lng: 80.9080 },
      { name: 'Nakhas', category: 'Old Lucknow', lat: 26.8695, lng: 80.9070 },

      // Education / institutions
      { name: 'Polytechnic Chauraha', category: 'Aliganj', lat: 26.8788, lng: 80.9520 },
      { name: 'Lucknow University', category: 'University', lat: 26.8640, lng: 80.9752 },
      { name: 'IT Chauraha', category: 'Vidhansabha', lat: 26.8600, lng: 80.9650 },
      { name: 'KGMU (King George Medical University)', category: 'Chowk', lat: 26.8660, lng: 80.9210 },
      { name: 'IIM Lucknow', category: 'Prabandh Nagar', lat: 26.8460, lng: 81.0330 },
      { name: 'Amity University Lucknow', category: 'Malhaur', lat: 26.9250, lng: 81.0450 },

      // North / East Lucknow
      { name: 'Aliganj', category: 'Aliganj', lat: 26.8850, lng: 80.9450 },
      { name: 'Mahanagar', category: 'Mahanagar', lat: 26.8695, lng: 80.9530 },
      { name: 'Indira Nagar', category: 'Indira Nagar', lat: 26.8946, lng: 81.0042 },
      { name: 'Gomti Nagar', category: 'Gomti Nagar', lat: 26.8540, lng: 81.0100 },
      { name: 'Gomti Nagar Extension', category: 'Gomti Nagar Extension', lat: 26.8280, lng: 81.0400 },
      { name: 'Vibhuti Khand', category: 'Gomti Nagar', lat: 26.8500, lng: 81.0000 },
      { name: 'Vikas Nagar', category: 'Vikas Nagar', lat: 26.8930, lng: 80.9600 },
      { name: 'Jankipuram', category: 'Jankipuram', lat: 26.9130, lng: 80.9500 },
      { name: 'Chinhat', category: 'Chinhat', lat: 26.8700, lng: 81.0350 },

      // South / West Lucknow
      { name: 'Alambagh', category: 'Alambagh', lat: 26.8089, lng: 80.9142 },
      { name: 'Rajajipuram', category: 'Rajajipuram', lat: 26.8480, lng: 80.8700 },
      { name: 'Aashiyana', category: 'Aashiyana', lat: 26.8210, lng: 80.8930 },
      { name: 'Krishna Nagar', category: 'Krishna Nagar', lat: 26.7922, lng: 80.9012 },
      { name: 'Sarojini Nagar', category: 'Sarojini Nagar', lat: 26.7710, lng: 80.9280 },
      { name: 'Vrindavan Yojna', category: 'Vrindavan Yojna', lat: 26.7300, lng: 80.9420 },
      { name: 'Sushant Golf City', category: 'Sushant Golf City', lat: 26.7590, lng: 80.9850 },

      // Malls / landmarks
      { name: 'Phoenix Palassio Mall', category: 'Gomti Nagar', lat: 26.8460, lng: 81.0000 },
      { name: 'Wave Mall', category: 'Vibhuti Khand', lat: 26.8480, lng: 81.0060 },
      { name: 'Fun Republic Mall', category: 'Gomti Nagar', lat: 26.8570, lng: 80.9950 },
      { name: 'Bhootnath Market', category: 'Indira Nagar', lat: 26.8820, lng: 81.0110 },
      { name: 'Lekhraj Market', category: 'Aliganj/Munshipulia', lat: 26.8810, lng: 80.9942 },
    ],
  },
];