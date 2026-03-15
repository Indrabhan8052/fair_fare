// ═══════════════════════════════════════════════════════════════
// GLOBAL CONSTANTS (must be first — used everywhere)
// ═══════════════════════════════════════════════════════════════
const KEYS = { ejs: 'ff_ejscfg', fb: 'ff_fbcfg' };
const AVATARS = ['😊','😎','🧑','👩','🧔','👱','🧕','🧑‍💻','🧑‍🎓','👨‍✈️','🦸','🧙','🐯','🦊','🦁','🐻','🌟','🚀','🎯','🏆','🌈','⚡','🔥','💫'];
const AUTH = {
  mode: 'login',
  pendingEmail: '', pendingPhone: '', pendingName: '',
  pendingPass: '',   // stored during signup OTP flow — account created after OTP verified
  otpCode: '',
  otpExpiry: 0,
  otpTimer: null,
  pickedAvatar: '😊',
  fbApp: null, fbAuth: null, rcVerifier: null, rcResult: null,
  otpPending: false, // blocks onFBAuthChange auto-login during OTP flow
};
function getCfg(k){try{return JSON.parse(localStorage.getItem(k)||'null');}catch{return null;}}
function setCfg(k,v){localStorage.setItem(k,JSON.stringify(v));}

// ═══════════════════════════════════════════════════════════════
// REAL METRO DATA
// ═══════════════════════════════════════════════════════════════
const METRO = {

  // ══════════════════════════════════════════════════════════════
  // LUCKNOW METRO (LMRC) — Line 1 only (operational as of 2024)
  // North-South corridor: CCS Airport ↔ Munshipulia (23 stations)
  // ══════════════════════════════════════════════════════════════
  lucknow: {
    lines: [
      {
        id:'L1', name:'Line 1 (N-S Corridor)', color:'#e11d48',
        fare:[10,15,20,30,40], // LMRC slabs by distance km: ≤2,≤5,≤12,≤21,>21
        freq:'Every 8–12 min', firstLast:'06:00 – 22:00',
        stations:[
          {id:'CCS', name:'CCS Airport',            lat:26.7606,lng:80.8893},
          {id:'TRN', name:'Transport Nagar',         lat:26.7789,lng:80.8972},
          {id:'KRI', name:'Krishnanagar',            lat:26.7922,lng:80.9012},
          {id:'SGN', name:'Singar Nagar',            lat:26.8009,lng:80.9035},
          {id:'ABT', name:'Alambagh Bus Terminal',   lat:26.8061,lng:80.9054},
          {id:'ALM', name:'Alambagh',                lat:26.8089,lng:80.9142},
          {id:'MWY', name:'Mawaiya',                 lat:26.8185,lng:80.9152},
          {id:'CHB', name:'Charbagh',                lat:26.8375,lng:80.9095},
          {id:'HGJ', name:'Hussainganj',             lat:26.8443,lng:80.9218},
          {id:'SCH', name:'Sachivalaya',             lat:26.8468,lng:80.9302},
          {id:'HZG', name:'Hazratganj',              lat:26.8512,lng:80.9440},
          {id:'VDH', name:'Vidhansabha',             lat:26.8566,lng:80.9494},
          {id:'KDS', name:'KD Singh Babu Stadium',  lat:26.8585,lng:80.9575},
          {id:'ITC', name:'IT College',              lat:26.8612,lng:80.9665},
          {id:'LKU', name:'Lucknow University',      lat:26.8640,lng:80.9752},
          {id:'BSN', name:'Badhshah Nagar',          lat:26.8720,lng:80.9824},
          {id:'LKM', name:'Lekhraj Market',          lat:26.8810,lng:80.9942},
          {id:'ING', name:'Indira Nagar',            lat:26.8946,lng:81.0042},
          {id:'BWR', name:'Bhootnath Market',        lat:26.8820,lng:81.0110},
          {id:'MNP', name:'Munshipulia',             lat:26.8686,lng:80.9974},
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // DELHI METRO (DMRC) — 4 key operational lines
  // ══════════════════════════════════════════════════════════════
  delhi: {
    lines: [
      // ── Yellow Line (Line 2) — Samaypur Badli ↔ HUDA City Centre
      {
        id:'YL', name:'Yellow Line', color:'#eab308',
        freq:'Every 3–5 min (peak)', firstLast:'06:00 – 23:00',
        stations:[
          {id:'SBD', name:'Samaypur Badli',       lat:28.7490,lng:77.1560},
          {id:'RBL', name:'Rohini Sector 18,19',  lat:28.7395,lng:77.1580},
          {id:'HBM', name:'Haiderpur Badli Mor',  lat:28.7335,lng:77.1650},
          {id:'JHP', name:'Jahangirpuri',         lat:28.7280,lng:77.1706},
          {id:'ADN', name:'Adarsh Nagar',         lat:28.7145,lng:77.1786},
          {id:'AZP', name:'Azadpur',              lat:28.7076,lng:77.1840},
          {id:'MDT', name:'Model Town',           lat:28.7034,lng:77.1953},
          {id:'GTB', name:'GTB Nagar',            lat:28.6952,lng:77.2034},
          {id:'VVD', name:'Vishwavidyalaya',      lat:28.6891,lng:77.2073},
          {id:'VDS', name:'Vidhan Sabha',         lat:28.6793,lng:77.2109},
          {id:'CVL', name:'Civil Lines',          lat:28.6735,lng:77.2180},
          {id:'KSG', name:'Kashmere Gate',        lat:28.6659,lng:77.2271},
          {id:'CCK', name:'Chandni Chowk',        lat:28.6562,lng:77.2300},
          {id:'CWB', name:'Chawri Bazar',         lat:28.6496,lng:77.2280},
          {id:'NWD', name:'New Delhi',            lat:28.6358,lng:77.2238},
          {id:'RJC', name:'Rajiv Chowk',         lat:28.6328,lng:77.2197},
          {id:'PCT', name:'Patel Chowk',          lat:28.6245,lng:77.2130},
          {id:'CSC', name:'Central Secretariat',  lat:28.6148,lng:77.2109},
          {id:'UDB', name:'Udyog Bhawan',         lat:28.6085,lng:77.2120},
          {id:'LKM', name:'Lok Kalyan Marg',      lat:28.5993,lng:77.2087},
          {id:'JBG', name:'Jor Bagh',             lat:28.5930,lng:77.2080},
          {id:'INA', name:'INA',                  lat:28.5743,lng:77.2083},
          {id:'AIM', name:'AIIMS',                lat:28.5687,lng:77.2082},
          {id:'GRP', name:'Green Park',           lat:28.5614,lng:77.2057},
          {id:'HZK', name:'Hauz Khas',            lat:28.5494,lng:77.2001},
          {id:'MVN', name:'Malviya Nagar',        lat:28.5313,lng:77.1999},
          {id:'SKT', name:'Saket',                lat:28.5200,lng:77.2100},
          {id:'QTB', name:'Qutab Minar',          lat:28.5034,lng:77.1862},
          {id:'CTR', name:'Chhattarpur',          lat:28.4961,lng:77.1663},
          {id:'SLP', name:'Sultanpur',            lat:28.4835,lng:77.1492},
          {id:'GHT', name:'Ghitorni',             lat:28.4706,lng:77.1272},
          {id:'ARJ', name:'Arjangarh',            lat:28.4609,lng:77.1054},
          {id:'GDR', name:'Guru Dronacharya',     lat:28.4617,lng:77.0914},
          {id:'SKP', name:'Sikandarpur',          lat:28.4805,lng:77.0928},
          {id:'MGR', name:'MG Road',              lat:28.4837,lng:77.0858},
          {id:'IFC', name:'IFFCO Chowk',          lat:28.4730,lng:77.0729},
          {id:'HCC', name:'HUDA City Centre',     lat:28.4595,lng:77.0266},
        ]
      },

      // ── Blue Line (Line 3/4) — Dwarka Sec 21 ↔ Noida Elec City / Vaishali
      {
        id:'BL', name:'Blue Line', color:'#2563eb',
        freq:'Every 3–5 min (peak)', firstLast:'05:00 – 23:30',
        stations:[
          {id:'D21', name:'Dwarka Sector 21',    lat:28.5455,lng:77.0587},
          {id:'D08', name:'Dwarka Sector 8',     lat:28.5502,lng:77.0636},
          {id:'D09', name:'Dwarka Sector 9',     lat:28.5525,lng:77.0680},
          {id:'D10', name:'Dwarka Sector 10',    lat:28.5560,lng:77.0715},
          {id:'D11', name:'Dwarka Sector 11',    lat:28.5590,lng:77.0748},
          {id:'D12', name:'Dwarka Sector 12',    lat:28.5617,lng:77.0671},
          {id:'D13', name:'Dwarka Sector 13',    lat:28.5643,lng:77.0800},
          {id:'D14', name:'Dwarka Sector 14',    lat:28.5670,lng:77.0840},
          {id:'DWK', name:'Dwarka',              lat:28.5697,lng:77.0871},
          {id:'DMR', name:'Dwarka Mor',          lat:28.5830,lng:77.0853},
          {id:'NWD2',name:'Nawada',              lat:28.5951,lng:77.0814},
          {id:'UNW', name:'Uttam Nagar West',    lat:28.6056,lng:77.0724},
          {id:'UNE', name:'Uttam Nagar East',    lat:28.6124,lng:77.0621},
          {id:'JNW', name:'Janakpuri West',      lat:28.6291,lng:77.0753},
          {id:'JNE', name:'Janakpuri East',      lat:28.6337,lng:77.0918},
          {id:'TGR', name:'Tagore Garden',       lat:28.6445,lng:77.1065},
          {id:'SBN', name:'Subhash Nagar',       lat:28.6405,lng:77.1185},
          {id:'TLK', name:'Tilak Nagar',         lat:28.6410,lng:77.1010},
          {id:'KTN', name:'Kirti Nagar',         lat:28.6500,lng:77.1500},
          {id:'MTN', name:'Moti Nagar',          lat:28.6560,lng:77.1650},
          {id:'RMN', name:'Ramesh Nagar',        lat:28.6538,lng:77.1785},
          {id:'RJG', name:'Rajouri Garden',      lat:28.6490,lng:77.1220},
          {id:'MDP', name:'Madipur',             lat:28.6580,lng:77.1395},
          {id:'SVP', name:'Shivaji Park',        lat:28.6635,lng:77.1521},
          {id:'ESI', name:'ESI Hospital',        lat:28.6700,lng:77.1580},
          {id:'PBW', name:'Punjabi Bagh West',   lat:28.6712,lng:77.1440},
          {id:'SKD', name:'Shadipur',            lat:28.6514,lng:77.1620},
          {id:'PTR', name:'Patel Nagar',         lat:28.6514,lng:77.1800},
          {id:'KRB', name:'Karol Bagh',          lat:28.6530,lng:77.1921},
          {id:'JPN', name:'Jhandewalan',         lat:28.6490,lng:77.2010},
          {id:'RCS', name:'Ramakrishna Ashram',  lat:28.6430,lng:77.2070},
          {id:'RJC', name:'Rajiv Chowk',        lat:28.6328,lng:77.2197},
          {id:'MNH', name:'Mandi House',         lat:28.6250,lng:77.2334},
          {id:'SPM', name:'Supreme Court',       lat:28.6226,lng:77.2430},
          {id:'PRG', name:'Pragati Maidan',      lat:28.6180,lng:77.2505},
          {id:'INB', name:'Indraprastha',        lat:28.6200,lng:77.2600},
          {id:'YMN', name:'Yamuna Bank',         lat:28.6203,lng:77.2730},
          // Branch A → Vaishali
          {id:'LXN', name:'Laxmi Nagar',        lat:28.6340,lng:77.2760},
          {id:'NLK', name:'Nirman Vihar',        lat:28.6362,lng:77.2855},
          {id:'PRV', name:'Preet Vihar',         lat:28.6400,lng:77.2890},
          {id:'KRV', name:'Karkarduma',          lat:28.6460,lng:77.2960},
          {id:'ANN', name:'Anand Vihar ISBT',    lat:28.6466,lng:77.3159},
          {id:'KDM', name:'Kaushambi',           lat:28.6403,lng:77.3220},
          {id:'VSH', name:'Vaishali',            lat:28.6459,lng:77.3364},
        ]
      },

      // ── Red Line (Line 1) — Rithala ↔ Shaheed Sthal
      {
        id:'RL', name:'Red Line', color:'#dc2626',
        freq:'Every 5–8 min', firstLast:'06:00 – 23:00',
        stations:[
          {id:'RTH', name:'Rithala',              lat:28.7250,lng:77.1070},
          {id:'RTH2',name:'Rohini West',          lat:28.7348,lng:77.1101},
          {id:'RTH3',name:'Rohini East',          lat:28.7386,lng:77.1290},
          {id:'PTM', name:'Pitampura',            lat:28.7006,lng:77.1341},
          {id:'KOH', name:'Kohat Enclave',        lat:28.6926,lng:77.1467},
          {id:'NCH', name:'Netaji Subhash Place', lat:28.6940,lng:77.1530},
          {id:'SHL', name:'Shalimar Bagh',        lat:28.7121,lng:77.1653},
          {id:'SHP', name:'Shakurpur',            lat:28.6838,lng:77.1629},
          {id:'PNS', name:'Punjabi Bagh East',    lat:28.6736,lng:77.1396},
          {id:'ESG', name:'ESI Hospital',         lat:28.6700,lng:77.1580},
          {id:'TNK', name:'Tis Hazari',           lat:28.6715,lng:77.2170},
          {id:'PLC', name:'Pulbangash',           lat:28.6673,lng:77.2238},
          {id:'PHR', name:'Pratap Nagar',         lat:28.6617,lng:77.2354},
          {id:'SHD', name:'Shastri Park',         lat:28.6586,lng:77.2477},
          {id:'KSG', name:'Kashmere Gate',        lat:28.6659,lng:77.2271},
          {id:'THR', name:'Shahdara',             lat:28.6710,lng:77.2860},
          {id:'STP', name:'Seelampur',            lat:28.6700,lng:77.2940},
          {id:'WEL', name:'Welcome',              lat:28.6729,lng:77.3063},
          {id:'JFP', name:'Jaffrabad',            lat:28.6766,lng:77.3145},
          {id:'MSH', name:'Maujpur',              lat:28.6810,lng:77.3210},
          {id:'GKP', name:'Gokulpuri',            lat:28.6859,lng:77.3310},
          {id:'JHG', name:'Johripur',             lat:28.6935,lng:77.3393},
          {id:'DLG', name:'Dilshad Garden',       lat:28.6800,lng:77.3150},
          {id:'SST', name:'Shaheed Sthal',        lat:28.6956,lng:77.3472},
        ]
      },

      // ── Pink Line (Line 7) — Majlis Park ↔ Shiv Vihar
      {
        id:'PK', name:'Pink Line', color:'#db2777',
        freq:'Every 5–8 min', firstLast:'06:00 – 23:00',
        stations:[
          {id:'MJP', name:'Majlis Park',          lat:28.7160,lng:77.1337},
          {id:'AZP2',name:'Azadpur',              lat:28.7076,lng:77.1840},
          {id:'SGN2',name:'Shalimar Bagh',        lat:28.7121,lng:77.1653},
          {id:'NTV', name:'Netaji Subhash Place', lat:28.6940,lng:77.1530},
          {id:'SDP', name:'Shakurpur',            lat:28.6838,lng:77.1629},
          {id:'PKR', name:'Paschim Vihar East',   lat:28.6680,lng:77.0975},
          {id:'PKW', name:'Paschim Vihar West',   lat:28.6640,lng:77.0875},
          {id:'MCP', name:'Madipur',              lat:28.6580,lng:77.1395},
          {id:'SVR', name:'South Campus',         lat:28.5713,lng:77.2131},
          {id:'DUZ', name:'Durgabai Deshmukh S.H.',lat:28.5575,lng:77.2270},
          {id:'LJP', name:'Lajpat Nagar',         lat:28.5700,lng:77.2436},
          {id:'VNS', name:'Vinobapuri',           lat:28.5620,lng:77.2590},
          {id:'APS', name:'Ashram',               lat:28.5728,lng:77.2591},
          {id:'HZK2',name:'Hazrat Nizamuddin',    lat:28.5886,lng:77.2571},
          {id:'MVY', name:'Mayur Vihar Phase I',  lat:28.6065,lng:77.2940},
          {id:'MV2', name:'Mayur Vihar Pocket I', lat:28.6000,lng:77.3050},
          {id:'TRM', name:'Trilokpuri-Sanjay Lake',lat:28.6080,lng:77.3120},
          {id:'IPC', name:'East Vinod Nagar',     lat:28.6190,lng:77.3180},
          {id:'MCP2',name:'Mandawali',            lat:28.6260,lng:77.3080},
          {id:'SVH', name:'Shiv Vihar',           lat:28.6902,lng:77.3550},
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════
  // MUMBAI METRO — operational lines as of 2024
  // ══════════════════════════════════════════════════════════════
  mumbai: {
    lines: [
      // ── Line 1 — Versova ↔ Ghatkopar (MUTP, operational 2014)
      {
        id:'M1', name:'Metro Line 1', color:'#dc2626',
        freq:'Every 4–6 min', firstLast:'06:30 – 22:30',
        stations:[
          {id:'VRV', name:'Versova',                 lat:19.1313,lng:72.8139},
          {id:'DNG', name:'D.N. Nagar',              lat:19.1273,lng:72.8220},
          {id:'AZD', name:'Azad Nagar',              lat:19.1255,lng:72.8305},
          {id:'ANE', name:'Andheri',                 lat:19.1197,lng:72.8468},
          {id:'WEH', name:'Western Express Hwy',     lat:19.1148,lng:72.8556},
          {id:'CHK', name:'Chakala (J.B. Nagar)',    lat:19.1087,lng:72.8621},
          {id:'APR', name:'Airport Road',            lat:19.1004,lng:72.8704},
          {id:'MNK', name:'Marol Naka',              lat:19.0953,lng:72.8786},
          {id:'SAH', name:'Sahar Road',              lat:19.0993,lng:72.8711},
          {id:'DAP', name:'Domestic Airport',        lat:19.0896,lng:72.8656},
          {id:'GUD', name:'Gudamalani',              lat:19.0870,lng:72.8770},
          {id:'IAP', name:'International Airport',   lat:19.0979,lng:72.8740},
          {id:'SKN', name:'Saki Naka',               lat:19.0889,lng:72.8905},
          {id:'ASP', name:'Asalpha',                 lat:19.0875,lng:72.9000},
          {id:'JGN', name:'Jagruti Nagar',           lat:19.0865,lng:72.9045},
          {id:'GHK', name:'Ghatkopar',               lat:19.0863,lng:72.9069},
        ]
      },

      // ── Line 2A — Dahisar East ↔ D.N. Nagar (MMRDA, operational 2022)
      {
        id:'M2A', name:'Metro Line 2A', color:'#7c3aed',
        freq:'Every 4–8 min', firstLast:'06:30 – 22:30',
        stations:[
          {id:'DAH', name:'Dahisar East',            lat:19.2524,lng:72.8678},
          {id:'RUD', name:'Rashtriya Udyan',         lat:19.2450,lng:72.8629},
          {id:'AEY', name:'Aarey',                   lat:19.2375,lng:72.8601},
          {id:'KRV', name:'Kurar Village',           lat:19.2292,lng:72.8581},
          {id:'DNS', name:'Dindoshi',                lat:19.2218,lng:72.8549},
          {id:'MND', name:'Mandapeshwar',            lat:19.2148,lng:72.8530},
          {id:'EKS', name:'Eksar',                   lat:19.2076,lng:72.8529},
          {id:'BRV', name:'Borivali',                lat:19.2307,lng:72.8567},
          {id:'PSR', name:'Poisar',                  lat:19.2149,lng:72.8528},
          {id:'MGT', name:'Magathane',               lat:19.2060,lng:72.8559},
          {id:'DVP', name:'Devipada',                lat:19.1978,lng:72.8561},
          {id:'AKL', name:'Akurli',                  lat:19.1885,lng:72.8554},
          {id:'KND', name:'Kandivali',               lat:19.2056,lng:72.8516},
          {id:'KDP', name:'Kandarpada',              lat:19.1808,lng:72.8546},
          {id:'MLD', name:'Malad',                   lat:19.1864,lng:72.8481},
          {id:'MLV', name:'Malvani',                 lat:19.1730,lng:72.8360},
          {id:'BGN', name:'Bangur Nagar',            lat:19.1659,lng:72.8402},
          {id:'GGN', name:'Goregaon East',           lat:19.1663,lng:72.8526},
          {id:'DNN', name:'D.N. Nagar',              lat:19.1273,lng:72.8220},
        ]
      },

      // ── Line 7 — Dahisar East ↔ Andheri East (MMRDA, operational 2022)
      {
        id:'M7', name:'Metro Line 7', color:'#ea580c',
        freq:'Every 4–8 min', firstLast:'06:30 – 22:30',
        stations:[
          {id:'DAH2',name:'Dahisar East',            lat:19.2524,lng:72.8678},
          {id:'OVC', name:'Ovaripada',               lat:19.2444,lng:72.8697},
          {id:'PTH', name:'Pushpa Park',             lat:19.2360,lng:72.8714},
          {id:'DHV', name:'Devipada',                lat:19.2278,lng:72.8721},
          {id:'BDV', name:'Borivali East',           lat:19.2348,lng:72.8658},
          {id:'SJN', name:'Shimpoli',                lat:19.2148,lng:72.8709},
          {id:'GRD', name:'Gorai Road',              lat:19.2060,lng:72.8728},
          {id:'PTW', name:'Pathanwadi',              lat:19.1978,lng:72.8745},
          {id:'MMR', name:'Malad East',              lat:19.1864,lng:72.8762},
          {id:'VKH2',name:'Vanrai',                  lat:19.1748,lng:72.8778},
          {id:'KVD', name:'Kandivali East',          lat:19.2056,lng:72.8795},
          {id:'GGE', name:'Goregaon East',           lat:19.1663,lng:72.8795},
          {id:'JGE', name:'Jogeshwari East',         lat:19.1380,lng:72.8800},
          {id:'DNE', name:'Dindoshi East',           lat:19.1278,lng:72.8811},
          {id:'ANH', name:'Andheri East',            lat:19.1174,lng:72.8820},
        ]
      }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════
// CITY & LANDMARK DATA
// ═══════════════════════════════════════════════════════════════
const CITIES=[
  {id:'lucknow',  name:'Lucknow',   state:'Uttar Pradesh',   em:'🏛️',lat:26.8467,lng:80.9462,metro:true},
  {id:'delhi',    name:'Delhi',     state:'National Capital',em:'🏙️',lat:28.6139,lng:77.2090,metro:true},
  {id:'kanpur',   name:'Kanpur',    state:'Uttar Pradesh',   em:'🏭',lat:26.4499,lng:80.3319,metro:false},
  {id:'mumbai',   name:'Mumbai',    state:'Maharashtra',     em:'🌊',lat:19.0760,lng:72.8777,metro:true},
  {id:'raebareli',name:'Raebareli', state:'Uttar Pradesh',   em:'🌾',lat:26.2309,lng:81.2423,metro:false},
  {id:'barabanki',name:'Barabanki', state:'Uttar Pradesh',   em:'🌿',lat:26.9290,lng:81.1850,metro:false},
];

const PLACES={
  lucknow:[
    // ── Stations & Terminals ──
    {name:'Charbagh Railway Station',   addr:'Charbagh',               lat:26.8375,lng:80.9095},
    {name:'Lucknow Junction',           addr:'Charbagh',               lat:26.8396,lng:80.9078},
    {name:'Aishbagh Railway Station',   addr:'Aishbagh',               lat:26.8460,lng:80.8980},
    {name:'Gomti Nagar Railway Station',addr:'Gomti Nagar',            lat:26.8480,lng:81.0050},
    {name:'Alambagh Bus Terminal',      addr:'Alambagh',               lat:26.8066,lng:80.9054},
    {name:'Kaiserbagh Bus Stand',       addr:'Kaiserbagh',             lat:26.8500,lng:80.9380},
    {name:'Charbagh Bus Stand',         addr:'Charbagh',               lat:26.8360,lng:80.9110},
    {name:'Lucknow Airport (AMAUSI)',   addr:'Amausi',                 lat:26.7606,lng:80.8893},
    // ── Central & Old Lucknow ──
    {name:'Hazratganj',                 addr:'Central Lucknow',        lat:26.8512,lng:80.9440},
    {name:'Aminabad',                   addr:'Old Lucknow',            lat:26.8518,lng:80.9271},
    {name:'Husainganj',                 addr:'Central Lucknow',        lat:26.8430,lng:80.9210},
    {name:'Lalbagh',                    addr:'Central Lucknow',        lat:26.8480,lng:80.9350},
    {name:'Naka Hindola',               addr:'Old Lucknow',            lat:26.8550,lng:80.9190},
    {name:'Chowk',                      addr:'Old Lucknow',            lat:26.8620,lng:80.9180},
    {name:'Nakhas',                     addr:'Old Lucknow',            lat:26.8600,lng:80.9220},
    {name:'Yahiyaganj',                 addr:'Old Lucknow',            lat:26.8560,lng:80.9290},
    {name:'Akbari Gate',                addr:'Old Lucknow',            lat:26.8640,lng:80.9160},
    {name:'Saadatganj',                 addr:'Old Lucknow',            lat:26.8630,lng:80.9130},
    {name:'Gol Darwaza',                addr:'Old Lucknow',            lat:26.8590,lng:80.9140},
    {name:'Maulviganj',                 addr:'Central Lucknow',        lat:26.8500,lng:80.9310},
    {name:'Patanala',                   addr:'Old Lucknow',            lat:26.8610,lng:80.9260},
    {name:'Kashmiri Mohalla',           addr:'Old Lucknow',            lat:26.8650,lng:80.9200},
    {name:'Rakabganj',                  addr:'Old Lucknow',            lat:26.8570,lng:80.9220},
    {name:'Hanuman Setu',               addr:'Naka',                   lat:26.8540,lng:80.9240},
    {name:'Gautam Budh Marg',           addr:'Central Lucknow',        lat:26.8470,lng:80.9330},
    {name:'Narhi',                      addr:'Central Lucknow',        lat:26.8490,lng:80.9280},
    // ── South Lucknow ──
    {name:'Alambagh',                   addr:'South Lucknow',          lat:26.8066,lng:80.9293},
    {name:'Singar Nagar',               addr:'South Lucknow',          lat:26.8009,lng:80.9040},
    {name:'Krishnanagar',               addr:'South-West Lucknow',     lat:26.7921,lng:80.9010},
    {name:'Transport Nagar',            addr:'South Lucknow',          lat:26.7789,lng:80.8972},
    {name:'Mawaiya',                    addr:'South Lucknow',          lat:26.8100,lng:80.9200},
    {name:'Telibagh',                   addr:'South Lucknow',          lat:26.7950,lng:80.9450},
    {name:'Vrindavan Colony',           addr:'South Lucknow',          lat:26.7850,lng:80.9550},
    {name:'Sultanpur Road',             addr:'South Lucknow',          lat:26.7750,lng:80.9600},
    {name:'Munirka',                    addr:'South Lucknow',          lat:26.8020,lng:80.9350},
    {name:'Kanpur Road',                addr:'South Lucknow',          lat:26.8080,lng:80.9150},
    {name:'Sharda Nagar',               addr:'South Lucknow',          lat:26.8150,lng:80.9380},
    {name:'Rajajipuram',                addr:'South-West Lucknow',     lat:26.8680,lng:80.8800},
    {name:'Kalyanpur',                  addr:'West Lucknow',           lat:26.8590,lng:80.8900},
    {name:'Arjun Ganj',                 addr:'South Lucknow',          lat:26.8010,lng:80.9650},
    {name:'Sushant Golf City',          addr:'Shaheed Path',           lat:26.7900,lng:80.9900},
    // ── North Lucknow ──
    {name:'Aliganj',                    addr:'North Lucknow',          lat:26.8886,lng:80.9502},
    {name:'Jankipuram',                 addr:'North-West Lucknow',     lat:26.9128,lng:80.9382},
    {name:'Vikas Nagar',                addr:'North Lucknow',          lat:26.9030,lng:80.9650},
    {name:'Mahanagar',                  addr:'North-Central Lucknow',  lat:26.8754,lng:80.9575},
    {name:'Indira Nagar',               addr:'North-East Lucknow',     lat:26.8946,lng:81.0042},
    {name:'Sector 14 Indira Nagar',     addr:'Indira Nagar',           lat:26.8900,lng:81.0000},
    {name:'Sector 9 Indira Nagar',      addr:'Indira Nagar',           lat:26.8960,lng:81.0100},
    {name:'Hardoi Road',                addr:'North Lucknow',          lat:26.9200,lng:80.9300},
    {name:'Sitapur Road',               addr:'North Lucknow',          lat:26.9300,lng:80.9500},
    {name:'CRPF Campus',                addr:'North Lucknow',          lat:26.9150,lng:80.9650},
    {name:'Mohanlalganj',               addr:'North Lucknow',          lat:26.9400,lng:80.9800},
    {name:'Chinhat',                    addr:'North-East Lucknow',     lat:26.8706,lng:81.0620},
    {name:'Faizabad Road',              addr:'North-East Lucknow',     lat:26.8800,lng:81.0300},
    {name:'Kursi Road',                 addr:'North-East Lucknow',     lat:26.9100,lng:81.0200},
    {name:'Bhootnath Market',           addr:'Indira Nagar',           lat:26.8820,lng:81.0110},
    // ── East Lucknow ──
    {name:'Gomti Nagar',                addr:'East Lucknow',           lat:26.8555,lng:81.0116},
    {name:'Vibhuti Khand',              addr:'Gomti Nagar',            lat:26.8570,lng:81.0050},
    {name:'Vishesh Khand',              addr:'Gomti Nagar',            lat:26.8523,lng:80.9940},
    {name:'IT Chauraha',                addr:'Vibhuti Khand',          lat:26.8523,lng:80.9990},
    {name:'Shaheed Path',               addr:'East Lucknow',           lat:26.8480,lng:81.0200},
    {name:'Hazratganj Extension',       addr:'East Lucknow',           lat:26.8530,lng:80.9650},
    {name:'Munshipulia',                addr:'East Lucknow',           lat:26.8680,lng:80.9970},
    {name:'Sector B Gomti Nagar',       addr:'Gomti Nagar',            lat:26.8600,lng:81.0200},
    {name:'Sector C Gomti Nagar',       addr:'Gomti Nagar',            lat:26.8650,lng:81.0100},
    {name:'IIM Lucknow',                addr:'Prabandh Nagar',         lat:26.8573,lng:81.0041},
    {name:'Medanta Hospital',           addr:'Gomti Nagar',            lat:26.8567,lng:81.0005},
    {name:'Sahara Hospital',            addr:'Gomti Nagar Ext.',       lat:26.8480,lng:81.0280},
    {name:'Lok Bandhu Hospital',        addr:'Rajajipuram',            lat:26.8720,lng:80.8910},
    {name:'KGMU',                       addr:'Chowk',                  lat:26.8600,lng:80.9326},
    {name:'Ram Manohar Lohia Hospital', addr:'Vibhuti Khand',          lat:26.8600,lng:80.9350},
    // ── Landmarks ──
    {name:'Bara Imambara',              addr:'Old Lucknow',            lat:26.8692,lng:80.9120},
    {name:'Rumi Darwaza',               addr:'Old Lucknow',            lat:26.8685,lng:80.9110},
    {name:'Lucknow Zoo',                addr:'Hazratganj',             lat:26.8440,lng:80.9385},
    {name:'Ambedkar Park',              addr:'Gomti Nagar',            lat:26.8500,lng:80.9940},
    {name:'Janeshwar Mishra Park',      addr:'Gomti Nagar',            lat:26.8390,lng:80.9990},
    {name:'1090 Chauraha',              addr:'Vibhuti Khand',          lat:26.8540,lng:80.9930},
    {name:'Lulu Mall',                  addr:'Sushant Golf City',      lat:26.7942,lng:80.9952},
    {name:'Phoenix Palassio',           addr:'Krishnanagar',           lat:26.8008,lng:80.9083},
    {name:'Wave Mall',                  addr:'Gomti Nagar',            lat:26.8570,lng:81.0200},
    {name:'Nishatganj',                 addr:'North Lucknow',          lat:26.8700,lng:80.9400},
    {name:'Kapoorthala',                addr:'Aliganj',                lat:26.8840,lng:80.9690},
    {name:'Sarojini Nagar',             addr:'West Lucknow',           lat:26.8330,lng:80.8990},
    {name:'Daliganj',                   addr:'North-Central Lucknow',  lat:26.8700,lng:80.9330},
    {name:'Naubasta',                   addr:'East Lucknow',           lat:26.8400,lng:81.0700},
    {name:'Kakori',                     addr:'West Lucknow',           lat:26.8800,lng:80.8400},
    {name:'Malihabad',                  addr:'West Lucknow',           lat:26.9200,lng:80.7400},
    {name:'Bakshi Ka Talab',            addr:'North Lucknow',          lat:26.9600,lng:80.9300},
    {name:'Gosainganj',                 addr:'South Lucknow',          lat:26.7600,lng:80.9900},
    {name:'Balaganj',                   addr:'Old Lucknow',            lat:26.8580,lng:80.9090},
    {name:'Thakurganj',                 addr:'Old Lucknow',            lat:26.8660,lng:80.9090},
    {name:'Parivartan Chowk',           addr:'Gomti Nagar',            lat:26.8530,lng:80.9980},
    {name:'Sachivalaya',                addr:'Central Lucknow',        lat:26.8468,lng:80.9302},
    {name:'Vidhan Sabha',               addr:'Central Lucknow',        lat:26.8566,lng:80.9494},
    {name:'Raj Bhavan',                 addr:'Hazratganj',             lat:26.8530,lng:80.9510},
    {name:'GPO',                        addr:'Hazratganj',             lat:26.8520,lng:80.9420},
    {name:'Lucknow University',         addr:'University Road',        lat:26.8570,lng:80.9340},
    {name:'BBAU',                       addr:'Raibareilly Road',       lat:26.7993,lng:81.0044},
    {name:'SGPGI',                      addr:'Raebareli Road',         lat:26.7993,lng:80.9940},
  ],

  delhi:[
    // ── Central Delhi ──
    {name:'Connaught Place',            addr:'New Delhi',              lat:28.6300,lng:77.2197},
    {name:'Karol Bagh',                 addr:'Central Delhi',          lat:28.6530,lng:77.1921},
    {name:'Rajiv Chowk',                addr:'New Delhi',              lat:28.6328,lng:77.2197},
    {name:'Parliament Street',          addr:'New Delhi',              lat:28.6200,lng:77.2090},
    {name:'Barakhamba Road',            addr:'New Delhi',              lat:28.6310,lng:77.2260},
    {name:'Mandi House',                addr:'Central Delhi',          lat:28.6250,lng:77.2334},
    {name:'ITO',                        addr:'Central Delhi',          lat:28.6280,lng:77.2400},
    {name:'Daryaganj',                  addr:'Old Delhi',              lat:28.6444,lng:77.2384},
    {name:'Chandni Chowk',              addr:'Old Delhi',              lat:28.6562,lng:77.2300},
    {name:'Old Delhi Railway Station',  addr:'Old Delhi',              lat:28.6590,lng:77.2278},
    {name:'New Delhi Railway Station',  addr:'Paharganj',              lat:28.6427,lng:77.2194},
    {name:'Hazrat Nizamuddin Station',  addr:'South Delhi',            lat:28.5886,lng:77.2571},
    {name:'Indira Gandhi Airport T3',   addr:'Delhi Airport',          lat:28.5562,lng:77.1000},
    // ── North Delhi ──
    {name:'Rohini East',                addr:'North Delhi',            lat:28.7386,lng:77.1290},
    {name:'Rohini West',                addr:'North Delhi',            lat:28.7350,lng:77.1100},
    {name:'Pitampura',                  addr:'North Delhi',            lat:28.7006,lng:77.1341},
    {name:'Shalimar Bagh',              addr:'North Delhi',            lat:28.7121,lng:77.1653},
    {name:'Netaji Subhash Place',       addr:'North Delhi',            lat:28.6940,lng:77.1530},
    {name:'Azadpur',                    addr:'North Delhi',            lat:28.7100,lng:77.1800},
    {name:'Burari',                     addr:'North Delhi',            lat:28.7500,lng:77.2100},
    {name:'Mukherjee Nagar',            addr:'North Delhi',            lat:28.7143,lng:77.2044},
    {name:'Civil Lines',                addr:'North Delhi',            lat:28.6800,lng:77.2200},
    {name:'Kashmere Gate',              addr:'North Delhi',            lat:28.6659,lng:77.2271},
    {name:'Model Town',                 addr:'North Delhi',            lat:28.7100,lng:77.1950},
    {name:'Adarsh Nagar',               addr:'North Delhi',            lat:28.7100,lng:77.1800},
    {name:'Jahangirpuri',               addr:'North Delhi',            lat:28.7350,lng:77.1670},
    {name:'Badli',                      addr:'North Delhi',            lat:28.7440,lng:77.1700},
    {name:'Samaypur Badli',             addr:'North Delhi',            lat:28.7490,lng:77.1560},
    {name:'Narela',                     addr:'North Delhi',            lat:28.8260,lng:77.0930},
    // ── South Delhi ──
    {name:'Lajpat Nagar',               addr:'South Delhi',            lat:28.5700,lng:77.2436},
    {name:'Saket',                      addr:'South Delhi',            lat:28.5200,lng:77.2100},
    {name:'Hauz Khas',                  addr:'South Delhi',            lat:28.5494,lng:77.2001},
    {name:'Green Park',                 addr:'South Delhi',            lat:28.5614,lng:77.2057},
    {name:'Greater Kailash 1',          addr:'South Delhi',            lat:28.5440,lng:77.2430},
    {name:'Greater Kailash 2',          addr:'South Delhi',            lat:28.5380,lng:77.2490},
    {name:'Nehru Place',                addr:'South Delhi',            lat:28.5492,lng:77.2517},
    {name:'Malviya Nagar',              addr:'South Delhi',            lat:28.5260,lng:77.2085},
    {name:'Vasant Kunj',                addr:'South-West Delhi',       lat:28.5230,lng:77.1570},
    {name:'Vasant Vihar',               addr:'South-West Delhi',       lat:28.5570,lng:77.1590},
    {name:'AIIMS',                      addr:'South Delhi',            lat:28.5672,lng:77.2100},
    {name:'Safdarjung',                 addr:'South Delhi',            lat:28.5680,lng:77.2060},
    {name:'Chittaranjan Park',          addr:'South Delhi',            lat:28.5440,lng:77.2590},
    {name:'Kalkaji',                    addr:'South Delhi',            lat:28.5490,lng:77.2580},
    {name:'Govindpuri',                 addr:'South Delhi',            lat:28.5350,lng:77.2600},
    {name:'Okhla',                      addr:'South Delhi',            lat:28.5340,lng:77.2710},
    {name:'Jasola',                     addr:'South Delhi',            lat:28.5420,lng:77.2860},
    {name:'Jamia Nagar',                addr:'South Delhi',            lat:28.5610,lng:77.2900},
    {name:'Badarpur',                   addr:'South Delhi',            lat:28.5020,lng:77.2890},
    {name:'Sarita Vihar',               addr:'South Delhi',            lat:28.5450,lng:77.2950},
    {name:'Tughlakabad',                addr:'South Delhi',            lat:28.4990,lng:77.2700},
    // ── West Delhi ──
    {name:'Dwarka Sector 21',           addr:'West Delhi',             lat:28.5455,lng:77.0587},
    {name:'Dwarka Sector 12',           addr:'West Delhi',             lat:28.5600,lng:77.0750},
    {name:'Dwarka',                     addr:'West Delhi',             lat:28.5617,lng:77.0671},
    {name:'Janakpuri West',             addr:'West Delhi',             lat:28.6291,lng:77.0753},
    {name:'Janakpuri East',             addr:'West Delhi',             lat:28.6330,lng:77.0900},
    {name:'Uttam Nagar',                addr:'West Delhi',             lat:28.6180,lng:77.0560},
    {name:'Vikaspuri',                  addr:'West Delhi',             lat:28.6430,lng:77.0740},
    {name:'Paschim Vihar',              addr:'West Delhi',             lat:28.6680,lng:77.0870},
    {name:'Rajouri Garden',             addr:'West Delhi',             lat:28.6490,lng:77.1220},
    {name:'Tilak Nagar',                addr:'West Delhi',             lat:28.6410,lng:77.1010},
    {name:'Subhash Nagar',              addr:'West Delhi',             lat:28.6405,lng:77.1185},
    {name:'Tagore Garden',              addr:'West Delhi',             lat:28.6445,lng:77.1065},
    // ── East Delhi ──
    {name:'Laxmi Nagar',                addr:'East Delhi',             lat:28.6340,lng:77.2760},
    {name:'Preet Vihar',                addr:'East Delhi',             lat:28.6400,lng:77.2890},
    {name:'Mayur Vihar Phase 1',        addr:'East Delhi',             lat:28.6065,lng:77.2940},
    {name:'Mayur Vihar Phase 2',        addr:'East Delhi',             lat:28.6000,lng:77.3050},
    {name:'Patparganj',                 addr:'East Delhi',             lat:28.6200,lng:77.2950},
    {name:'Noida Sector 18',            addr:'Noida, UP',              lat:28.5704,lng:77.3209},
    {name:'Noida Sector 62',            addr:'Noida, UP',              lat:28.6270,lng:77.3650},
    {name:'Shahdara',                   addr:'East Delhi',             lat:28.6710,lng:77.2860},
    {name:'Dilshad Garden',             addr:'East Delhi',             lat:28.6800,lng:77.3150},
    {name:'Vivek Vihar',                addr:'East Delhi',             lat:28.6700,lng:77.2990},
  ],

  kanpur:[
    // ── Central ──
    {name:'Kanpur Central Station',     addr:'Civil Lines',            lat:26.4499,lng:80.3319},
    {name:'Anwarganj Station',          addr:'Anwarganj',              lat:26.4560,lng:80.3420},
    {name:'Civil Lines',                addr:'Kanpur',                 lat:26.4672,lng:80.3462},
    {name:'Mall Road',                  addr:'Civil Lines',            lat:26.4700,lng:80.3480},
    {name:'Collectorganj',              addr:'Central Kanpur',         lat:26.4580,lng:80.3350},
    {name:'Generalganj',                addr:'Central Kanpur',         lat:26.4620,lng:80.3410},
    {name:'Phoolbagh',                  addr:'Central Kanpur',         lat:26.4650,lng:80.3440},
    {name:'Nayaganj',                   addr:'Central Kanpur',         lat:26.4600,lng:80.3300},
    {name:'Bada Chauraha',              addr:'Central Kanpur',         lat:26.4580,lng:80.3320},
    {name:'Parade',                     addr:'Central Kanpur',         lat:26.4700,lng:80.3400},
    // ── North & East ──
    {name:'Kidwai Nagar',               addr:'North Kanpur',           lat:26.4780,lng:80.3600},
    {name:'Govind Nagar',               addr:'North Kanpur',           lat:26.4860,lng:80.3540},
    {name:'Shyam Nagar',                addr:'North Kanpur',           lat:26.4920,lng:80.3480},
    {name:'Barra',                      addr:'East Kanpur',            lat:26.4400,lng:80.3700},
    {name:'Rawatpur',                   addr:'East Kanpur',            lat:26.4300,lng:80.3800},
    {name:'Dada Nagar',                 addr:'East Kanpur',            lat:26.4350,lng:80.3650},
    {name:'Jajmau',                     addr:'East Kanpur',            lat:26.4100,lng:80.3900},
    {name:'Sarsaul',                    addr:'East Kanpur',            lat:26.4200,lng:80.4200},
    {name:'Chakeri',                    addr:'East Kanpur',            lat:26.4100,lng:80.4000},
    {name:'Kanpur Airport',             addr:'Chakeri',                lat:26.4044,lng:80.4106},
    // ── West & South ──
    {name:'Kalyanpur',                  addr:'West Kanpur',            lat:26.4900,lng:80.2900},
    {name:'Harsh Nagar',                addr:'West Kanpur',            lat:26.4650,lng:80.3100},
    {name:'Ratan Lal Nagar',            addr:'West Kanpur',            lat:26.4750,lng:80.2900},
    {name:'Panki',                      addr:'West Kanpur',            lat:26.4500,lng:80.2800},
    {name:'Panki Power House',          addr:'Panki',                  lat:26.4450,lng:80.2650},
    {name:'Armapur',                    addr:'West Kanpur',            lat:26.4620,lng:80.3000},
    {name:'Vikas Nagar',                addr:'South-West Kanpur',      lat:26.4400,lng:80.3000},
    {name:'Shivala',                    addr:'South Kanpur',           lat:26.4350,lng:80.3400},
    {name:'Swaroop Nagar',              addr:'North Kanpur',           lat:26.5000,lng:80.3300},
    {name:'IIT Kanpur',                 addr:'Kalyanpur',              lat:26.5123,lng:80.2329},
    {name:'GSVM Medical College',       addr:'Collectorganj',          lat:26.4560,lng:80.3360},
    {name:'Kamla Club',                 addr:'Civil Lines',            lat:26.4680,lng:80.3490},
    {name:'Meston Road',                addr:'Central Kanpur',         lat:26.4670,lng:80.3460},
    {name:'Benajhabar',                 addr:'South Kanpur',           lat:26.4200,lng:80.3500},
    {name:'Dehat Area Kanpur',          addr:'Outskirts',              lat:26.3900,lng:80.3500},
  ],

  mumbai:[
    // ── South Mumbai ──
    {name:'CST / VT',                   addr:'Fort, South Mumbai',     lat:18.9398,lng:72.8355},
    {name:'Churchgate',                 addr:'South Mumbai',           lat:18.9322,lng:72.8264},
    {name:'Colaba',                     addr:'South Mumbai',           lat:18.9067,lng:72.8147},
    {name:'Nariman Point',              addr:'South Mumbai',           lat:18.9255,lng:72.8242},
    {name:'Fort',                       addr:'South Mumbai',           lat:18.9340,lng:72.8370},
    {name:'Marine Lines',               addr:'South Mumbai',           lat:18.9438,lng:72.8213},
    {name:'Malabar Hill',               addr:'South Mumbai',           lat:18.9600,lng:72.8060},
    {name:'Breach Candy',               addr:'South Mumbai',           lat:18.9718,lng:72.8066},
    {name:'Cuffe Parade',               addr:'South Mumbai',           lat:18.9046,lng:72.8208},
    {name:'Parel',                      addr:'Central Mumbai',         lat:19.0017,lng:72.8417},
    {name:'Lower Parel',                addr:'Central Mumbai',         lat:18.9960,lng:72.8317},
    {name:'Dadar',                      addr:'Central Mumbai',         lat:19.0178,lng:72.8478},
    {name:'Mahim',                      addr:'Central Mumbai',         lat:19.0434,lng:72.8410},
    {name:'Worli',                      addr:'Central Mumbai',         lat:19.0096,lng:72.8175},
    {name:'Bandra West',                addr:'West Mumbai',            lat:19.0596,lng:72.8295},
    {name:'Bandra Kurla Complex',       addr:'BKC',                    lat:19.0660,lng:72.8680},
    // ── Western Suburbs ──
    {name:'Santacruz',                  addr:'West Mumbai',            lat:19.0820,lng:72.8409},
    {name:'Vile Parle',                 addr:'West Mumbai',            lat:19.0980,lng:72.8479},
    {name:'Andheri West',               addr:'West Mumbai',            lat:19.1197,lng:72.8468},
    {name:'Andheri East',               addr:'East Mumbai',            lat:19.1174,lng:72.8478},
    {name:'Jogeshwari',                 addr:'West Mumbai',            lat:19.1368,lng:72.8498},
    {name:'Goregaon',                   addr:'West Mumbai',            lat:19.1663,lng:72.8526},
    {name:'Malad',                      addr:'West Mumbai',            lat:19.1864,lng:72.8481},
    {name:'Kandivali',                  addr:'West Mumbai',            lat:19.2056,lng:72.8516},
    {name:'Borivali',                   addr:'North Mumbai',           lat:19.2307,lng:72.8567},
    {name:'Dahisar',                    addr:'North Mumbai',           lat:19.2524,lng:72.8678},
    {name:'Mira Road',                  addr:'Mira-Bhayandar',         lat:19.2868,lng:72.8697},
    {name:'Versova',                    addr:'West Mumbai',            lat:19.1313,lng:72.8139},
    // ── Eastern Suburbs ──
    {name:'Kurla',                      addr:'Central Mumbai',         lat:19.0726,lng:72.8792},
    {name:'Ghatkopar',                  addr:'East Mumbai',            lat:19.0863,lng:72.9069},
    {name:'Vikhroli',                   addr:'East Mumbai',            lat:19.1050,lng:72.9219},
    {name:'Kanjurmarg',                 addr:'East Mumbai',            lat:19.1290,lng:72.9425},
    {name:'Bhandup',                    addr:'East Mumbai',            lat:19.1420,lng:72.9510},
    {name:'Mulund',                     addr:'East Mumbai',            lat:19.1720,lng:72.9590},
    {name:'Thane',                      addr:'Thane',                  lat:19.1944,lng:72.9615},
    {name:'Airoli',                     addr:'Navi Mumbai',            lat:19.1540,lng:73.0090},
    {name:'Vashi',                      addr:'Navi Mumbai',            lat:19.0771,lng:73.0035},
    {name:'Belapur',                    addr:'Navi Mumbai',            lat:19.0233,lng:73.0340},
    {name:'Panvel',                     addr:'Navi Mumbai',            lat:18.9894,lng:73.1175},
    {name:'Chembur',                    addr:'East Mumbai',            lat:19.0622,lng:72.9005},
    {name:'Govandi',                    addr:'East Mumbai',            lat:19.0530,lng:72.9210},
    {name:'Mankhurd',                   addr:'East Mumbai',            lat:19.0415,lng:72.9310},
    {name:'Mumbai Airport T1',          addr:'Santa Cruz',             lat:19.0896,lng:72.8656},
    {name:'Mumbai Airport T2',          addr:'Sahar',                  lat:19.0979,lng:72.8740},
  ],

  raebareli:[
    // ── Town ──
    {name:'Raebareli Bus Stand',        addr:'Raebareli',              lat:26.2309,lng:81.2423},
    {name:'Raebareli Railway Station',  addr:'Raebareli',              lat:26.2270,lng:81.2310},
    {name:'Civil Lines',                addr:'Raebareli',              lat:26.2380,lng:81.2500},
    {name:'Collectorate',               addr:'Civil Lines',            lat:26.2410,lng:81.2530},
    {name:'Gandhi Nagar',               addr:'Raebareli',              lat:26.2350,lng:81.2550},
    {name:'Azad Nagar',                 addr:'Raebareli',              lat:26.2300,lng:81.2600},
    {name:'Saket Nagar',                addr:'Raebareli',              lat:26.2280,lng:81.2450},
    {name:'Mohanganj',                  addr:'Raebareli',              lat:26.2400,lng:81.2380},
    {name:'Kunda',                      addr:'Raebareli',              lat:26.2200,lng:81.2200},
    {name:'Bhawani Ganj',               addr:'Raebareli',              lat:26.2450,lng:81.2300},
    // ── Tehsils & Towns ──
    {name:'Dalmau',                     addr:'Raebareli',              lat:26.0710,lng:81.0350},
    {name:'Lalganj',                    addr:'Raebareli',              lat:26.2450,lng:81.3600},
    {name:'Tiloi',                      addr:'Raebareli',              lat:26.0900,lng:81.3200},
    {name:'Salon',                      addr:'Raebareli',              lat:26.1900,lng:81.3800},
    {name:'Harchandpur',                addr:'Raebareli',              lat:26.3000,lng:81.1500},
    {name:'Maharajganj',                addr:'Raebareli',              lat:26.1800,lng:81.2500},
    {name:'Bachhrawan',                 addr:'Raebareli',              lat:26.3200,lng:81.1900},
    {name:'Dera',                       addr:'Raebareli',              lat:26.2600,lng:81.2700},
    {name:'Amawa',                      addr:'Raebareli',              lat:26.1500,lng:81.2900},
    {name:'Pariyawan',                  addr:'Raebareli',              lat:26.2100,lng:81.1800},
    {name:'Kheergarh',                  addr:'Raebareli',              lat:26.3100,lng:81.2500},
    {name:'Fursatganj',                 addr:'Raebareli',              lat:26.2500,lng:81.4100},
    {name:'NTPC Unchahar',              addr:'Raebareli',              lat:26.1060,lng:81.3790},
  ],

  barabanki:[
    // ── Town ──
    {name:'Barabanki Bus Stand',        addr:'Barabanki',              lat:26.9290,lng:81.1850},
    {name:'Barabanki Railway Station',  addr:'Barabanki',              lat:26.9250,lng:81.1790},
    {name:'Collectorate Barabanki',     addr:'Civil Lines',            lat:26.9310,lng:81.1900},
    {name:'Civil Lines Barabanki',      addr:'Barabanki',              lat:26.9320,lng:81.1920},
    {name:'Ram Nagar',                  addr:'Barabanki',              lat:26.9280,lng:81.2000},
    {name:'Subhash Nagar',              addr:'Barabanki',              lat:26.9260,lng:81.1850},
    {name:'Gandhi Nagar',               addr:'Barabanki',              lat:26.9300,lng:81.1950},
    // ── Tehsils & Towns ──
    {name:'Haidergarh',                 addr:'Barabanki',              lat:26.8960,lng:81.3700},
    {name:'Ramsanehighat',              addr:'Barabanki',              lat:26.8500,lng:81.3000},
    {name:'Fatehpur',                   addr:'Barabanki',              lat:26.9800,lng:81.2200},
    {name:'Nawabganj',                  addr:'Barabanki',              lat:26.9300,lng:81.2400},
    {name:'Trivediganj',                addr:'Barabanki',              lat:26.8600,lng:81.3200},
    {name:'Masoli',                     addr:'Barabanki',              lat:26.8300,lng:81.2500},
    {name:'Dewa Sharif',                addr:'Barabanki',              lat:26.9100,lng:81.1400},
    {name:'Zaidpur',                    addr:'Barabanki',              lat:26.9600,lng:81.3300},
    {name:'Sirauli Gauspur',            addr:'Barabanki',              lat:26.9900,lng:81.2500},
    {name:'Haidargarh Road',            addr:'Barabanki',              lat:26.9000,lng:81.2800},
    {name:'Subeha',                     addr:'Barabanki',              lat:26.9700,lng:81.1600},
    {name:'Bhitaura',                   addr:'Barabanki',              lat:26.8700,lng:81.2200},
    {name:'Banki',                      addr:'Barabanki',              lat:26.9500,lng:81.1900},
  ]
};

const VIDEOS=[
  {em:'🚇',title:'Lucknow Metro Full Route Guide 2024',ch:'City Explorer LKO',views:'1.2M',tag:'Metro'},
  {em:'🛺',title:'Best Auto Routes from Charbagh',ch:'Fair Fare Official',views:'450K',tag:'Auto'},
  {em:'🚌',title:'UP City Bus Routes Explained',ch:'LKO Transport',views:'320K',tag:'Bus'},
  {em:'🚕',title:'Ola vs Uber in Lucknow — Price Battle',ch:'TravelSmart India',views:'890K',tag:'Cabs'},
  {em:'💰',title:'Cross City Lucknow for ₹20',ch:'Budget Yatri',views:'670K',tag:'Budget'},
];

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════
const S={
  city:null,from:null,to:null,route:null,mode:'bus',
  lmap:null,routeLayers:[],metroLayers:[],fromMarker:null,toMarker:null,
  mapView:'route', // route | metro | all
  recent:JSON.parse(localStorage.getItem('ff_r')||'[]'),
  searchType:null,searchTimer:null,
};

// ═══════════════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════════════
function boot(){
  CITIES.forEach((c,i)=>{
    const d=document.createElement('div');
    d.className='cc';d.style.animationDelay=i*55+'ms';
    d.innerHTML=`<div class="ce">${c.em}</div>
      <div><div class="cn">${c.name}</div>
      <div class="cs">${c.state}${c.metro?' · 🚇 Metro':''}</div></div>
      <span style="color:var(--blue);margin-left:auto">›</span>`;
    d.onclick=()=>selectCity(c);
    document.getElementById('cityList').appendChild(d);
  });
  renderVideos();
  initLeaflet(26.8467,80.9462,12);
  authBoot();
}
(function waitL(){
  if(typeof L!=='undefined') boot();
  else setTimeout(waitL,50);
})();

// ═══════════════════════════════════════════════════════════════
// LEAFLET INIT
// ═══════════════════════════════════════════════════════════════
function initLeaflet(lat,lng,zoom){
  if(S.lmap) return;
  S.lmap=L.map('lmap',{zoomControl:false,attributionControl:false,dragging:true,scrollWheelZoom:false})
           .setView([lat,lng],zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,subdomains:'abc'}).addTo(S.lmap);
  L.control.zoom({position:'bottomright'}).addTo(S.lmap);
  setTimeout(()=>S.lmap&&S.lmap.invalidateSize(),300);
}

// ═══════════════════════════════════════════════════════════════
// METRO MAP LAYER — draw all lines + stops for a city
// ═══════════════════════════════════════════════════════════════
function drawMetroLines(cityId){
  clearMetroLayers();
  const cityMet=METRO[cityId];
  if(!cityMet) return;
  const legend=document.getElementById('metroLegend');
  legend.innerHTML='<div style="font-size:10px;font-weight:700;color:var(--muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:.8px">Metro Lines</div>';
  legend.style.display='flex';

  cityMet.lines.forEach(line=>{
    const pts=line.stations.map(s=>[s.lat,s.lng]);
    // Track line
    const poly=L.polyline(pts,{color:line.color,weight:4,opacity:.85}).addTo(S.lmap);
    S.metroLayers.push(poly);
    // Station dots
    line.stations.forEach(st=>{
      const ic=L.divIcon({className:'',iconSize:[10,10],iconAnchor:[5,5],
        html:`<div style="width:10px;height:10px;border-radius:50%;background:${line.color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.5)"></div>`});
      const mk=L.marker([st.lat,st.lng],{icon:ic}).addTo(S.lmap)
                .bindTooltip(`🚉 ${st.name}`,{direction:'top',className:'',offset:[0,-4]});
      S.metroLayers.push(mk);
    });
    // Legend item
    const li=document.createElement('div');li.className='ml-item';
    li.innerHTML=`<div class="ml-dot" style="background:${line.color}"></div><span>${line.name}</span>`;
    legend.appendChild(li);
  });
}

function clearMetroLayers(){
  S.metroLayers.forEach(l=>S.lmap&&S.lmap.removeLayer(l));
  S.metroLayers=[];
  document.getElementById('metroLegend').style.display='none';
}
function clearRouteLayers(){
  S.routeLayers.forEach(l=>S.lmap&&S.lmap.removeLayer(l));
  S.routeLayers=[];
  if(S.fromMarker){S.lmap&&S.lmap.removeLayer(S.fromMarker);S.fromMarker=null;}
  if(S.toMarker){S.lmap&&S.lmap.removeLayer(S.toMarker);S.toMarker=null;}
}

function mapLayer(v){
  S.mapView=v;
  ['route','metro','all'].forEach(x=>{
    const b=document.getElementById('btn'+x.charAt(0).toUpperCase()+x.slice(1));
    if(b) b.classList.toggle('active',x===v);
  });
  if(v==='route'){ clearMetroLayers(); if(S.route) redrawRoute(); }
  else if(v==='metro'){ clearRouteLayers(); clearMetroLayers(); if(S.city) drawMetroLines(S.city.id); }
  else { if(S.city) drawMetroLines(S.city.id); if(S.route) redrawRoute(); }
}

function redrawRoute(){
  if(!S.route||!S.from||!S.to) return;
  clearRouteLayers();
  const lls=S.route.coords.map(c=>[c[1],c[0]]);
  const sh=L.polyline(lls,{color:'#0a3880',weight:8,opacity:.45}).addTo(S.lmap);
  const rp=L.polyline(lls,{color:'#1a6ef5',weight:4,opacity:1}).addTo(S.lmap);
  S.routeLayers.push(sh,rp);
  const mkF=L.divIcon({className:'',iconSize:[16,16],iconAnchor:[8,8],
    html:'<div style="width:16px;height:16px;border-radius:50%;background:#1a6ef5;border:3px solid #fff;box-shadow:0 2px 8px rgba(26,110,245,.8)"></div>'});
  const mkT=L.divIcon({className:'',iconSize:[16,16],iconAnchor:[8,8],
    html:'<div style="width:16px;height:16px;border-radius:50%;background:#12b76a;border:3px solid #fff;box-shadow:0 2px 8px rgba(18,183,106,.8)"></div>'});
  S.fromMarker=L.marker([S.from.lat,S.from.lng],{icon:mkF}).addTo(S.lmap).bindTooltip(S.from.name,{permanent:false,direction:'top'});
  S.toMarker=L.marker([S.to.lat,S.to.lng],{icon:mkT}).addTo(S.lmap).bindTooltip(S.to.name,{permanent:false,direction:'top'});
  S.routeLayers.push(S.fromMarker,S.toMarker);
  S.lmap.fitBounds(L.latLngBounds(lls).pad(0.22));
  S.lmap.invalidateSize();
  document.getElementById('mhint').classList.add('hide');
}

// ═══════════════════════════════════════════════════════════════
// CITY SELECT
// ═══════════════════════════════════════════════════════════════
function selectCity(c){
  S.city=c;S.from=null;S.to=null;S.route=null;S.mapView='route';
  document.getElementById('cpillTxt').textContent=c.name;
  document.getElementById('fromTxt').textContent='From — Starting point';
  document.getElementById('fromTxt').classList.remove('v');
  document.getElementById('toTxt').textContent='To — Destination';
  document.getElementById('toTxt').classList.remove('v');
  document.getElementById('goBtn').disabled=true;
  document.getElementById('goBtnTxt').textContent='Select Locations';
  document.getElementById('distBan').style.display='none';
  document.getElementById('tSec').style.display='none';
  document.getElementById('rSec').style.display='none';
  document.getElementById('mhint').classList.remove('hide');
  document.getElementById('mapCtrl').style.display='none';
  clearRouteLayers();clearMetroLayers();
  ['route','metro','all'].forEach(x=>{
    const b=document.getElementById('btn'+x.charAt(0).toUpperCase()+x.slice(1));
    if(b)b.classList.toggle('active',x==='route');
  });
  if(S.lmap){S.lmap.setView([c.lat,c.lng],13);setTimeout(()=>S.lmap.invalidateSize(),200);}
  document.getElementById('scCity').classList.add('off');
  document.getElementById('scApp').classList.remove('off');
  renderAccount();switchTab('home');
}
function goCity(){
  document.getElementById('scApp').classList.add('off');
  document.getElementById('scCity').classList.remove('off');
}

// ═══════════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════════
function switchTab(t){
  ['home','recent','account'].forEach(id=>{
    document.getElementById('tp-'+id).classList.toggle('on',id===t);
    document.getElementById('nb-'+id).classList.toggle('on',id===t);
  });
  if(t==='recent') renderRecent();
  if(t==='account') renderAccount();
  if(t==='home'&&S.lmap) setTimeout(()=>S.lmap.invalidateSize(),50);
}

// ═══════════════════════════════════════════════════════════════
// SEARCH SHEET
// ═══════════════════════════════════════════════════════════════
function openSheet(type){
  S.searchType=type;
  document.getElementById('sheetTitle').textContent=type==='from'?'📍 Starting Point':'🏁 Destination';
  document.getElementById('sheetInp').value='';
  document.getElementById('placeList').innerHTML='';
  document.getElementById('sLoad').style.display='none';
  document.getElementById('sheetOv').classList.add('open');
  buildPlaceItems(PLACES[S.city?.id]||[]);
  setTimeout(()=>document.getElementById('sheetInp').focus(),220);
}
function closeSheet(e){
  if(!e||e.target===document.getElementById('sheetOv')){
    document.getElementById('sheetOv').classList.remove('open');
    clearTimeout(S.searchTimer);
  }
}

// Check if a place is a metro station
function isMetroStation(lat,lng,cityId){
  const cm=METRO[cityId];if(!cm)return null;
  for(const line of cm.lines){
    for(const st of line.stations){
      const d=hav(lat,lng,st.lat,st.lng);
      if(d<0.4) return{station:st,line:line};
    }
  }
  return null;
}

function buildPlaceItems(arr){
  const list=document.getElementById('placeList');
  list.innerHTML='';
  if(!arr.length){list.innerHTML='<div style="padding:18px;text-align:center;color:var(--muted);font-size:13px">No results found</div>';return;}
  arr.forEach(p=>{
    const d=document.createElement('div');d.className='pi';
    const col=S.searchType==='from'?'var(--blue)':'var(--green)';
    const metro=isMetroStation(p.lat,p.lng,S.city?.id);
    d.innerHTML=`<span class="pd" style="background:${col}"></span>
      <div><div class="pm">${p.name}${metro?`<span class="metro-badge-sm" style="border-color:${metro.line.color};color:${metro.line.color};background:${metro.line.color}22">🚇 ${metro.line.id}</span>`:''}
      </div><div class="ps">${p.addr||''}</div></div>`;
    d.onclick=()=>pickPlace(p);
    list.appendChild(d);
  });
}

function onSearch(q){
  clearTimeout(S.searchTimer);
  if(q.length<2){buildPlaceItems(PLACES[S.city?.id]||[]);return;}
  // First filter local DB
  const local=(PLACES[S.city?.id]||[]).filter(p=>p.name.toLowerCase().includes(q.toLowerCase())||p.addr.toLowerCase().includes(q.toLowerCase()));
  if(local.length) buildPlaceItems(local);
  // Then also hit Nominatim
  document.getElementById('sLoad').style.display='block';
  S.searchTimer=setTimeout(()=>nominatim(q),400);
}

async function nominatim(q){
  const c=S.city;
  try{
    const r=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q+', '+c.name+', India')}&format=json&limit=8&addressdetails=1&accept-language=en`,
      {headers:{'User-Agent':'FairFareApp/1.0'}});
    const data=await r.json();
    document.getElementById('sLoad').style.display='none';
    const results=data.map(x=>({
      name:x.name||x.display_name.split(',')[0],
      addr:x.display_name.split(',').slice(1,3).join(',').trim(),
      lat:parseFloat(x.lat),lng:parseFloat(x.lon)
    }));
    const local=(PLACES[c.id]||[]).filter(p=>p.name.toLowerCase().includes(q.toLowerCase()));
    // Merge: local first, then API results not already in local
    const merged=[...local,...results.filter(r=>!local.find(l=>l.name===r.name))];
    buildPlaceItems(merged);
  }catch{
    document.getElementById('sLoad').style.display='none';
  }
}

function pickPlace(p){
  const loc={name:p.name,addr:p.addr||'',lat:p.lat,lng:p.lng};
  if(S.searchType==='from'){S.from=loc;document.getElementById('fromTxt').textContent=loc.name;document.getElementById('fromTxt').classList.add('v');}
  else{S.to=loc;document.getElementById('toTxt').textContent=loc.name;document.getElementById('toTxt').classList.add('v');}
  document.getElementById('sheetOv').classList.remove('open');
  updateGoBtn();
}
function updateGoBtn(){
  const btn=document.getElementById('goBtn'),txt=document.getElementById('goBtnTxt');
  if(S.from&&S.to){btn.disabled=false;txt.textContent='Get Routes';}
  else if(!S.from){btn.disabled=true;txt.textContent='Select Starting Point';}
  else{btn.disabled=true;txt.textContent='Select Destination';}
}
function doSwap(){
  [S.from,S.to]=[S.to,S.from];
  const ft=document.getElementById('fromTxt'),tt=document.getElementById('toTxt');
  if(S.from){ft.textContent=S.from.name;ft.classList.add('v');}else{ft.textContent='From — Starting point';ft.classList.remove('v');}
  if(S.to){tt.textContent=S.to.name;tt.classList.add('v');}else{tt.textContent='To — Destination';tt.classList.remove('v');}
  updateGoBtn();
  if(S.from&&S.to) getRoutes();
}

// ═══════════════════════════════════════════════════════════════
// HAVERSINE & BEZIER
// ═══════════════════════════════════════════════════════════════
function hav(la1,lo1,la2,lo2){
  const R=6371,dLa=(la2-la1)*Math.PI/180,dLo=(lo2-lo1)*Math.PI/180;
  const a=Math.sin(dLa/2)**2+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dLo/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
function bezier(from,to,n=50){
  const ml=(from.lat+to.lat)/2+(to.lng-from.lng)*0.09;
  const mg=(from.lng+to.lng)/2-(to.lat-from.lat)*0.09;
  return Array.from({length:n+1},(_,i)=>{const t=i/n;return[(1-t)**2*from.lng+2*(1-t)*t*mg+t**2*to.lng,(1-t)**2*from.lat+2*(1-t)*t*ml+t**2*to.lat];});
}
function timeout(url,ms=6000){
  const ctrl=new AbortController();const id=setTimeout(()=>ctrl.abort(),ms);
  return fetch(url,{signal:ctrl.signal}).finally(()=>clearTimeout(id));
}

// ═══════════════════════════════════════════════════════════════
// METRO ROUTING — find nearest stations + build step guidance
// ═══════════════════════════════════════════════════════════════
function findNearestStation(lat,lng,cityId){
  const cm=METRO[cityId];if(!cm)return null;
  let best=null,bestDist=999;
  cm.lines.forEach(line=>{
    line.stations.forEach(st=>{
      const d=hav(lat,lng,st.lat,st.lng);
      if(d<bestDist){bestDist=d;best={station:st,line:line,dist:d};}
    });
  });
  return best;
}

function buildMetroRoute(from,to,cityId){
  const cm=METRO[cityId];if(!cm)return null;
  const nearFrom=findNearestStation(from.lat,from.lng,cityId);
  const nearTo=findNearestStation(to.lat,to.lng,cityId);
  if(!nearFrom||!nearTo)return null;
  if(nearFrom.dist>3||nearTo.dist>3)return null; // too far from metro

  // Check if both on same line
  let sameLine=null,fromIdx=-1,toIdx=-1;
  cm.lines.forEach(line=>{
    const fi=line.stations.findIndex(s=>s.id===nearFrom.station.id);
    const ti=line.stations.findIndex(s=>s.id===nearTo.station.id);
    if(fi!==-1&&ti!==-1){sameLine=line;fromIdx=fi;toIdx=ti;}
  });

  if(sameLine){
    const start=Math.min(fromIdx,toIdx),end=Math.max(fromIdx,toIdx);
    const stopsOnRoute=sameLine.stations.slice(start,end+1);
    const numStops=stopsOnRoute.length-1;
    const totalDist=stopsOnRoute.reduce((acc,st,i)=>i===0?acc:acc+hav(stopsOnRoute[i-1].lat,stopsOnRoute[i-1].lng,st.lat,st.lng),0);
    return{
      type:'direct',line:sameLine,
      fromStation:nearFrom.station,toStation:nearTo.station,
      walkToFrom:nearFrom.dist,walkFromTo:nearTo.dist,
      stops:stopsOnRoute,numStops,totalDist
    };
  }

  // Try interchange — find common station across lines
  for(const lineA of cm.lines){
    for(const lineB of cm.lines){
      if(lineA.id===lineB.id)continue;
      for(const stA of lineA.stations){
        for(const stB of lineB.stations){
          if(stA.id===stB.id){ // interchange
            const fiA=lineA.stations.findIndex(s=>s.id===nearFrom.station.id);
            const interA=lineA.stations.findIndex(s=>s.id===stA.id);
            const interB=lineB.stations.findIndex(s=>s.id===stB.id);
            const tiB=lineB.stations.findIndex(s=>s.id===nearTo.station.id);
            if(fiA!==-1&&interA!==-1&&interB!==-1&&tiB!==-1){
              const seg1=lineA.stations.slice(Math.min(fiA,interA),Math.max(fiA,interA)+1);
              const seg2=lineB.stations.slice(Math.min(interB,tiB),Math.max(interB,tiB)+1);
              return{
                type:'transfer',
                lineA,lineB,interchange:{station:stA,name:stA.name},
                fromStation:nearFrom.station,toStation:nearTo.station,
                walkToFrom:nearFrom.dist,walkFromTo:nearTo.dist,
                seg1,seg2
              };
            }
          }
        }
      }
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════
// GET ROUTES
// ═══════════════════════════════════════════════════════════════
async function getRoutes(){
  if(!S.from||!S.to)return;
  const btn=document.getElementById('goBtn');
  btn.disabled=true;btn.classList.add('spin');
  document.getElementById('goBtnTxt').textContent='Finding routes…';

  let distKm,durMin,coords;
  try{
    const url=`https://router.project-osrm.org/route/v1/driving/${S.from.lng},${S.from.lat};${S.to.lng},${S.to.lat}?overview=full&geometries=geojson`;
    const res=await timeout(url,6000);const d=await res.json();
    if(d.code==='Ok'&&d.routes?.length){
      distKm=d.routes[0].distance/1000;durMin=Math.round(d.routes[0].duration/60);
      coords=d.routes[0].geometry.coordinates;
    }else throw 0;
  }catch{
    const st=hav(S.from.lat,S.from.lng,S.to.lat,S.to.lng);
    distKm=+(st*1.35).toFixed(2);durMin=Math.max(3,Math.round(distKm/25*60));
    coords=bezier(S.from,S.to);
  }

  S.route={distKm,durMin,coords};

  // Draw route + show map controls
  redrawRoute();
  document.getElementById('mapCtrl').style.display='flex';

  // Distance banner
  document.getElementById('distBan').style.display='flex';
  document.getElementById('dDist').textContent=distKm<1?Math.round(distKm*1000)+' m':distKm.toFixed(1)+' km';
  document.getElementById('dTime').textContent=durMin<60?durMin+' min':Math.floor(durMin/60)+'h '+durMin%60+'m';
  const f=fares(distKm,S.city);
  document.getElementById('dFare').textContent='₹'+Math.min(f.bus,f.auto);

  // Transport + routes
  document.getElementById('tSec').style.display='block';
  document.getElementById('metro-na').textContent=S.city.metro?'':'N/A';
  S.mode=S.city.metro&&distKm>1.5?'metro':'bus';
  selMode(S.mode);
  saveRecent(distKm,durMin);

  btn.disabled=false;btn.classList.remove('spin');
  document.getElementById('goBtnTxt').textContent='Update Routes';
}

// ═══════════════════════════════════════════════════════════════
// FARES
// ═══════════════════════════════════════════════════════════════
function fares(d,city){
  const bus=Math.round(Math.max(10,8+d*2.2));
  const auto=Math.round(d<=1.5?30:30+(d-1.5)*12);
  let metro=null;
  if(city.metro) metro=d<=2?10:d<=5?15:d<=12?20:d<=21?30:40;
  return{bus,auto,metro,ola:Math.round(49+Math.max(0,d-2)*11),uber:Math.round(49+Math.max(0,d-2)*12),olaAuto:Math.round(25+d*9)};
}
function eta(){return{ola:(2+Math.floor(Math.random()*5))+' min',uber:(3+Math.floor(Math.random()*5))+' min',auto:(1+Math.floor(Math.random()*3))+' min'};}

// ═══════════════════════════════════════════════════════════════
// MODE + ROUTE CARDS
// ═══════════════════════════════════════════════════════════════
function selMode(m){
  S.mode=m;
  ['metro','bus','taxi'].forEach(id=>{
    const el=document.getElementById('tb-'+id);
    el.className='tb'+(m===id?' s'+(id==='metro'?'m':id==='bus'?'b2':'t'):'');
  });
  document.getElementById('rSec').style.display='block';
  const {distKm,durMin}=S.route;
  const f=fares(distKm,S.city);const e=eta();
  document.getElementById('rHead').textContent=S.from.name+' → '+S.to.name;
  const box=document.getElementById('rContent');box.innerHTML='';
  if(m==='metro'){
    if(!S.city.metro){box.innerHTML='<div class="uc">🚇 Metro not available in '+S.city.name+'.<br><span style="font-size:11px">Try Bus or Taxi.</span></div>';}
    else{
      const mr=buildMetroRoute(S.from,S.to,S.city.id);
      box.appendChild(metroCard(distKm,durMin,f.metro,mr));
      box.appendChild(comboCard(distKm,Math.round(durMin*1.4),f));
    }
  }else if(m==='bus'){
    box.appendChild(busCard(distKm,Math.round(durMin*1.4),f.bus));
    if(distKm>4) box.appendChild(comboCard(distKm,Math.round(durMin*1.4),f));
  }else{
    box.appendChild(taxiCard(distKm,durMin,f,e));
  }
}

function step(dot,hasLine,txt,tag=''){
  return`<div class="st2">
    <div class="stk"><div class="sd" style="background:${dot}"></div>${hasLine?'<div class="sl2"></div>':''}</div>
    <div><div class="stxt">${txt}</div>${tag?'<div class="stag">'+tag+'</div>':''}</div>
  </div>`;
}

function metroCard(distKm,durMin,fare,mr){
  const el=document.createElement('div');el.className='rc';

  if(!mr){
    // No metro route found — show generic + nearest station tip
    const nearest=findNearestStation(S.from.lat,S.from.lng,S.city.id);
    const nearestTo=findNearestStation(S.to.lat,S.to.lng,S.city.id);
    const walkMin1=nearest?Math.round(nearest.dist/0.08):'-';
    const walkMin2=nearestTo?Math.round(nearestTo.dist/0.08):'-';
    el.innerHTML=`<div class="rch"><div class="ri" style="background:rgba(26,110,245,.14);color:var(--blue)">🚇</div>
      <div class="rm"><div class="rt">Metro Route</div><div class="rst"><span class="rss">⏱ Nearest station info below</span></div></div>
      <div class="rp">₹${fare||'—'}</div></div>
      <div class="sw">
        ${nearest?step('var(--blue)',true,`Walk ~${walkMin1} min (${nearest.dist.toFixed(1)} km) to <b>${nearest.station.name}</b>`,`${nearest.line.name} · Station code ${nearest.station.id}`):''}
        ${step('var(--blue)',true,'No direct metro between these points','Consider bus + metro combination')}
        ${nearestTo?step('var(--green)',false,`Alight and walk ~${walkMin2} min to <b>${S.to.name}</b>`,`Nearest: ${nearestTo.station.name}`):step('var(--green)',false,'Reach destination by auto/walk','')}
      </div>
      <div class="rftr"><span class="eco">🌿 Best eco option</span></div>`;
    return el;
  }

  if(mr.type==='direct'){
    const dur=Math.round(mr.totalDist/0.5); // ~30 km/h metro
    const walkFare=Math.round(mr.walkToFrom*12+mr.walkFromTo*12);
    const totalFare=(fare||0)+walkFare;
    const stationChips=mr.stops.map(s=>`<span class="station-chip">${s.name}</span>`).join('');
    el.innerHTML=`<div class="rch">
      <div class="ri" style="background:rgba(26,110,245,.14);color:var(--blue)">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/></svg>
      </div>
      <div class="rm">
        <div class="rt">Metro — Direct <span style="font-size:11px;color:${mr.line.color};font-weight:700;margin-left:4px">${mr.line.name}</span></div>
        <div class="rst">
          <span class="rss">⏱ ~${Math.round(mr.walkToFrom/0.08)+dur+Math.round(mr.walkFromTo/0.08)} min</span>
          <span class="rss">🚉 ${mr.numStops} stop${mr.numStops>1?'s':''}</span>
          <span class="rss">📏 ${mr.totalDist.toFixed(1)} km</span>
        </div>
      </div>
      <div class="rp">₹${totalFare}</div>
    </div>
    <div class="sw">
      ${step('var(--muted)',true,`Walk <b>${mr.walkToFrom.toFixed(1)} km</b> (~${Math.round(mr.walkToFrom/0.08)} min) from <b>${S.from.name}</b>`,'')}
      ${step(mr.line.color,true,`Board at <b>${mr.fromStation.name}</b>`,`${mr.line.name} · Code: ${mr.fromStation.id} · Token ₹${fare}`)}
      <div class="st2"><div class="stk"><div class="sd" style="background:var(--border2)"></div><div class="sl2"></div></div>
        <div><div class="stxt" style="color:var(--muted);font-size:12px">Stops en route:</div>
        <div style="margin-top:4px;line-height:1.8">${stationChips}</div></div>
      </div>
      ${step(mr.line.color,true,`Alight at <b>${mr.toStation.name}</b>`,`Exit towards ${S.to.name}`)}
      ${step('var(--green)',false,`Walk <b>${mr.walkFromTo.toFixed(1)} km</b> (~${Math.round(mr.walkFromTo/0.08)} min) to <b>${S.to.name}</b>`,'')}
    </div>
    <div class="rftr"><span class="eco">🌿 Saves ~${(distKm*0.08).toFixed(2)} kg CO₂</span></div>`;
  } else {
    // Transfer route
    const chips1=mr.seg1.map(s=>`<span class="station-chip" style="border-color:${mr.lineA.color}44;color:${mr.lineA.color};background:${mr.lineA.color}18">${s.name}</span>`).join('');
    const chips2=mr.seg2.map(s=>`<span class="station-chip" style="border-color:${mr.lineB.color}44;color:${mr.lineB.color};background:${mr.lineB.color}18">${s.name}</span>`).join('');
    el.innerHTML=`<div class="rch">
      <div class="ri" style="background:rgba(26,110,245,.14);color:var(--blue)">🔀</div>
      <div class="rm"><div class="rt">Metro — 1 Transfer</div>
      <div class="rst"><span class="rss" style="color:${mr.lineA.color}">${mr.lineA.name}</span><span class="rss">→</span><span class="rss" style="color:${mr.lineB.color}">${mr.lineB.name}</span></div></div>
      <div class="rp">₹${fare||20}</div></div>
    <div class="sw">
      ${step('var(--muted)',true,`Walk ~${Math.round(mr.walkToFrom/0.08)} min to <b>${mr.fromStation.name}</b>`,'')}
      ${step(mr.lineA.color,true,`Board <b>${mr.lineA.name}</b> at <b>${mr.fromStation.name}</b>`,'')}
      <div class="st2"><div class="stk"><div class="sd" style="background:${mr.lineA.color}88"></div><div class="sl2"></div></div>
        <div><div class="stxt" style="font-size:11px;color:var(--muted)">Via:</div><div style="margin-top:3px">${chips1}</div></div></div>
      ${step(mr.lineA.color,true,`Transfer at <b>${mr.interchange.name}</b>`,`Change to ${mr.lineB.name}`)}
      ${step(mr.lineB.color,true,`Board <b>${mr.lineB.name}</b>`,'')}
      <div class="st2"><div class="stk"><div class="sd" style="background:${mr.lineB.color}88"></div><div class="sl2"></div></div>
        <div><div class="stxt" style="font-size:11px;color:var(--muted)">Via:</div><div style="margin-top:3px">${chips2}</div></div></div>
      ${step(mr.lineB.color,true,`Alight at <b>${mr.toStation.name}</b>`,'')}
      ${step('var(--green)',false,`Walk ~${Math.round(mr.walkFromTo/0.08)} min to <b>${S.to.name}</b>`,'')}
    </div>
    <div class="rftr"><span class="eco">🌿 Eco choice</span></div>`;
  }
  return el;
}

function busCard(d,dur,fare){
  const el=document.createElement('div');el.className='rc';
  el.innerHTML=`<div class="rch"><div class="ri" style="background:rgba(18,183,106,.14);color:var(--green)">
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM20 6v5H4V6h16zm-4-2H8V3h8v1z"/></svg></div>
  <div class="rm"><div class="rt">City Bus</div>
  <div class="rst"><span class="rss">⏱ ~${dur} min</span><span class="rss">📏 ${d.toFixed(1)} km</span></div></div>
  <div class="rp">₹${fare}</div></div>
  <div class="sw">
    ${step('var(--green)',true,'Walk to nearest City Bus stop near <b>'+S.from.name+'</b>','')}
    ${step('var(--green)',true,'Board bus towards <b>'+S.to.name+'</b>','₹'+fare+' · Pay conductor · ~'+Math.round(d/0.5)+' stops')}
    ${step('var(--blue)',false,'Alight at stop closest to <b>'+S.to.name+'</b>','')}
  </div>
  <div class="rftr"><span class="eco">🌿 ${(d*.065).toFixed(2)} kg CO₂</span></div>`;
  return el;
}

function comboCard(d,dur,f){
  const combo=Math.round(f.bus*.6+f.auto*.5);
  const el=document.createElement('div');el.className='rc';
  el.innerHTML=`<div class="rch" style="border-bottom-color:rgba(245,158,11,.15)">
    <div class="ri" style="background:rgba(245,158,11,.12);color:var(--amber);font-size:18px">⚡</div>
    <div class="rm"><div class="rt">Mixed Route</div>
    <div class="rst"><span class="rss">⏱ ~${Math.round(dur*.85)} min</span><span class="rss">🔀 Bus + Auto</span></div></div>
    <div class="rp" style="color:var(--amber);border-color:rgba(245,158,11,.3);background:rgba(245,158,11,.08)">₹${combo}</div></div>
  <div class="sw">
    ${step('var(--green)',true,'Board City Bus from <b>'+S.from.name+'</b>','₹'+Math.round(f.bus*.6)+' approx')}
    ${step('var(--amber)',true,'Alight at midpoint / major junction','')}
    ${step('var(--blue)',false,'Take Auto-Rickshaw to <b>'+S.to.name+'</b>','₹'+Math.round(f.auto*.5)+' approx')}
  </div>`;
  return el;
}

function taxiCard(d,dur,f,e){
  const el=document.createElement('div');el.className='rc';
  el.innerHTML=`<div class="rch"><div class="ri" style="background:rgba(6,182,212,.14);color:var(--cyan)">
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H15V3H9v2H6.5c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg></div>
  <div class="rm"><div class="rt">Taxi & Auto Options</div>
  <div class="rst"><span class="rss">⏱ ~${dur} min</span><span class="rss">🛣 ${d.toFixed(1)} km</span></div></div></div>
  <div class="cr">
    <div class="co"><div class="cem">🟢</div><div class="cn2">Ola Mini</div><div class="cp">₹${f.ola}</div><div class="ceta">ETA ${e.ola}</div></div>
    <div class="co"><div class="cem">⬛</div><div class="cn2">Uber Go</div><div class="cp">₹${f.uber}</div><div class="ceta">ETA ${e.uber}</div></div>
    <div class="co"><div class="cem">🛺</div><div class="cn2">Auto</div><div class="cp">₹${f.auto}</div><div class="ceta">ETA ${e.auto}</div></div>
  </div>
  <div class="sw" style="padding-top:0">
    ${step('var(--cyan)',true,'Book via Ola/Uber app or hail Auto from <b>'+S.from.name+'</b>','')}
    ${step('var(--green)',false,'Direct ride to <b>'+S.to.name+'</b>','Ola Auto: ₹'+f.olaAuto+' · Shared Auto: ₹'+Math.round(f.auto*.45))}
  </div>
  <div class="rftr" style="justify-content:space-between;align-items:center">
    <span style="font-size:11px;color:var(--muted)">Surge pricing may apply</span>
    <span class="eco" style="color:var(--red);background:rgba(239,68,68,.08)">🔥 ${(d*.12).toFixed(2)} kg CO₂</span>
  </div>`;
  return el;
}

// ═══════════════════════════════════════════════════════════════
// RECENT
// ═══════════════════════════════════════════════════════════════
function saveRecent(d,dur){
  const f=fares(d,S.city);
  const e={fromName:S.from.name,toName:S.to.name,fromLoc:S.from,toLoc:S.to,
    dist:d,dur,cityId:S.city.id,cityName:S.city.name,metro:S.city.metro,
    minFare:Math.min(f.bus,f.auto),time:new Date().toISOString()};
  S.recent=[e,...S.recent.filter(r=>!(r.fromName===S.from.name&&r.toName===S.to.name))].slice(0,20);
  localStorage.setItem('ff_r',JSON.stringify(S.recent));
}
function renderRecent(){
  const list=document.getElementById('rctList');
  document.getElementById('rctCnt').textContent=S.recent.length+' saved searches';
  list.innerHTML='';
  if(!S.recent.length){list.innerHTML='<div class="es"><div class="es-i">🗺️</div><div class="es-t">No recent searches</div><div class="es-s">Your route history will appear here</div></div>';return;}
  S.recent.forEach(r=>{
    const d=document.createElement('div');d.className='ri2';
    d.innerHTML=`<div class="rr"><span>${r.fromName}</span><span class="ra">›</span><span>${r.toName}</span></div>
    <div class="rcps">${r.metro?'<span class="rcp cm">🚇 Metro</span>':''}<span class="rcp cb">🚌 Bus</span><span class="rcp ct">🚕 Taxi</span></div>
    <div class="rmeta"><span>${getAgo(r.time)}</span><span>${r.dist.toFixed(1)} km · ₹${r.minFare} · ${r.cityName}</span></div>`;
    d.onclick=()=>reloadSearch(r);
    list.appendChild(d);
  });
}
function reloadSearch(r){
  const c=CITIES.find(x=>x.id===r.cityId);
  if(c&&c.id!==S.city?.id) selectCity(c);
  S.from=r.fromLoc;S.to=r.toLoc;
  document.getElementById('fromTxt').textContent=r.fromName;document.getElementById('fromTxt').classList.add('v');
  document.getElementById('toTxt').textContent=r.toName;document.getElementById('toTxt').classList.add('v');
  updateGoBtn();switchTab('home');getRoutes();
}
function getAgo(iso){
  const m=Math.floor((Date.now()-new Date(iso))/60000);
  if(m<1)return'Just now';if(m<60)return m+' min ago';
  const h=Math.floor(m/60);if(h<24)return h+'h ago';return Math.floor(h/24)+'d ago';
}

// ═══════════════════════════════════════════════════════════════
// OTP AUTH ENGINE  (EmailJS + Firebase)
// ═══════════════════════════════════════════════════════════════

// ── Local user store ─────────────────────────────────────────



// ── EmailJS init ───────────────────────────────────────────────
function initEmailJS(){
  const cfg=getCfg(KEYS.ejs);
  if(cfg?.publicKey && window.emailjs){
    emailjs.init(cfg.publicKey);
    return true;
  }
  return false;
}

// ── Firebase init ──────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════
// FIREBASE AUTHENTICATION & DATABASE MODULE
// Complete authentication system with email/phone OTP and Firestore
// ═══════════════════════════════════════════════════════════════

// ═══ FIREBASE INITIALIZATION ═══════════════════════════════════
function initFirebase(){
  const cfg=getCfg(KEYS.fb);
  if(!cfg||!window.firebase) {
    console.log('Firebase not configured');
    return false;
  }
  try{
    if(AUTH.fbApp) try{AUTH.fbApp.delete();}catch{}
    AUTH.fbApp=firebase.initializeApp(cfg,'ff_'+Date.now());
    AUTH.fbAuth=firebase.auth(AUTH.fbApp);
    AUTH.fbDb=firebase.firestore(AUTH.fbApp);
    AUTH.fbAuth.useDeviceLanguage();
    AUTH.fbAuth.onAuthStateChanged(onFBAuthChange);
    console.log('✅ Firebase initialized');
    return true;
  }catch(e){
    console.error('Firebase init failed:',e);
    return false;
  }
}

// ═══ AUTH STATE CHANGE HANDLER ════════════════════════════════
async function onFBAuthChange(fbUser){
  if(!fbUser){
    setCurrentUser(null);
    return;
  }
  // Block auto-login while waiting for OTP verification
  if(AUTH.otpPending){
    console.log('onFBAuthChange: OTP pending — skipping auto-login');
    return;
  }
  console.log('Firebase user signed in:', fbUser.uid);
  try{
    const userDoc = await AUTH.fbDb.collection('users').doc(fbUser.uid).get();
    let userData;
    if(userDoc.exists){
      userData = userDoc.data();
      userData.uid = fbUser.uid;
      userData.id  = fbUser.uid;
    } else {
      userData = {
        uid:fbUser.uid, id:fbUser.uid,
        email:fbUser.email||'', phone:fbUser.phoneNumber||'',
        name:fbUser.displayName||fbUser.email?.split('@')[0]||'User',
        avatar:'😊', photoURL:fbUser.photoURL||null,
        lang:'en', prefs:{notif:true,budget:false,access:false},
        joined:new Date().toISOString(), emailVerified:false
      };
      await AUTH.fbDb.collection('users').doc(fbUser.uid).set(userData);
    }
    setCurrentUser(userData);
    closeAuth();
    renderAccount();
    showToast('Welcome back, '+(userData.name||'Traveller')+' 👋');
  }catch(error){
    console.error('Error in onFBAuthChange:',error);
  }
}

// ═══ EMAIL + PASSWORD REGISTRATION/LOGIN ══════════════════════
async function submitEmailAuth(){
  const email=(document.getElementById('af-email')?.value||'').trim().toLowerCase();
  const pass =document.getElementById('af-pass')?.value||'';
  const name =(document.getElementById('af-name')?.value||'').trim();
  setErr('af-email-err',''); setErr('af-pass-err',''); setErr('af-name-err','');

  if(AUTH.mode==='signup' && !name){ setErr('af-name-err','Please enter your name'); return; }
  if(!validEmail(email)){ setErr('af-email-err','Enter a valid email address'); return; }
  if(pass.length<6){ setErr('af-pass-err','Minimum 6 characters required'); return; }
  if(!AUTH.fbAuth){ showToast('Please configure Firebase first'); renderAuthScreen('settings'); return; }

  const btn=document.getElementById('af-submit');
  setBtnLoading(btn, true, AUTH.mode==='signup'?'Sending OTP...':'Signing In...');

  AUTH.otpPending   = true;
  AUTH.pendingEmail = email;
  AUTH.pendingName  = name;
  AUTH.pendingPass  = pass; // kept only for signup — used after OTP verified

  try{
    if(AUTH.mode==='login'){
      // LOGIN: sign in first, then verify identity with OTP
      await AUTH.fbAuth.signInWithEmailAndPassword(email, pass);
      const sent = await sendEmailOTP(email, name||'User');
      if(sent){
        renderAuthScreen('otp');
        startOtpTimer('otp-timer', 60, ()=>{ AUTH.otpPending=false; AUTH.pendingPass=''; renderAuthScreen('form'); });
        setTimeout(()=>document.getElementById('otp0')?.focus(), 120);
      } else {
        AUTH.otpPending=false; AUTH.pendingPass='';
        setBtnLoading(btn, false, 'Sign In & Verify 📨');
      }
    } else {
      // SIGNUP: send OTP FIRST — create Firebase account only AFTER OTP verified
      // This prevents orphaned accounts when users abandon OTP flow
      const sent = await sendEmailOTP(email, name);
      if(sent){
        renderAuthScreen('otp');
        startOtpTimer('otp-timer', 60, ()=>{ AUTH.otpPending=false; AUTH.pendingPass=''; renderAuthScreen('form'); });
        setTimeout(()=>document.getElementById('otp0')?.focus(), 120);
      } else {
        AUTH.otpPending=false; AUTH.pendingPass='';
        setBtnLoading(btn, false, 'Create Account 📨');
      }
    }
  }catch(err){
    AUTH.otpPending=false; AUTH.pendingEmail=''; AUTH.pendingPass='';
    console.error('Auth error:',err);
    const mapped=fbErrMap(err);
    setErr(mapped.field==='pass'?'af-pass-err':'af-email-err', mapped.msg);
    setBtnLoading(btn, false, AUTH.mode==='login'?'Sign In & Verify 📨':'Create Account 📨');
  }
}

// ═══ EMAIL OTP GENERATION & SENDING ═══════════════════════════
async function sendEmailOTP(email, name){
  const code = String(Math.floor(100000 + Math.random() * 899999));
  // Store ONLY in memory — no Firestore needed, avoids auth permission errors
  AUTH.otpCode   = code;
  AUTH.otpExpiry = Date.now() + 10*60*1000; // 10 min

  // ── Try EmailJS ──────────────────────────────────────────────
  const ejsCfg = getCfg(KEYS.ejs);
  if(ejsCfg?.serviceId && ejsCfg?.templateId && ejsCfg?.publicKey && window.emailjs){
    try{
      emailjs.init(ejsCfg.publicKey);
      await emailjs.send(ejsCfg.serviceId, ejsCfg.templateId, {
        to_email: email,
        to_name:  name || 'User',
        otp_code: code,
        app_name: 'Fair Fare',
        expiry:   '10 minutes'
      });
      showToast('OTP sent to '+email+' 📧');
      return true;
    }catch(e){
      console.error('EmailJS send failed:',e);
      // Fall through to on-screen fallback
    }
  }

  // ── Fallback: show OTP on screen (dev mode) ──────────────────
  console.log('📧 OTP for',email,':',code);
  showOtpFallback(code, email);
  return true;
}

// Show OTP on screen when email service not configured
function showOtpFallback(code, email){
  // Remove any existing fallback
  document.getElementById('otp-fallback-banner')?.remove();
  const banner = document.createElement('div');
  banner.id = 'otp-fallback-banner';
  banner.innerHTML = `
    <div style="background:linear-gradient(135deg,rgba(26,110,245,.18),rgba(18,183,106,.12));
      border:1.5px solid var(--blue);border-radius:14px;padding:14px 16px;margin:0 0 16px;
      text-align:center;animation:slideUp .3s ease">
      <div style="font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;
        letter-spacing:.8px;margin-bottom:6px">Your OTP Code</div>
      <div style="font-family:'Syne',sans-serif;font-size:32px;font-weight:800;
        letter-spacing:8px;color:var(--blue);margin-bottom:6px">${code}</div>
      <div style="font-size:11px;color:var(--muted)">Valid for 10 minutes · Sent to ${email}</div>
      <div style="font-size:10px;color:var(--amber);margin-top:6px">
        ⚠️ Configure EmailJS in Account → Firebase Settings to send real emails
      </div>
    </div>`;
  // Insert it inside the OTP screen, before the otp-wrap div
  const wrap = document.querySelector('.otp-wrap');
  if(wrap) wrap.parentNode.insertBefore(banner, wrap);
}

// ═══ EMAIL OTP VERIFICATION ═══════════════════════════════════
async function verifyEmailOTP(){
  const entered = [0,1,2,3,4,5].map(i=>document.getElementById('otp'+i)?.value||'').join('');
  setErr('otp-err','');
  
  if(Date.now() > AUTH.otpExpiry){
    setErr('otp-err','OTP expired. Please request a new one.');
    return;
  }
  
  if(!AUTH.fbAuth){
    setErr('otp-err','Authentication error. Please try again.');
    return;
  }
  
  try {
    // Verify OTP against in-memory value — no Firestore read needed
    if(!AUTH.otpCode){
      setErr('otp-err','OTP expired or not found. Please request a new one.');
      return;
    }

    if(Date.now() > AUTH.otpExpiry){
      AUTH.otpCode = '';
      setErr('otp-err','OTP expired. Please request a new one.');
      return;
    }

    if(entered !== AUTH.otpCode){
      setErr('otp-err','Incorrect OTP. Please check your email.');
      document.querySelectorAll('.otp-box').forEach(b=>{b.value='';b.classList.add('err');});
      document.getElementById('otp0')?.focus();
      return;
    }

    // OTP verified successfully — clear it immediately
    AUTH.otpCode = '';
    clearInterval(AUTH.otpTimer);

    // Best-effort: clean up any Firestore OTP doc if it exists
    if(AUTH.fbDb && AUTH.pendingEmail){
      AUTH.fbDb.collection('otpCodes').doc(AUTH.pendingEmail).delete().catch(()=>{});
    }

    const isSignup = !AUTH.fbAuth.currentUser && AUTH.pendingPass;

    if(isSignup){
      // SIGNUP: now create the Firebase account (after OTP confirmed)
      try{
        const cred = await AUTH.fbAuth.createUserWithEmailAndPassword(AUTH.pendingEmail, AUTH.pendingPass);
        await cred.user.updateProfile({displayName: AUTH.pendingName||'User'});
        // Create Firestore user doc
        const userData = {
          uid:cred.user.uid, id:cred.user.uid,
          email:AUTH.pendingEmail, phone:'',
          name:AUTH.pendingName||AUTH.pendingEmail.split('@')[0]||'User',
          avatar:'😊', photoURL:null, lang:'en',
          prefs:{notif:true,budget:false,access:false},
          joined:new Date().toISOString(), emailVerified:true
        };
        await AUTH.fbDb.collection('users').doc(cred.user.uid).set(userData);
        AUTH.otpPending = false;
        AUTH.pendingPass = '';
        showToast('Account created! ✅');
        renderAuthScreen('setup');
      }catch(err){
        console.error('Account creation after OTP failed:',err);
        const mapped = fbErrMap(err);
        setErr('otp-err', mapped.msg || 'Account creation failed. Please try again.');
        AUTH.otpPending = false;
        AUTH.pendingPass = '';
      }
    } else {
      // LOGIN: just mark verified and proceed
      if(AUTH.fbAuth.currentUser){
        try{
          await AUTH.fbDb.collection('users').doc(AUTH.fbAuth.currentUser.uid).set({
            emailVerified:true, lastVerified:new Date().toISOString()
          },{merge:true});
        }catch(e){}
      }
      AUTH.otpPending = false;
      AUTH.pendingPass = '';
      showToast('Email verified successfully! ✅');
      if(AUTH.fbAuth.currentUser){
        renderAuthScreen('setup');
      }
    }
    
  } catch(error) {
    console.error('OTP verification error:', error);
    setErr('otp-err','Verification failed. Please try again.');
  }
}

// ═══ PHONE SMS OTP (Firebase Phone Auth) ═════════════════════
async function sendSmsOTP(){
  if(!AUTH.fbAuth){
    showToast('Configure Firebase for SMS OTP');
    renderAuthScreen('settings');
    return;
  }
  
  const raw = document.getElementById('ph-num')?.value.replace(/\D/g,'')||'';
  setErr('ph-err','');
  
  if(raw.length !== 10){
    setErr('ph-err','Enter a valid 10-digit mobile number');
    return;
  }
  
  AUTH.pendingPhone = raw;
  const phoneNumber = '+91' + raw;

  const btn = document.getElementById('ph-send');
  setBtnLoading(btn, true, 'Sending SMS…');
  
  try{
    // Clear previous reCAPTCHA
    if(AUTH.rcVerifier){
      try{AUTH.rcVerifier.clear();}catch{}
      AUTH.rcVerifier = null;
    }
    
    // Create new reCAPTCHA verifier
    AUTH.rcVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-wrap', {
      size: 'normal',
      callback: ()=>{console.log('reCAPTCHA solved');}
    });
    
    await AUTH.rcVerifier.render();
    
    // Send SMS
    AUTH.rcResult = await AUTH.fbAuth.signInWithPhoneNumber(phoneNumber, AUTH.rcVerifier);
    
    showToast('SMS sent to ' + phoneNumber + ' 📲');
    renderAuthScreen('smscode');
    startOtpTimer('sms-timer', 60, ()=>renderAuthScreen('phone'));
    setTimeout(()=>document.getElementById('sms0')?.focus(), 120);
    
  } catch(err) {
    console.error('SMS OTP error:', err);
    const errorMap = {
      'auth/invalid-phone-number': 'Invalid phone number',
      'auth/too-many-requests': 'Too many attempts. Try later.',
      'auth/captcha-check-failed': 'reCAPTCHA failed. Refresh and try.'
    };
    setErr('ph-err', errorMap[err.code] || err.message);
    setBtnLoading(btn, false, 'Send OTP via SMS 📲');
    
    try{
      if(AUTH.rcVerifier) AUTH.rcVerifier.clear();
      AUTH.rcVerifier = null;
    }catch{}
  }
}

// ═══ VERIFY SMS OTP ═══════════════════════════════════════════
async function verifySmsOTP(){
  const code = [0,1,2,3,4,5].map(i=>document.getElementById('sms'+i)?.value||'').join('');
  setErr('sms-err','');
  
  const btn = document.getElementById('sms-verify');
  setBtnLoading(btn, true, 'Verifying…');
  
  try{
    const result = await AUTH.rcResult.confirm(code);
    
    // User signed in successfully
    // Firebase auth state change will handle the rest
    showToast('Phone verified successfully! ✅');
    
  } catch(err) {
    console.error('SMS verification error:', err);
    const errorMap = {
      'auth/invalid-verification-code': 'Incorrect OTP. Try again.',
      'auth/code-expired': 'OTP expired. Request a new one.'
    };
    const msg = errorMap[err.code] || err.message;
    setErr('sms-err', msg);
    
    document.querySelectorAll('#authWrap .otp-box').forEach(b=>{
      b.value='';
      b.classList.add('err');
    });
    document.getElementById('sms0')?.focus();
    setBtnLoading(btn, false, 'Verify SMS OTP ✓');
  }
}

// ═══ GOOGLE SIGN-IN ═══════════════════════════════════════════
async function doGoogleLogin(){
  if(!AUTH.fbAuth){
    showToast('Configure Firebase for Google Sign-In');
    renderAuthScreen('settings');
    return;
  }
  
  try{
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    const result = await AUTH.fbAuth.signInWithPopup(provider);
    
    // User info available in result.user
    showToast('Signed in with Google! ✅');
    
  } catch(err) {
    console.error('Google sign-in error:', err);
    if(err.code === 'auth/popup-blocked') {
      showToast('Please allow popups for this site');
    } else if(err.code !== 'auth/popup-closed-by-user') {
      showToast('Google sign-in failed');
    }
  }
}

// ═══ PASSWORD RESET WITH OTP ══════════════════════════════════
async function doPasswordReset(){
  const email = (document.getElementById('rst-email')?.value||'').trim().toLowerCase();
  setErr('rst-err','');
  
  if(!validEmail(email)){
    setErr('rst-err','Enter a valid email');
    return;
  }
  
  if(!AUTH.fbAuth){
    showToast('Configure Firebase first');
    renderAuthScreen('settings');
    return;
  }
  
  try{
    // Generate OTP and store in memory only
    const code = String(Math.floor(100000 + Math.random() * 899999));
    AUTH.pendingEmail = email;
    AUTH.otpCode      = code;
    AUTH.otpExpiry    = Date.now() + 10*60*1000;

    // Send via EmailJS
    const ejsCfg = getCfg(KEYS.ejs);
    if(ejsCfg?.serviceId && ejsCfg?.templateId && ejsCfg?.publicKey && window.emailjs){
      try{
        emailjs.init(ejsCfg.publicKey);
        await emailjs.send(ejsCfg.serviceId, ejsCfg.templateId, {
          to_email: email, to_name: 'User',
          otp_code: code, app_name: 'Fair Fare', expiry: '10 minutes'
        });
        showToast('Reset code sent to '+email+' 📧');
      }catch(e){
        console.error('EmailJS reset OTP failed:',e);
        showToast('Reset code: '+code+' (EmailJS not configured)');
      }
    } else {
      console.log('🔐 Password Reset OTP for', email, ':', code);
      showToast('Reset code: '+code+' 📨');
    }
    renderAuthScreen('resetotp');
    startOtpTimer('reset-timer', 60, ()=>renderAuthScreen('reset'));
    setTimeout(()=>document.getElementById('rotp0')?.focus(), 120);
    
  } catch(error) {
    console.error('Password reset error:', error);
    setErr('rst-err', 'Failed to send reset code. Please try again.');
  }
}

// ═══ VERIFY RESET OTP & SET NEW PASSWORD ═════════════════════
async function verifyResetOTP(){
  const entered = [0,1,2,3,4,5].map(i=>document.getElementById('rotp'+i)?.value||'').join('');
  setErr('rotp-err','');
  
  try {
    if(!AUTH.otpCode){
      setErr('rotp-err','Reset code expired. Please request a new one.');
      return;
    }
    if(Date.now() > AUTH.otpExpiry){
      AUTH.otpCode = '';
      setErr('rotp-err','Reset code expired. Please request a new one.');
      return;
    }
    if(entered !== AUTH.otpCode){
      setErr('rotp-err','Incorrect reset code.');
      document.querySelectorAll('.otp-box').forEach(b=>{b.value='';b.classList.add('err');});
      document.getElementById('rotp0')?.focus();
      return;
    }
    // Reset OTP verified
    AUTH.otpCode = '';
    clearInterval(AUTH.otpTimer);
    if(AUTH.fbDb && AUTH.pendingEmail){
      AUTH.fbDb.collection('otpCodes').doc(AUTH.pendingEmail).delete().catch(()=>{});
    }
    renderAuthScreen('newpassword');
    
  } catch(error) {
    console.error('Reset OTP verification error:', error);
    setErr('rotp-err','Verification failed. Please try again.');
  }
}

// ═══ SET NEW PASSWORD ═════════════════════════════════════════
async function setNewPassword(){
  const newPass = document.getElementById('new-pass')?.value||'';
  const confirmPass = document.getElementById('confirm-pass')?.value||'';
  
  setErr('newpass-err','');
  
  if(newPass.length < 6){
    setErr('newpass-err','Password must be at least 6 characters');
    return;
  }
  
  if(newPass !== confirmPass){
    setErr('newpass-err','Passwords do not match');
    return;
  }
  
  const btn = document.getElementById('newpass-btn');
  setBtnLoading(btn, true, 'Updating Password...');
  
  try{
    // Use Firebase password reset
    await AUTH.fbAuth.sendPasswordResetEmail(AUTH.pendingEmail);
    
    showToast('Password reset email sent! Check your inbox. 📧');
    AUTH.pendingEmail = '';
    renderAuthScreen('form');
    
  } catch(error) {
    console.error('Password update error:', error);
    setErr('newpass-err', 'Failed to reset password. Please try again.');
    setBtnLoading(btn, false, 'Set New Password');
  }
}

// ═══ PROFILE SETUP/COMPLETION ═════════════════════════════════
async function completeSetup(){
  const name = (document.getElementById('su-name')?.value || AUTH.pendingName || 'User').trim();
  const phone = (document.getElementById('su-phone')?.value || '').trim();
  const avatar = AUTH.pickedAvatar || AVATARS[0];
  
  if(!AUTH.fbAuth?.currentUser){
    showToast('Authentication error. Please sign in again.');
    return;
  }
  
  const btn = document.getElementById('setup-btn');
  setBtnLoading(btn, true, 'Saving Profile...');
  
  try{
    // Update Firebase Auth profile
    await AUTH.fbAuth.currentUser.updateProfile({displayName: name});
    
    // Update Firestore user document
    const uid = AUTH.fbAuth.currentUser.uid;
    await AUTH.fbDb.collection('users').doc(uid).update({
      name: name,
      phone: phone,
      avatar: avatar,
      profileCompleted: true,
      updatedAt: new Date().toISOString()
    });
    
    // Fetch updated user data
    const userDoc = await AUTH.fbDb.collection('users').doc(uid).get();
    const userData = userDoc.data();
    userData.uid = uid;
    userData.id = uid;
    
    AUTH.otpPending = false;
    AUTH.pendingEmail = '';
    setCurrentUser(userData);
    closeAuth();
    renderAccount();
    showToast('Welcome to Fair Fare, ' + name + '! 🚀');
    
  } catch(error) {
    console.error('Profile setup error:', error);
    showToast('Failed to save profile. Please try again.');
    setBtnLoading(btn, false, 'Complete Setup');
  }
}

// ═══ PROFILE UPDATE ══════════════════════════════════════════
async function saveProfile(){
  const user = getCurrentUser();
  if(!user) return;
  
  if(!AUTH.fbAuth?.currentUser){
    showToast('Please sign in to update profile');
    return;
  }
  
  const newName = document.getElementById('epName').value.trim() || user.name;
  const newPhone = document.getElementById('epPhone').value.trim();
  const newLang = document.getElementById('epLang').value;
  const newAvatar = AUTH.pickedAvatar || user.avatar;
  const newPrefs = {...AUTH.prefs};
  
  try{
    // Update Firebase Auth profile
    await AUTH.fbAuth.currentUser.updateProfile({displayName: newName});
    
    // Update Firestore
    await AUTH.fbDb.collection('users').doc(user.uid).update({
      name: newName,
      phone: newPhone,
      lang: newLang,
      avatar: newAvatar,
      prefs: newPrefs,
      updatedAt: new Date().toISOString()
    });
    
    // Update local user object
    user.name = newName;
    user.phone = newPhone;
    user.lang = newLang;
    user.avatar = newAvatar;
    user.prefs = newPrefs;
    
    setCurrentUser(user);
    document.getElementById('epOverlay').classList.remove('open');
    renderAccount();
    showToast('Profile updated ✅');
    
  } catch(error) {
    console.error('Profile update error:', error);
    showToast('Failed to update profile. Please try again.');
  }
}

// ═══ SIGN OUT ═════════════════════════════════════════════════
async function doSignOut(){
  try{
    if(AUTH.fbAuth) {
      await AUTH.fbAuth.signOut();
    }
    setCurrentUser(null);
    renderAccount();
    showToast('Signed out successfully');
  } catch(error) {
    console.error('Sign out error:', error);
    showToast('Error signing out');
  }
}

// ═══ USER DATA MANAGEMENT ════════════════════════════════════
// Keep user data in memory for quick access
function getCurrentUser(){
  return JSON.parse(sessionStorage.getItem('ff_cu') || 'null');
}

function setCurrentUser(user){
  if(user) {
    sessionStorage.setItem('ff_cu', JSON.stringify(user));
  } else {
    sessionStorage.removeItem('ff_cu');
  }
}

// Deprecated - no longer using localStorage for users list
function getUsers(){ return []; }
function saveUsers(u){ return; }

// ═══════════════════════════════════════════════════════════════
// AUTHENTICATION UI SCREENS
// ═══════════════════════════════════════════════════════════════

// ═══ MAIN AUTH FORM (Login/Signup) ════════════════════════════
function authFormHTML(){
  const isLogin = AUTH.mode === 'login';
  const title = isLogin ? 'Welcome Back!' : 'Create Account';
  const subtitle = isLogin ? 'Sign in to access your saved routes' : 'Join Fair Fare to save routes & get personalized recommendations';
  
  return `
<div class="auth-form">
  <div class="auth-logo">🚇</div>
  <div class="auth-title">${title}</div>
  <div class="auth-subtitle">${subtitle}</div>
  
  ${!isLogin ? `
  <div class="auth-field">
    <label class="auth-label">Full Name</label>
    <input class="auth-inp" id="af-name" placeholder="Enter your name" autocomplete="name"/>
    <div class="auth-err" id="af-name-err"></div>
  </div>` : ''}
  
  <div class="auth-field">
    <label class="auth-label">Email Address</label>
    <input class="auth-inp" id="af-email" type="email" placeholder="you@example.com" autocomplete="email"/>
    <div class="auth-err" id="af-email-err"></div>
  </div>
  
  <div class="auth-field">
    <label class="auth-label">Password</label>
    <div style="position:relative">
      <input class="auth-inp" id="af-pass" type="password" placeholder="••••••••" autocomplete="${isLogin?'current-password':'new-password'}" ${isLogin?'':'oninput="pwStrength(this)"'}/>
      <div class="pw-eye" onclick="togglePw('af-pass',this)">👁</div>
    </div>
    ${!isLogin?'<div class="pw-strength" id="pw-str"></div>':''}
    <div class="auth-err" id="af-pass-err"></div>
  </div>
  
  ${isLogin ? `<div class="auth-forgot" onclick="renderAuthScreen('reset')">Forgot password?</div>` : ''}
  
  <button class="auth-btn" id="af-submit" onclick="submitEmailAuth()">${isLogin?'Sign In & Verify 📨':'Create Account 📨'}</button>
  
  <div class="auth-divider"><span>OR</span></div>
  
  ${AUTH.fbAuth ? `
  <button class="auth-google" onclick="doGoogleLogin()">
    <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
    Continue with Google
  </button>
  
  <button class="auth-phone" onclick="renderAuthScreen('phone')">
    📱 Sign in with Phone
  </button>
  ` : `
  <div class="auth-notice">
    🔒 <strong>Firebase not configured.</strong><br/>
    <a href="#" onclick="renderAuthScreen('settings');return false;" style="color:var(--blue)">Set up Firebase</a> to enable Google Sign-In and Phone authentication.
  </div>
  `}
  
  <div class="auth-switch">
    ${isLogin 
      ? `Don't have an account? <span onclick="AUTH.mode='signup';renderAuthScreen('form')">Sign up</span>` 
      : `Already have an account? <span onclick="AUTH.mode='login';renderAuthScreen('form')">Sign in</span>`}
  </div>
</div>`;
}

// ═══ EMAIL OTP VERIFICATION ═══════════════════════════════════
function authOtpHTML(){
  return `
<div class="auth-form">
  <div class="auth-back" onclick="renderAuthScreen('form')">← Back</div>
  <div class="auth-logo">📧</div>
  <div class="auth-title">Verify Your Email</div>
  <div class="auth-subtitle">Enter the 6-digit code sent to<br/><strong>${AUTH.pendingEmail}</strong></div>
  
  <div class="otp-wrap">
    ${[0,1,2,3,4,5].map(i=>`<input class="otp-box" id="otp${i}" maxlength="1" type="tel" oninput="otpIn(this,${i})" onkeydown="otpBack(event,${i})"/>`).join('')}
  </div>
  <div class="auth-err" id="otp-err"></div>
  
  <button class="auth-btn" id="otp-verify" disabled onclick="verifyEmailOTP()">Verify Email ✓</button>
  
  <div class="auth-timer" id="otp-timer">Resend in 60s</div>
</div>`;
}

// ═══ PHONE NUMBER INPUT ══════════════════════════════════════
function authPhoneHTML(){
  return `
<div class="auth-form">
  <div class="auth-back" onclick="renderAuthScreen('form')">← Back</div>
  <div class="auth-logo">📱</div>
  <div class="auth-title">Phone Sign-In</div>
  <div class="auth-subtitle">Enter your mobile number to receive an OTP</div>
  
  <div class="auth-field">
    <label class="auth-label">Mobile Number</label>
    <div style="display:flex;gap:8px">
      <div class="auth-inp" style="width:70px;text-align:center;background:var(--s2);cursor:default">+91 🇮🇳</div>
      <input class="auth-inp" id="ph-num" type="tel" placeholder="9876543210" maxlength="10" style="flex:1"/>
    </div>
    <div class="auth-err" id="ph-err"></div>
  </div>
  
  <div id="recaptcha-wrap" style="margin:16px 0;display:flex;justify-content:center"></div>
  
  <button class="auth-btn" id="ph-send" onclick="sendSmsOTP()">Send OTP via SMS 📲</button>
  
  <div class="auth-switch">
    <span onclick="renderAuthScreen('form')">← Use email instead</span>
  </div>
</div>`;
}

// ═══ SMS OTP VERIFICATION ════════════════════════════════════
function authSmsCodeHTML(){
  return `
<div class="auth-form">
  <div class="auth-back" onclick="renderAuthScreen('phone')">← Back</div>
  <div class="auth-logo">📲</div>
  <div class="auth-title">Verify Phone</div>
  <div class="auth-subtitle">Enter the 6-digit code sent to<br/><strong>+91 ${AUTH.pendingPhone}</strong></div>
  
  <div class="otp-wrap">
    ${[0,1,2,3,4,5].map(i=>`<input class="otp-box" id="sms${i}" maxlength="1" type="tel" oninput="smsOtpIn(this,${i})" onkeydown="smsOtpBack(event,${i})"/>`).join('')}
  </div>
  <div class="auth-err" id="sms-err"></div>
  
  <button class="auth-btn" id="sms-verify" disabled onclick="verifySmsOTP()">Verify SMS OTP ✓</button>
  
  <div class="auth-timer" id="sms-timer">Resend in 60s</div>
</div>`;
}

// ═══ PASSWORD RESET REQUEST ══════════════════════════════════
function authResetHTML(){
  return `
<div class="auth-form">
  <div class="auth-back" onclick="renderAuthScreen('form')">← Back</div>
  <div class="auth-logo">🔐</div>
  <div class="auth-title">Reset Password</div>
  <div class="auth-subtitle">Enter your email to receive a password reset code</div>
  
  <div class="auth-field">
    <label class="auth-label">Email Address</label>
    <input class="auth-inp" id="rst-email" type="email" placeholder="you@example.com"/>
    <div class="auth-err" id="rst-err"></div>
  </div>
  
  <button class="auth-btn" onclick="doPasswordReset()">Send Reset Code 📨</button>
  
  <div class="auth-switch">
    <span onclick="renderAuthScreen('form')">← Back to sign in</span>
  </div>
</div>`;
}

// ═══ RESET OTP VERIFICATION ══════════════════════════════════
function authResetOtpHTML(){
  return `
<div class="auth-form">
  <div class="auth-back" onclick="renderAuthScreen('reset')">← Back</div>
  <div class="auth-logo">🔐</div>
  <div class="auth-title">Verify Reset Code</div>
  <div class="auth-subtitle">Enter the code sent to<br/><strong>${AUTH.pendingEmail}</strong></div>
  
  <div class="otp-wrap">
    ${[0,1,2,3,4,5].map(i=>`<input class="otp-box" id="rotp${i}" maxlength="1" type="tel" oninput="otpIn(this,${i})" onkeydown="otpBack(event,${i})"/>`).join('')}
  </div>
  <div class="auth-err" id="rotp-err"></div>
  
  <button class="auth-btn" id="rotp-verify" disabled onclick="verifyResetOTP()">Verify Code ✓</button>
  
  <div class="auth-timer" id="reset-timer">Resend in 60s</div>
</div>`;
}

// ═══ NEW PASSWORD INPUT ══════════════════════════════════════
function authNewPasswordHTML(){
  return `
<div class="auth-form">
  <div class="auth-logo">🔑</div>
  <div class="auth-title">Set New Password</div>
  <div class="auth-subtitle">Create a strong password for your account</div>
  
  <div class="auth-field">
    <label class="auth-label">New Password</label>
    <div style="position:relative">
      <input class="auth-inp" id="new-pass" type="password" placeholder="••••••••" oninput="pwStrength(this)"/>
      <div class="pw-eye" onclick="togglePw('new-pass',this)">👁</div>
    </div>
    <div class="pw-strength" id="pw-str"></div>
  </div>
  
  <div class="auth-field">
    <label class="auth-label">Confirm Password</label>
    <div style="position:relative">
      <input class="auth-inp" id="confirm-pass" type="password" placeholder="••••••••"/>
      <div class="pw-eye" onclick="togglePw('confirm-pass',this)">👁</div>
    </div>
    <div class="auth-err" id="newpass-err"></div>
  </div>
  
  <button class="auth-btn" id="newpass-btn" onclick="setNewPassword()">Set New Password</button>
</div>`;
}

// ═══ PROFILE SETUP ═══════════════════════════════════════════
function authSetupHTML(){
  return `
<div class="auth-form">
  <div class="auth-logo">🎉</div>
  <div class="auth-title">Complete Your Profile</div>
  <div class="auth-subtitle">Just a few more details to get started</div>
  
  <div class="av-picker">
    <div class="av-label">Choose Your Avatar</div>
    <div class="av-grid">
      ${AVATARS.slice(0,12).map(a=>`
        <div class="av-opt ${a===AUTH.pickedAvatar?'picked':''}" onclick="pickAvatar(this,'${a}')">${a}</div>
      `).join('')}
    </div>
  </div>
  
  <div class="auth-field">
    <label class="auth-label">Full Name</label>
    <input class="auth-inp" id="su-name" value="${AUTH.pendingName||''}" placeholder="Your name"/>
  </div>
  
  <div class="auth-field">
    <label class="auth-label">Phone Number (Optional)</label>
    <input class="auth-inp" id="su-phone" type="tel" value="${AUTH.pendingPhone||''}" placeholder="10-digit mobile"/>
  </div>
  
  <button class="auth-btn" id="setup-btn" onclick="completeSetup()">Complete Setup 🚀</button>
</div>`;
}

// ═══ FIREBASE + EMAILJS CONFIGURATION ════════════════════════
function authSettingsHTML(){
  const fb  = getCfg(KEYS.fb)  || {};
  const ejs = getCfg(KEYS.ejs) || {};
  const fbOk  = !!fb.apiKey;
  const ejsOk = !!(ejs.serviceId && ejs.templateId && ejs.publicKey);
  return `
<div class="auth-form">
  <div class="auth-back" onclick="renderAuthScreen('form')">← Back</div>
  <div class="auth-logo">⚙️</div>
  <div class="auth-title">App Settings</div>
  <div class="auth-subtitle">Firebase handles auth & database. EmailJS delivers OTP emails.</div>

  <div class="settings-card">
    <div class="settings-card-hd">
      <span>🔥 Firebase</span>
      <span class="settings-badge ${fbOk?'ok':'no'}">${fbOk?'✓ Connected':'Not Set'}</span>
    </div>
    <div class="auth-field" style="margin-bottom:10px">
      <label class="auth-label">Config JSON</label>
      <textarea class="auth-inp" id="fb-json" rows="7"
        placeholder='{"apiKey":"AIza...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}'
        style="resize:none;font-size:11px;font-family:monospace;line-height:1.5">${fbOk?JSON.stringify(fb,null,2):''}</textarea>
      <div class="auth-err" id="fb-err"></div>
    </div>
    <button class="auth-btn" style="padding:11px;margin-bottom:0" onclick="saveFirebaseConfig()">Save Firebase Config</button>
    <div style="margin-top:8px;font-size:11px;color:var(--muted);line-height:1.7">
      <a href="https://console.firebase.google.com" target="_blank" style="color:var(--blue)">Firebase Console</a>
      → Project Settings → Your apps → Web → copy config JSON.<br/>
      Enable: Authentication (Email/Password, Google, Phone) + Firestore.
    </div>
  </div>

  <div class="settings-card" style="margin-top:12px">
    <div class="settings-card-hd">
      <span>📧 EmailJS <span style="font-size:10px;color:var(--muted)">(OTP delivery)</span></span>
      <span class="settings-badge ${ejsOk?'ok':'no'}">${ejsOk?'✓ Active':'Not Set'}</span>
    </div>
    <div class="auth-field">
      <label class="auth-label">Public Key</label>
      <input class="auth-inp" id="ejs-pub" value="${ejs.publicKey||''}" placeholder="user_XXXXXXXXX"/>
    </div>
    <div class="auth-field">
      <label class="auth-label">Service ID</label>
      <input class="auth-inp" id="ejs-svc" value="${ejs.serviceId||''}" placeholder="service_xxxxxxx"/>
    </div>
    <div class="auth-field" style="margin-bottom:8px">
      <label class="auth-label">Template ID</label>
      <input class="auth-inp" id="ejs-tpl" value="${ejs.templateId||''}" placeholder="template_xxxxxxx"/>
    </div>
    <div style="background:rgba(6,182,212,.08);border:1px solid rgba(6,182,212,.2);border-radius:10px;
      padding:10px;font-size:11px;color:var(--muted);margin-bottom:10px;line-height:1.7">
      Template variables needed: <code style="color:var(--cyan)">{{to_email}}</code>
      <code style="color:var(--cyan)">{{to_name}}</code>
      <code style="color:var(--cyan)">{{otp_code}}</code>
    </div>
    <button class="auth-btn" style="padding:11px;margin-bottom:0" onclick="saveEmailJSConfig()">Save EmailJS Config</button>
    <div style="margin-top:8px;font-size:11px;color:var(--muted);line-height:1.7">
      <a href="https://www.emailjs.com" target="_blank" style="color:var(--blue)">emailjs.com</a>
      — free 200 emails/month.<br/>
      Without this, OTP is shown on-screen (dev mode only).
    </div>
  </div>
</div>`;
}

function saveEmailJSConfig(){
  const cfg={
    publicKey: (document.getElementById('ejs-pub')?.value||'').trim(),
    serviceId:  (document.getElementById('ejs-svc')?.value||'').trim(),
    templateId: (document.getElementById('ejs-tpl')?.value||'').trim(),
  };
  if(!cfg.publicKey||!cfg.serviceId||!cfg.templateId){
    showToast('Fill in all three EmailJS fields'); return;
  }
  setCfg(KEYS.ejs, cfg);
  if(window.emailjs) emailjs.init(cfg.publicKey);
  showToast('✅ EmailJS saved — OTPs will now be emailed');
  renderAuthScreen('settings');
}

// ═══ SCREEN ROUTER ═══════════════════════════════════════════
function renderAuthScreen(screen){
  const wrap = document.getElementById('authWrap');
  const screens = {
    form:         authFormHTML,
    otp:          authOtpHTML,
    phone:        authPhoneHTML,
    smscode:      authSmsCodeHTML,
    reset:        authResetHTML,
    resetotp:     authResetOtpHTML,
    resetpw:      authResetPwHTML,
    newpassword:  authNewPasswordHTML,
    setup:        authSetupHTML,
    settings:     authSettingsHTML,
  };
  
  const renderFn = screens[screen];
  if(renderFn) {
    wrap.innerHTML = renderFn();
  }
}

// ═══ OTP INPUT HELPERS ═══════════════════════════════════════
function otpIn(el, i){
  el.value = el.value.replace(/\D/g,'').slice(0,1);
  el.classList.remove('err');
  if(el.value && i<5) {
    document.getElementById('otp'+(i+1))?.focus();
  }
  
  const full = [0,1,2,3,4,5].map(j=>document.getElementById('otp'+j)?.value||'').join('');
  const btn = document.getElementById('otp-verify');
  if(btn) btn.disabled = full.length < 6;
}

function otpBack(e, i){
  if(e.key==='Backspace' && !e.target.value && i>0) {
    document.getElementById('otp'+(i-1))?.focus();
  }
}

function smsOtpIn(el, i){
  el.value = el.value.replace(/\D/g,'').slice(0,1);
  el.classList.remove('err');
  if(el.value && i<5) {
    document.getElementById('sms'+(i+1))?.focus();
  }
  
  const full = [0,1,2,3,4,5].map(j=>document.getElementById('sms'+j)?.value||'').join('');
  const btn = document.getElementById('sms-verify');
  if(btn) btn.disabled = full.length < 6;
}

function smsOtpBack(e, i){
  if(e.key==='Backspace' && !e.target.value && i>0) {
    document.getElementById('sms'+(i-1))?.focus();
  }
}

// Helper functions for password reset OTP
function resetOtpIn(el, i){
  el.value = el.value.replace(/\D/g,'').slice(0,1);
  el.classList.remove('err');
  if(el.value && i<5) {
    document.getElementById('rst-otp-'+(i+1))?.focus();
  }
  
  const full = [0,1,2,3,4,5].map(j=>document.getElementById('rst-otp-'+j)?.value||'').join('');
  const btn = document.getElementById('rst-otp-verify');
  if(btn) btn.disabled = full.length < 6;
}

function resetOtpBack(e, i){
  if(e.key==='Backspace' && !e.target.value && i>0) {
    document.getElementById('rst-otp-'+(i-1))?.focus();
  }
}

// ═══ AVATAR PICKER ═══════════════════════════════════════════
function pickAvatar(el, av){
  document.querySelectorAll('.av-opt').forEach(x=>x.classList.remove('picked'));
  el.classList.add('picked');
  AUTH.pickedAvatar = av;
}

// ═══ OTP TIMER ═══════════════════════════════════════════════
function startOtpTimer(elId, sec, onExpire){
  clearInterval(AUTH.otpTimer);
  let t = sec;
  
  AUTH.otpTimer = setInterval(()=>{
    t--;
    const el = document.getElementById(elId);
    if(!el) {
      clearInterval(AUTH.otpTimer);
      return;
    }
    
    if(t <= 0) {
      clearInterval(AUTH.otpTimer);
      el.textContent = 'Resend';
      el.style.cursor = 'pointer';
      el.onclick = ()=>{ if(onExpire) onExpire(); };
    } else {
      el.textContent = `Resend in ${t}s`;
    }
  }, 1000);
}

// ═══ HELPERS ═════════════════════════════════════════════════
function validEmail(e){
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
}

function setErr(id, msg){
  const el = document.getElementById(id);
  if(el) {
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
  }
}

function togglePw(id, eye){
  const inp = document.getElementById(id);
  inp.type = inp.type === 'password' ? 'text' : 'password';
  eye.textContent = inp.type === 'password' ? '👁' : '🙈';
}

function pwStrength(inp){
  const el = document.getElementById('pw-str');
  if(!el) return;
  
  const v = inp.value;
  if(!v) {
    el.className = 'pw-strength';
    return;
  }
  
  const strong = /[A-Z]/.test(v) && /[0-9!@#$]/.test(v) && v.length >= 8;
  const ok = v.length >= 6;
  
  el.className = 'pw-strength ' + (strong ? 'pw-s3' : ok ? 'pw-s2' : 'pw-s1');
}

function setBtnLoading(btn, on, label){
  if(!btn) return;
  btn.disabled = on;
  btn.innerHTML = on ? '<div class="spinner"></div> ' + label : label;
}

function fbErrMap(err){
  const map = {
    'auth/user-not-found': {field:'email', msg:'No account with this email'},
    'auth/wrong-password': {field:'pass', msg:'Incorrect password'},
    'auth/email-already-in-use': {field:'email', msg:'Email already registered'},
    'auth/weak-password': {field:'pass', msg:'Password is too weak'},
    'auth/too-many-requests': {field:'pass', msg:'Too many attempts. Try later.'},
    'auth/network-request-failed': {field:'email', msg:'Network error. Check connection.'},
    'auth/invalid-email': {field:'email', msg:'Invalid email address'}
  };
  return map[err.code] || {field:'email', msg: err.message || 'Something went wrong'};
}

// ═══ CONFIG MANAGEMENT ═══════════════════════════════════════
function saveFirebaseConfig(){
  const raw = (document.getElementById('fb-json')?.value||'').trim();
  let cfg;
  
  try{
    cfg = JSON.parse(raw);
    if(!cfg.apiKey || !cfg.projectId) {
      throw new Error('Missing apiKey or projectId');
    }
  } catch(e) {
    const el = document.getElementById('fb-err');
    if(el) {
      el.textContent = 'Invalid JSON: ' + e.message;
      el.style.display = 'block';
    }
    return;
  }
  
  setCfg(KEYS.fb, cfg);
  initFirebase();
  showToast('Firebase configured ✅');
  renderAuthScreen('form');
}

// ═══ AUTH OVERLAY CONTROLS ═══════════════════════════════════
function openAuth(mode='login'){
  AUTH.mode = mode;
  AUTH.pendingEmail = '';
  AUTH.pendingPhone = '';
  AUTH.pendingName = '';
  document.getElementById('authOverlay').classList.add('open');
  renderAuthScreen('form');
}

function closeAuth(){
  document.getElementById('authOverlay').classList.remove('open');
  clearInterval(AUTH.otpTimer);
}

// ═══ AUTH BOOT ════════════════════════════════════════════════
function authBoot(){
  initFirebase();
  const user = getCurrentUser();
  if(user) renderAccount();
}
// ═══════════════════════════════════════════════════════════════
// VIDEOS
// ═══════════════════════════════════════════════════════════════
function renderVideos(){
  VIDEOS.forEach(v=>{
    const d=document.createElement('div');d.className='vc';
    d.innerHTML=`<div class="vt">${v.em}<div class="vplay"><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg></div><div class="vtag2">${v.tag}</div></div>
    <div class="vi"><div class="vtt">${v.title}</div><div class="vm"><span class="vch">${v.ch}</span><span class="vvw">${v.views}</span></div></div>`;
    document.getElementById('vidScroll').appendChild(d);
  });
}

// ═══════════════════════════════════════════════════════════════
// MISSING FUNCTIONS — FIREBASE SETTINGS UI
// ═══════════════════════════════════════════════════════════════

// ── Firebase settings overlay (from index.html fbSettingsOv) ──
function openFirebaseSettings(){
  const cfg=getCfg(KEYS.fb)||{};
  document.getElementById('fbApiKey').value           = cfg.apiKey||'';
  document.getElementById('fbAuthDomain').value       = cfg.authDomain||'';
  document.getElementById('fbProjectId').value        = cfg.projectId||'';
  document.getElementById('fbStorageBucket').value    = cfg.storageBucket||'';
  document.getElementById('fbMessagingSenderId').value= cfg.messagingSenderId||'';
  document.getElementById('fbAppId').value            = cfg.appId||'';
  const ov=document.getElementById('fbSettingsOv');
  ov.style.display='flex';
  document.getElementById('fbConfigNotice').style.display='none';
}

function closeFbSettings(event){
  if(!event||event.target===document.getElementById('fbSettingsOv')){
    document.getElementById('fbSettingsOv').style.display='none';
  }
}

function saveFbConfig(){
  const cfg={
    apiKey:            (document.getElementById('fbApiKey').value||'').trim(),
    authDomain:        (document.getElementById('fbAuthDomain').value||'').trim(),
    projectId:         (document.getElementById('fbProjectId').value||'').trim(),
    storageBucket:     (document.getElementById('fbStorageBucket').value||'').trim(),
    messagingSenderId: (document.getElementById('fbMessagingSenderId').value||'').trim(),
    appId:             (document.getElementById('fbAppId').value||'').trim(),
  };
  if(!cfg.apiKey||!cfg.authDomain||!cfg.projectId||!cfg.appId){
    showToast('Please fill in all required fields (*)');
    return;
  }
  setCfg(KEYS.fb,cfg);
  const ok=initFirebase();
  if(ok){
    showToast('✅ Firebase configured successfully!');
    closeFbSettings();
  } else {
    showToast('❌ Init failed — check your credentials');
  }
}

function testFbConfig(){
  const apiKey=(document.getElementById('fbApiKey').value||'').trim();
  const projectId=(document.getElementById('fbProjectId').value||'').trim();
  if(!apiKey||!projectId){showToast('Fill in API Key and Project ID first');return;}
  if(!apiKey.startsWith('AIza')){showToast('⚠️ API Key should start with AIza');return;}
  showToast('✅ Format looks valid — save to test full connection');
}

function clearFbConfig(){
  if(!confirm('Clear Firebase configuration? You will be signed out.'))return;
  localStorage.removeItem(KEYS.fb);
  if(AUTH.fbAuth){
    AUTH.fbAuth.signOut().catch(()=>{});
    AUTH.fbApp=null;AUTH.fbAuth=null;AUTH.fbDb=null;
  }
  setCurrentUser(null);
  showToast('Firebase config cleared');
  closeFbSettings();
  renderAccount();
}

function closeFbNotice(){
  document.getElementById('fbConfigNotice').style.display='none';
}

// ── Missing authResetPwHTML alias ─────────────────────────────
function authResetPwHTML(){ return authNewPasswordHTML(); }

// ═══════════════════════════════════════════════════════════════
// SHOW TOAST
// ═══════════════════════════════════════════════════════════════
function showToast(msg,dur=2800){
  const t=document.getElementById('toast');
  if(!t)return;
  clearTimeout(t._timer);
  t.textContent=msg;t.className='toast show';
  t._timer=setTimeout(()=>t.className='toast',dur);
}

// ═══════════════════════════════════════════════════════════════
// EDIT PROFILE SHEET
// ═══════════════════════════════════════════════════════════════
AUTH.prefs={notif:true,budget:false,access:false};

function openEP(){
  const user=getCurrentUser();
  if(!user){showToast('Please sign in first');return;}
  AUTH.prefs={...({notif:true,budget:false,access:false}),...(user.prefs||{})};
  AUTH.pickedAvatar=user.avatar||'😊';
  document.getElementById('epAvatar').textContent=AUTH.pickedAvatar;
  document.getElementById('epName').value=user.name||'';
  document.getElementById('epPhone').value=user.phone||'';
  document.getElementById('epLang').value=user.lang||'en';
  // Sync toggles
  ['notif','budget','access'].forEach(k=>{
    const el=document.getElementById('tog'+k.charAt(0).toUpperCase()+k.slice(1));
    if(el) el.classList.toggle('on',!!AUTH.prefs[k]);
  });
  // Build avatar grid
  const grid=document.getElementById('avGrid');
  if(grid){
    grid.innerHTML='';
    AVATARS.forEach(a=>{
      const d=document.createElement('div');
      d.className='av-opt'+(a===AUTH.pickedAvatar?' picked':'');
      d.textContent=a;
      d.onclick=()=>{
        AUTH.pickedAvatar=a;
        document.querySelectorAll('#avGrid .av-opt').forEach(x=>x.classList.remove('picked'));
        d.classList.add('picked');
        document.getElementById('epAvatar').textContent=a;
      };
      grid.appendChild(d);
    });
  }
  const ov=document.getElementById('epOverlay');
  ov.style.display='flex';
}

function closeEP(event){
  if(!event||event.target===document.getElementById('epOverlay')){
    document.getElementById('epOverlay').style.display='none';
  }
}

function toggleAvGrid(){
  const g=document.getElementById('avGrid');
  if(g) g.style.display=g.style.display==='grid'?'none':'grid';
}

function togPref(key){
  AUTH.prefs[key]=!AUTH.prefs[key];
  const el=document.getElementById('tog'+key.charAt(0).toUpperCase()+key.slice(1));
  if(el) el.classList.toggle('on',AUTH.prefs[key]);
}

// ═══════════════════════════════════════════════════════════════
// RENDER ACCOUNT TAB
// ═══════════════════════════════════════════════════════════════
function renderAccount(){
  const box=document.getElementById('actContent');
  if(!box)return;
  const user=getCurrentUser();
  if(!user){
    box.innerHTML=`
    <div class="acc-guest">
      <div class="acc-guest-icon">🚇</div>
      <div class="acc-guest-title">Sign In to Fair Fare</div>
      <div class="acc-guest-sub">Save your favourite routes, track travel history and get personalised fare recommendations.</div>
      <button class="acc-guest-btn" onclick="openAuth('login')">Sign In</button>
      <button class="acc-guest-sec" onclick="openAuth('signup')">Create Account</button>
      ${!getCfg(KEYS.fb)?`<div style="margin-top:20px;padding:14px;background:var(--s1);border:1px dashed rgba(26,110,245,.25);border-radius:13px;text-align:center">
        <div style="font-size:24px;margin-bottom:8px">🔐</div>
        <div style="font-size:13px;color:var(--muted);margin-bottom:12px">Firebase not configured.<br/>Set it up to enable full auth features.</div>
        <button class="auth-btn" style="font-size:13px;padding:10px" onclick="openFirebaseSettings()">Configure Firebase</button>
      </div>`:''}
    </div>`;
    return;
  }
  const trips=S.recent.filter(r=>r.cityId===S.city?.id).length;
  box.innerHTML=`
  <div class="acc-hero">
    <button class="acc-edit-btn" onclick="openEP()">✏️ Edit</button>
    <div class="avw"><div class="av">${user.avatar||user.name?.charAt(0)||'U'}</div></div>
    <div class="an">${user.name||'Traveller'}</div>
    <div class="ae">${user.email||''}</div>
    ${user.phone?`<div class="acc-phone">📱 +91 ${user.phone}</div>`:''}
    <div class="asts">
      <div class="ast"><div class="asn">${S.recent.length}</div><div class="asl">Searches</div></div>
      <div class="ast"><div class="asn">${trips}</div><div class="asl">This City</div></div>
      <div class="ast"><div class="asn">${CITIES.length}</div><div class="asl">Cities</div></div>
    </div>
  </div>
  <div class="ash">Quick Actions</div>
  <div class="ai2" onclick="switchTab('recent')"><div class="aic" style="background:rgba(26,110,245,.12)">🗺️</div><div class="ail">Recent Routes</div><div class="aiv">${S.recent.length} saved</div></div>
  <div class="ai2" onclick="openFirebaseSettings()"><div class="aic" style="background:rgba(255,183,0,.1)">🔐</div><div class="ail">Firebase Settings</div><div class="aiv" style="color:${getCfg(KEYS.fb)?'var(--green)':'var(--red)'}">${getCfg(KEYS.fb)?'Connected':'Not set'}</div></div>
  <div style="height:14px"></div>
  <div class="ash">Account</div>
  <div class="ai2" onclick="doSignOut()" style="border-color:rgba(239,68,68,.2)"><div class="aic" style="background:rgba(239,68,68,.1)">🚪</div><div class="ail" style="color:var(--red)">Sign Out</div></div>`;
}

// ── Dismiss splash after animation ───────────────────────────
setTimeout(()=>{
  const s=document.getElementById('splash');
  if(s){
    s.addEventListener('animationend',()=>{
      if(window.getComputedStyle(s).opacity==='0') s.remove();
    },{once:true});
  }
}, 3200);