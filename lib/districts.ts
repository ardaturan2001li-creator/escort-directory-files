export interface DistrictInfo {
  key: string;
  name: string;
  neighbors: string[];
}

export const DISTRICTS_BY_CITY: Record<string, Record<string, DistrictInfo>> = {
  antalya: {
    'konyaalti': { key: 'konyaalti', name: 'Konyaaltı', neighbors: ['muratpasa', 'lara', 'kepez', 'kemer', 'beldibi', 'dosemealti'] },
    'muratpasa': { key: 'muratpasa', name: 'Muratpaşa', neighbors: ['lara', 'konyaalti', 'kepez', 'kundu'] },
    'lara': { key: 'lara', name: 'Lara', neighbors: ['muratpasa', 'kundu', 'kepez', 'konyaalti', 'belek'] },
    'kepez': { key: 'kepez', name: 'Kepez', neighbors: ['muratpasa', 'konyaalti', 'dosemealti', 'serik'] },
    'alanya': { key: 'alanya', name: 'Alanya', neighbors: ['manavgat', 'side', 'gazipasa', 'mahmutlar', 'oba'] },
    'mahmutlar': { key: 'mahmutlar', name: 'Mahmutlar', neighbors: ['alanya', 'gazipasa', 'oba'] },
    'oba': { key: 'oba', name: 'Oba', neighbors: ['alanya', 'mahmutlar'] },
    'kemer': { key: 'kemer', name: 'Kemer', neighbors: ['beldibi', 'goynuk', 'konyaalti', 'kiris', 'camyuva', 'kumluca'] },
    'beldibi': { key: 'beldibi', name: 'Beldibi', neighbors: ['goynuk', 'kemer', 'konyaalti'] },
    'goynuk': { key: 'goynuk', name: 'Göynük', neighbors: ['beldibi', 'kemer'] },
    'kiris': { key: 'kiris', name: 'Kiriş', neighbors: ['kemer', 'camyuva'] },
    'camyuva': { key: 'camyuva', name: 'Çamyuva', neighbors: ['kemer', 'kiris'] },
    'belek': { key: 'belek', name: 'Belek', neighbors: ['serik', 'kundu', 'lara', 'manavgat', 'kadriye'] },
    'kadriye': { key: 'kadriye', name: 'Kadriye', neighbors: ['belek', 'serik', 'kundu'] },
    'kundu': { key: 'kundu', name: 'Kundu', neighbors: ['lara', 'belek', 'muratpasa', 'kadriye'] },
    'manavgat': { key: 'manavgat', name: 'Manavgat', neighbors: ['side', 'alanya', 'belek', 'serik'] },
    'side': { key: 'side', name: 'Side', neighbors: ['manavgat', 'belek', 'kumkoy', 'colakli'] },
    'kumkoy': { key: 'kumkoy', name: 'Kumköy', neighbors: ['side', 'colakli', 'manavgat'] },
    'colakli': { key: 'colakli', name: 'Çolaklı', neighbors: ['side', 'kumkoy', 'belek'] },
    'kas': { key: 'kas', name: 'Kaş', neighbors: ['kalkan', 'demre', 'finike'] },
    'kalkan': { key: 'kalkan', name: 'Kalkan', neighbors: ['kas', 'fethiye'] },
    'kumluca': { key: 'kumluca', name: 'Kumluca', neighbors: ['finike', 'kemer', 'demre', 'olympos', 'adrasan'] },
    'olympos': { key: 'olympos', name: 'Olimpos', neighbors: ['adrasan', 'kumluca', 'kemer'] },
    'adrasan': { key: 'adrasan', name: 'Adrasan', neighbors: ['olympos', 'kumluca'] },
    'finike': { key: 'finike', name: 'Finike', neighbors: ['kumluca', 'demre', 'kas'] },
    'serik': { key: 'serik', name: 'Serik', neighbors: ['belek', 'kepez', 'manavgat', 'kadriye'] },
    'dosemealti': { key: 'dosemealti', name: 'Döşemealtı', neighbors: ['kepez', 'konyaalti', 'muratpasa'] },
    'gazipasa': { key: 'gazipasa', name: 'Gazipaşa', neighbors: ['alanya', 'mahmutlar'] },
    'demre': { key: 'demre', name: 'Demre', neighbors: ['finike', 'kas'] },
    'korkuteli': { key: 'korkuteli', name: 'Korkuteli', neighbors: ['dosemealti', 'kepez'] },
    'elmali': { key: 'elmali', name: 'Elmalı', neighbors: ['korkuteli', 'kumluca'] }
  },
  istanbul: {
    'kadikoy': { key: 'kadikoy', name: 'Kadıköy', neighbors: ['moda', 'bostanci', 'suadiye', 'uskudar', 'atasehir', 'maltepe'] },
    'moda': { key: 'moda', name: 'Moda', neighbors: ['kadikoy', 'fenerbahce', 'caddebostan'] },
    'fenerbahce': { key: 'fenerbahce', name: 'Fenerbahçe', neighbors: ['moda', 'caddebostan', 'kadikoy'] },
    'caddebostan': { key: 'caddebostan', name: 'Caddebostan', neighbors: ['suadiye', 'fenerbahce', 'erenkoy', 'bostanci'] },
    'suadiye': { key: 'suadiye', name: 'Suadiye', neighbors: ['caddebostan', 'bostanci', 'erenkoy'] },
    'bostanci': { key: 'bostanci', name: 'Bostancı', neighbors: ['suadiye', 'kadikoy', 'maltepe', 'atasehir', 'kozyatagi'] },
    'kozyatagi': { key: 'kozyatagi', name: 'Kozyatağı', neighbors: ['bostanci', 'atasehir', 'kadikoy'] },
    'sisli': { key: 'sisli', name: 'Şişli', neighbors: ['nisantasi', 'mecidiyekoy', 'besiktas', 'beyoglu', 'bomonti', 'kagithane'] },
    'nisantasi': { key: 'nisantasi', name: 'Nişantaşı', neighbors: ['sisli', 'tesvikiye', 'besiktas', 'beyoglu', 'harbiye'] },
    'tesvikiye': { key: 'tesvikiye', name: 'Teşvikiye', neighbors: ['nisantasi', 'besiktas', 'macka'] },
    'mecidiyekoy': { key: 'mecidiyekoy', name: 'Mecidiyeköy', neighbors: ['sisli', 'levent', 'besiktas', 'esentepe'] },
    'bomonti': { key: 'bomonti', name: 'Bomonti', neighbors: ['sisli', 'ferikoy', 'mecidiyekoy'] },
    'besiktas': { key: 'besiktas', name: 'Beşiktaş', neighbors: ['levent', 'etiler', 'bebek', 'ortakoy', 'sisli', 'beyoglu', 'sariyer'] },
    'levent': { key: 'levent', name: 'Levent', neighbors: ['maslak', 'etiler', 'besiktas', 'mecidiyekoy'] },
    'etiler': { key: 'etiler', name: 'Etiler', neighbors: ['bebek', 'levent', 'ulus', 'besiktas', 'akatlar'] },
    'bebek': { key: 'bebek', name: 'Bebek', neighbors: ['etiler', 'ortakoy', 'arnavutkoy', 'sariyer'] },
    'ortakoy': { key: 'ortakoy', name: 'Ortaköy', neighbors: ['besiktas', 'bebek', 'kurucesme'] },
    'maslak': { key: 'maslak', name: 'Maslak', neighbors: ['sariyer', 'levent', 'istinye', 'tarabya', 'ayazaga'] },
    'beyoglu': { key: 'beyoglu', name: 'Beyoğlu', neighbors: ['taksim', 'cihangir', 'karakoy', 'galata', 'sisli', 'besiktas'] },
    'taksim': { key: 'taksim', name: 'Taksim', neighbors: ['beyoglu', 'cihangir', 'gumussuyu', 'sisli', 'harbiye'] },
    'cihangir': { key: 'cihangir', name: 'Cihangir', neighbors: ['taksim', 'karakoy', 'beyoglu', 'kabatas'] },
    'karakoy': { key: 'karakoy', name: 'Karaköy', neighbors: ['galata', 'beyoglu', 'eminonu', 'cihangir'] },
    'galata': { key: 'galata', name: 'Galata', neighbors: ['karakoy', 'beyoglu', 'taksim'] },
    'bakirkoy': { key: 'bakirkoy', name: 'Bakırköy', neighbors: ['florya', 'yesilkoy', 'atakoy', 'bahcelievler', 'zeytinburnu'] },
    'atakoy': { key: 'atakoy', name: 'Ataköy', neighbors: ['bakirkoy', 'yesilkoy', 'sirinevler'] },
    'yesilkoy': { key: 'yesilkoy', name: 'Yeşilköy', neighbors: ['florya', 'atakoy', 'bakirkoy'] },
    'florya': { key: 'florya', name: 'Florya', neighbors: ['yesilkoy', 'bakirkoy', 'kucukcekmece'] },
    'atasehir': { key: 'atasehir', name: 'Ataşehir', neighbors: ['kadikoy', 'bostanci', 'umraniye', 'maltepe', 'kozyatagi'] },
    'uskudar': { key: 'uskudar', name: 'Üsküdar', neighbors: ['kadikoy', 'umraniye', 'beylerbeyi', 'kuzguncuk', 'beykoz'] },
    'kuzguncuk': { key: 'kuzguncuk', name: 'Kuzguncuk', neighbors: ['uskudar', 'beylerbeyi'] },
    'fatih': { key: 'fatih', name: 'Fatih', neighbors: ['eminonu', 'aksaray', 'laleli', 'beyoglu', 'zeytinburnu'] },
    'sariyer': { key: 'sariyer', name: 'Sarıyer', neighbors: ['tarabya', 'istinye', 'yenikoy', 'maslak', 'zekeriyakoy'] },
    'istinye': { key: 'istinye', name: 'İstinye', neighbors: ['yenikoy', 'maslak', 'tarabya', 'sariyer'] },
    'tarabya': { key: 'tarabya', name: 'Tarabya', neighbors: ['istinye', 'yenikoy', 'sariyer'] },
    'maltepe': { key: 'maltepe', name: 'Maltepe', neighbors: ['kartal', 'kadikoy', 'bostanci', 'atasehir'] },
    'kartal': { key: 'kartal', name: 'Kartal', neighbors: ['maltepe', 'pendik', 'yakacik', 'sancaktepe'] },
    'pendik': { key: 'pendik', name: 'Pendik', neighbors: ['kartal', 'tuzla', 'kurtkoy'] },
    'kurtkoy': { key: 'kurtkoy', name: 'Kurtköy', neighbors: ['pendik', 'tuzla'] },
    'tuzla': { key: 'tuzla', name: 'Tuzla', neighbors: ['pendik', 'kurtkoy', 'gebze'] },
    'beylikduzu': { key: 'beylikduzu', name: 'Beylikdüzü', neighbors: ['esenyurt', 'buyukcekmece', 'avcilar'] },
    'esenyurt': { key: 'esenyurt', name: 'Esenyurt', neighbors: ['beylikduzu', 'basaksehir', 'avcilar', 'bahcesehir'] },
    'bahcesehir': { key: 'bahcesehir', name: 'Bahçeşehir', neighbors: ['basaksehir', 'esenyurt', 'avcilar'] },
    'avcilar': { key: 'avcilar', name: 'Avcılar', neighbors: ['kucukcekmece', 'esenyurt', 'beylikduzu'] },
    'basaksehir': { key: 'basaksehir', name: 'Başakşehir', neighbors: ['bahcesehir', 'kucukcekmece', 'bagcilar'] },
    'kucukcekmece': { key: 'kucukcekmece', name: 'Küçükçekmece', neighbors: ['florya', 'avcilar', 'bakirkoy', 'basaksehir'] },
    'buyukcekmece': { key: 'buyukcekmece', name: 'Büyükçekmece', neighbors: ['beylikduzu', 'silivri', 'kumburgaz', 'esenyurt'] },
    'kumburgaz': { key: 'kumburgaz', name: 'Kumburgaz', neighbors: ['buyukcekmece', 'silivri'] },
    'silivri': { key: 'silivri', name: 'Silivri', neighbors: ['buyukcekmece', 'kumburgaz', 'catalca'] },
    'umraniye': { key: 'umraniye', name: 'Ümraniye', neighbors: ['atasehir', 'uskudar', 'cekmekoy', 'sancaktepe'] },
    'cekmekoy': { key: 'cekmekoy', name: 'Çekmeköy', neighbors: ['umraniye', 'sancaktepe', 'beykoz'] },
    'sancaktepe': { key: 'sancaktepe', name: 'Sancaktepe', neighbors: ['kartal', 'cekmekoy', 'umraniye', 'samandira'] },
    'beykoz': { key: 'beykoz', name: 'Beykoz', neighbors: ['kavacik', 'anadoluhisari', 'uskudar', 'cekmekoy', 'sile'] },
    'kavacik': { key: 'kavacik', name: 'Kavacık', neighbors: ['beykoz', 'anadoluhisari', 'cekmekoy'] },
    'sile': { key: 'sile', name: 'Şile', neighbors: ['beykoz', 'cekmekoy'] }
  },
  ankara: {
    'cankaya': { key: 'cankaya', name: 'Çankaya', neighbors: ['kizilay', 'tunali', 'gop', 'cayyolu', 'umitkoy', 'bilkent', 'balgat'] },
    'kizilay': { key: 'kizilay', name: 'Kızılay', neighbors: ['cankaya', 'tunali', 'altindag'] },
    'tunali': { key: 'tunali', name: 'Tunalı Hilmi', neighbors: ['kizilay', 'cankaya', 'gop'] },
    'gop': { key: 'gop', name: 'Gaziosmanpaşa (GOP)', neighbors: ['tunali', 'cankaya', 'oran'] },
    'cayyolu': { key: 'cayyolu', name: 'Çayyolu', neighbors: ['umitkoy', 'incek', 'cankaya', 'etimesgut'] },
    'umitkoy': { key: 'umitkoy', name: 'Ümitköy', neighbors: ['cayyolu', 'bilkent', 'cankaya', 'etimesgut'] },
    'bilkent': { key: 'bilkent', name: 'Bilkent', neighbors: ['umitkoy', 'cankaya', 'incek'] },
    'incek': { key: 'incek', name: 'İncek', neighbors: ['cayyolu', 'bilkent', 'golbasi', 'cankaya'] },
    'golbasi': { key: 'golbasi', name: 'Gölbaşı', neighbors: ['incek', 'cankaya', 'oran'] },
    'oran': { key: 'oran', name: 'Oran', neighbors: ['cankaya', 'golbasi', 'incek'] },
    'balgat': { key: 'balgat', name: 'Balgat', neighbors: ['cankaya', 'cukurambar', 'sogutozu'] },
    'cukurambar': { key: 'cukurambar', name: 'Çukurambar', neighbors: ['balgat', 'sogutozu', 'cankaya'] },
    'sogutozu': { key: 'sogutozu', name: 'Söğütözü', neighbors: ['cukurambar', 'balgat'] },
    'batikent': { key: 'batikent', name: 'Batıkent', neighbors: ['yenimahalle', 'eryaman', 'ostim'] },
    'eryaman': { key: 'eryaman', name: 'Eryaman', neighbors: ['batikent', 'etimesgut', 'sincan'] },
    'kecioren': { key: 'kecioren', name: 'Keçiören', neighbors: ['altindag', 'yenimahalle', 'etlik'] },
    'etlik': { key: 'etlik', name: 'Etlik', neighbors: ['kecioren', 'yenimahalle'] },
    'yenimahalle': { key: 'yenimahalle', name: 'Yenimahalle', neighbors: ['cankaya', 'batikent', 'kecioren'] },
    'mamak': { key: 'mamak', name: 'Mamak', neighbors: ['cankaya', 'altindag'] },
    'etimesgut': { key: 'etimesgut', name: 'Etimesgut', neighbors: ['eryaman', 'sincan', 'cayyolu'] },
    'sincan': { key: 'sincan', name: 'Sincan', neighbors: ['etimesgut', 'eryaman'] }
  },
  izmir: {
    'alsancak': { key: 'alsancak', name: 'Alsancak', neighbors: ['konak', 'karsiyaka', 'bornova'] },
    'konak': { key: 'konak', name: 'Konak', neighbors: ['alsancak', 'karabaglar', 'bornova', 'balcova', 'goztepe'] },
    'karsiyaka': { key: 'karsiyaka', name: 'Karşıyaka', neighbors: ['bostanli', 'mavisehir', 'bayrakli'] },
    'bostanli': { key: 'bostanli', name: 'Bostanlı', neighbors: ['karsiyaka', 'mavisehir'] },
    'mavisehir': { key: 'mavisehir', name: 'Mavişehir', neighbors: ['bostanli', 'karsiyaka'] },
    'goztepe': { key: 'goztepe', name: 'Göztepe', neighbors: ['konak', 'guzelyali', 'balcova'] },
    'guzelyali': { key: 'guzelyali', name: 'Güzelyalı', neighbors: ['goztepe', 'balcova'] },
    'bornova': { key: 'bornova', name: 'Bornova', neighbors: ['bayrakli', 'konak', 'buca'] },
    'buca': { key: 'buca', name: 'Buca', neighbors: ['bornova', 'konak', 'karabaglar', 'gaziemir'] },
    'cesme': { key: 'cesme', name: 'Çeşme', neighbors: ['alacati', 'ilica', 'urla'] },
    'alacati': { key: 'alacati', name: 'Alaçatı', neighbors: ['cesme', 'ilica', 'urla'] },
    'ilica': { key: 'ilica', name: 'Ilıca', neighbors: ['cesme', 'alacati'] },
    'urla': { key: 'urla', name: 'Urla', neighbors: ['cesme', 'alacati', 'guzelbahce', 'seferihisar'] },
    'seferihisar': { key: 'seferihisar', name: 'Seferihisar', neighbors: ['sigacik', 'urla', 'guzelbahce'] },
    'sigacik': { key: 'sigacik', name: 'Sığacık', neighbors: ['seferihisar', 'urla'] },
    'bayrakli': { key: 'bayrakli', name: 'Bayraklı', neighbors: ['bornova', 'karsiyaka', 'konak'] },
    'balcova': { key: 'balcova', name: 'Balçova', neighbors: ['konak', 'narlidere', 'karabaglar', 'guzelyali'] },
    'narlidere': { key: 'narlidere', name: 'Narlıdere', neighbors: ['balcova', 'guzelbahce'] },
    'guzelbahce': { key: 'guzelbahce', name: 'Güzelbahçe', neighbors: ['narlidere', 'urla', 'seferihisar'] },
    'gaziemir': { key: 'gaziemir', name: 'Gaziemir', neighbors: ['buca', 'karabaglar'] }
  },
  berlin: {
    'mitte': { key: 'mitte', name: 'Mitte', neighbors: ['charlottenburg', 'kreuzberg', 'prenzlauer-berg', 'tiergarten', 'wedding'] },
    'charlottenburg': { key: 'charlottenburg', name: 'Charlottenburg', neighbors: ['wilmersdorf', 'mitte', 'schoneberg', 'spandau', 'grunewald'] },
    'wilmersdorf': { key: 'wilmersdorf', name: 'Wilmersdorf', neighbors: ['charlottenburg', 'schoneberg', 'steglitz', 'zehlendorf', 'grunewald'] },
    'kreuzberg': { key: 'kreuzberg', name: 'Kreuzberg', neighbors: ['neukolln', 'friedrichshain', 'mitte', 'schoneberg', 'tempelhof'] },
    'schoneberg': { key: 'schoneberg', name: 'Schöneberg', neighbors: ['charlottenburg', 'kreuzberg', 'wilmersdorf', 'tempelhof', 'tiergarten'] },
    'friedrichshain': { key: 'friedrichshain', name: 'Friedrichshain', neighbors: ['kreuzberg', 'prenzlauer-berg', 'lichtenberg', 'mitte'] },
    'prenzlauer-berg': { key: 'prenzlauer-berg', name: 'Prenzlauer Berg', neighbors: ['mitte', 'friedrichshain', 'pankow', 'wedding'] },
    'neukolln': { key: 'neukolln', name: 'Neukölln', neighbors: ['kreuzberg', 'tempelhof', 'treptow'] },
    'spandau': { key: 'spandau', name: 'Spandau', neighbors: ['charlottenburg', 'reinickendorf'] },
    'steglitz': { key: 'steglitz', name: 'Steglitz', neighbors: ['zehlendorf', 'tempelhof', 'schoneberg'] },
    'zehlendorf': { key: 'zehlendorf', name: 'Zehlendorf', neighbors: ['steglitz', 'wilmersdorf', 'grunewald', 'dahlem', 'wannsee'] },
    'dahlem': { key: 'dahlem', name: 'Dahlem', neighbors: ['zehlendorf', 'steglitz', 'wilmersdorf'] },
    'wannsee': { key: 'wannsee', name: 'Wannsee', neighbors: ['zehlendorf'] },
    'grunewald': { key: 'grunewald', name: 'Grunewald', neighbors: ['charlottenburg', 'wilmersdorf', 'zehlendorf'] },
    'tempelhof': { key: 'tempelhof', name: 'Tempelhof', neighbors: ['schoneberg', 'neukolln', 'steglitz'] },
    'pankow': { key: 'pankow', name: 'Pankow', neighbors: ['prenzlauer-berg', 'reinickendorf', 'wedding'] },
    'reinickendorf': { key: 'reinickendorf', name: 'Reinickendorf', neighbors: ['pankow', 'spandau', 'wedding', 'tegel'] },
    'tegel': { key: 'tegel', name: 'Tegel', neighbors: ['reinickendorf', 'wedding', 'spandau'] },
    'wedding': { key: 'wedding', name: 'Wedding', neighbors: ['mitte', 'moabit', 'reinickendorf', 'prenzlauer-berg'] },
    'moabit': { key: 'moabit', name: 'Moabit', neighbors: ['mitte', 'tiergarten', 'charlottenburg', 'wedding'] },
    'tiergarten': { key: 'tiergarten', name: 'Tiergarten', neighbors: ['mitte', 'charlottenburg', 'schoneberg', 'moabit'] },
    'treptow': { key: 'treptow', name: 'Treptow', neighbors: ['neukolln', 'kopenick', 'friedrichshain'] },
    'kopenick': { key: 'kopenick', name: 'Köpenick', neighbors: ['treptow', 'marzahn'] },
    'lichtenberg': { key: 'lichtenberg', name: 'Lichtenberg', neighbors: ['friedrichshain', 'marzahn', 'pankow'] },
    'marzahn': { key: 'marzahn', name: 'Marzahn', neighbors: ['hellersdorf', 'lichtenberg', 'kopenick'] }
  },
  london: {
    'mayfair': { key: 'mayfair', name: 'Mayfair', neighbors: ['soho', 'marylebone', 'kensington', 'chelsea', 'westminster', 'knightsbridge'] },
    'soho': { key: 'soho', name: 'Soho', neighbors: ['covent-garden', 'mayfair', 'marylebone', 'fitzrovia'] },
    'covent-garden': { key: 'covent-garden', name: 'Covent Garden', neighbors: ['soho', 'holborn', 'city-of-london'] },
    'marylebone': { key: 'marylebone', name: 'Marylebone', neighbors: ['mayfair', 'paddington', 'fitzrovia'] },
    'fitzrovia': { key: 'fitzrovia', name: 'Fitzrovia', neighbors: ['soho', 'marylebone'] },
    'kensington': { key: 'kensington', name: 'Kensington', neighbors: ['chelsea', 'knightsbridge', 'notting-hill'] },
    'chelsea': { key: 'chelsea', name: 'Chelsea', neighbors: ['kensington', 'knightsbridge', 'fulham', 'battersea'] },
    'knightsbridge': { key: 'knightsbridge', name: 'Knightsbridge', neighbors: ['mayfair', 'kensington', 'chelsea', 'belgravia'] },
    'belgravia': { key: 'belgravia', name: 'Belgravia', neighbors: ['knightsbridge', 'victoria', 'chelsea', 'westminster'] },
    'westminster': { key: 'westminster', name: 'Westminster', neighbors: ['victoria', 'mayfair', 'soho'] },
    'canary-wharf': { key: 'canary-wharf', name: 'Canary Wharf', neighbors: ['docklands', 'stratford', 'greenwich'] },
    'city-of-london': { key: 'city-of-london', name: 'City of London', neighbors: ['shoreditch', 'holborn'] },
    'shoreditch': { key: 'shoreditch', name: 'Shoreditch', neighbors: ['islington', 'city-of-london'] },
    'notting-hill': { key: 'notting-hill', name: 'Notting Hill', neighbors: ['kensington', 'bayswater'] },
    'bayswater': { key: 'bayswater', name: 'Bayswater', neighbors: ['notting-hill', 'paddington'] },
    'paddington': { key: 'paddington', name: 'Paddington', neighbors: ['marylebone', 'bayswater', 'notting-hill'] },
    'camden': { key: 'camden', name: 'Camden', neighbors: ['islington', 'hampstead', 'kings-cross'] },
    'islington': { key: 'islington', name: 'Islington', neighbors: ['camden', 'shoreditch'] },
    'fulham': { key: 'fulham', name: 'Fulham', neighbors: ['chelsea', 'hammersmith'] },
    'hammersmith': { key: 'hammersmith', name: 'Hammersmith', neighbors: ['fulham'] },
    'battersea': { key: 'battersea', name: 'Battersea', neighbors: ['chelsea', 'clapham'] },
    'clapham': { key: 'clapham', name: 'Clapham', neighbors: ['battersea', 'brixton'] },
    'greenwich': { key: 'greenwich', name: 'Greenwich', neighbors: ['canary-wharf'] },
    'richmond': { key: 'richmond', name: 'Richmond', neighbors: ['twickenham'] },
    'stratford': { key: 'stratford', name: 'Stratford', neighbors: ['canary-wharf'] },
    'hampstead': { key: 'hampstead', name: 'Hampstead', neighbors: ['camden'] }
  },
  amsterdam: {
    'centrum': { key: 'centrum', name: 'Centrum', neighbors: ['de-wallen', 'jordaan', 'de-pijp', 'oud-zuid'] },
    'de-wallen': { key: 'de-wallen', name: 'De Wallen (Red Light District)', neighbors: ['centrum', 'jordaan'] },
    'jordaan': { key: 'jordaan', name: 'Jordaan', neighbors: ['centrum', 'oud-west', 'westerpark'] },
    'de-pijp': { key: 'de-pijp', name: 'De Pijp', neighbors: ['oud-zuid', 'centrum', 'oost'] },
    'oud-zuid': { key: 'oud-zuid', name: 'Oud-Zuid', neighbors: ['de-pijp', 'zuidas'] },
    'zuidas': { key: 'zuidas', name: 'Zuidas', neighbors: ['oud-zuid', 'amstelveen'] },
    'amstelveen': { key: 'amstelveen', name: 'Amstelveen', neighbors: ['zuidas'] },
    'oud-west': { key: 'oud-west', name: 'Oud-West', neighbors: ['jordaan', 'westerpark'] },
    'sloterdijk': { key: 'sloterdijk', name: 'Sloterdijk', neighbors: ['westerpark'] },
    'oost': { key: 'oost', name: 'Amsterdam-Oost', neighbors: ['de-pijp'] },
    'noord': { key: 'noord', name: 'Amsterdam-Noord', neighbors: ['centrum'] }
  },
  paris: {
    'champs-elysees': { key: 'champs-elysees', name: 'Champs-Élysées (8e)', neighbors: ['louvre', 'passy', 'opera'] },
    'louvre': { key: 'louvre', name: 'Louvre & 1er', neighbors: ['champs-elysees', 'marais', 'saint-germain'] },
    'passy': { key: 'passy', name: 'Passy & Trocadéro (16e)', neighbors: ['champs-elysees', 'tour-eiffel', 'boulogne'] },
    'saint-germain': { key: 'saint-germain', name: 'Saint-Germain-des-Prés (6e)', neighbors: ['louvre', 'tour-eiffel'] },
    'tour-eiffel': { key: 'tour-eiffel', name: 'Tour Eiffel & 7e', neighbors: ['saint-germain', 'passy'] },
    'opera': { key: 'opera', name: 'Opéra & 9e', neighbors: ['champs-elysees', 'montmartre', 'pigalle'] },
    'montmartre': { key: 'montmartre', name: 'Montmartre (18e)', neighbors: ['opera', 'batignolles', 'pigalle'] },
    'pigalle': { key: 'pigalle', name: 'Pigalle', neighbors: ['montmartre', 'opera'] },
    'marais': { key: 'marais', name: 'Le Marais (3e/4e)', neighbors: ['louvre', 'bastille'] },
    'bastille': { key: 'bastille', name: 'Bastille (11e)', neighbors: ['marais'] },
    'batignolles': { key: 'batignolles', name: 'Batignolles (17e)', neighbors: ['champs-elysees', 'montmartre'] },
    'boulogne': { key: 'boulogne', name: 'Boulogne-Billancourt', neighbors: ['passy', 'neuilly'] },
    'neuilly': { key: 'neuilly', name: 'Neuilly-sur-Seine', neighbors: ['passy', 'la-defense', 'boulogne'] },
    'la-defense': { key: 'la-defense', name: 'La Défense', neighbors: ['neuilly'] }
  },
  brussels: {
    'centre': { key: 'centre', name: 'Bruxelles-Centre', neighbors: ['ixelles', 'saint-gilles', 'schaerbeek', 'etterbeek'] },
    'ixelles': { key: 'ixelles', name: 'Ixelles / Elsene', neighbors: ['centre', 'saint-gilles', 'uccle', 'etterbeek'] },
    'saint-gilles': { key: 'saint-gilles', name: 'Saint-Gilles / Sint-Gillis', neighbors: ['centre', 'ixelles', 'anderlecht'] },
    'uccle': { key: 'uccle', name: 'Uccle / Ukkel', neighbors: ['ixelles'] },
    'etterbeek': { key: 'etterbeek', name: 'Etterbeek', neighbors: ['centre', 'ixelles', 'woluwe-saint-pierre'] },
    'schaerbeek': { key: 'schaerbeek', name: 'Schaerbeek / Schaarbeek', neighbors: ['centre', 'woluwe-saint-lambert'] },
    'woluwe-saint-lambert': { key: 'woluwe-saint-lambert', name: 'Woluwe-Saint-Lambert', neighbors: ['schaerbeek', 'woluwe-saint-pierre'] },
    'woluwe-saint-pierre': { key: 'woluwe-saint-pierre', name: 'Woluwe-Saint-Pierre', neighbors: ['etterbeek', 'woluwe-saint-lambert'] },
    'anderlecht': { key: 'anderlecht', name: 'Anderlecht', neighbors: ['saint-gilles', 'centre'] }
  },
  frankfurt: {
    'innenstadt': { key: 'innenstadt', name: 'Innenstadt', neighbors: ['bahnhofsviertel', 'westend', 'sachsenhausen', 'nordend'] },
    'bahnhofsviertel': { key: 'bahnhofsviertel', name: 'Bahnhofsviertel (Red Light)', neighbors: ['innenstadt', 'gallus', 'westend'] },
    'westend': { key: 'westend', name: 'Westend', neighbors: ['innenstadt', 'bockenheim', 'nordend'] },
    'sachsenhausen': { key: 'sachsenhausen', name: 'Sachsenhausen', neighbors: ['innenstadt'] },
    'nordend': { key: 'nordend', name: 'Nordend', neighbors: ['innenstadt', 'bornheim', 'westend'] },
    'bornheim': { key: 'bornheim', name: 'Bornheim', neighbors: ['nordend', 'ostend'] },
    'gallus': { key: 'gallus', name: 'Gallus & Europaviertel', neighbors: ['bahnhofsviertel', 'bockenheim'] },
    'bockenheim': { key: 'bockenheim', name: 'Bockenheim', neighbors: ['westend', 'gallus'] },
    'ostend': { key: 'ostend', name: 'Ostend', neighbors: ['innenstadt', 'bornheim'] }
  },
  hamburg: {
    'st-pauli': { key: 'st-pauli', name: 'St. Pauli (Reeperbahn)', neighbors: ['altona', 'hamburg-mitte', 'sternschanze'] },
    'hamburg-mitte': { key: 'hamburg-mitte', name: 'Hamburg-Mitte', neighbors: ['st-pauli', 'hafencity', 'altona'] },
    'altona': { key: 'altona', name: 'Altona', neighbors: ['st-pauli', 'eimsbuttel'] },
    'eimsbuttel': { key: 'eimsbuttel', name: 'Eimsbüttel', neighbors: ['altona', 'sternschanze', 'winterhude'] },
    'winterhude': { key: 'winterhude', name: 'Winterhude', neighbors: ['uhlenhorst', 'eimsbuttel'] },
    'hafencity': { key: 'hafencity', name: 'HafenCity', neighbors: ['hamburg-mitte', 'st-pauli'] },
    'sternschanze': { key: 'sternschanze', name: 'Sternschanze', neighbors: ['st-pauli', 'eimsbuttel', 'altona'] },
    'uhlenhorst': { key: 'uhlenhorst', name: 'Uhlenhorst', neighbors: ['winterhude', 'hamburg-mitte'] }
  },
  munich: {
    'altstadt': { key: 'altstadt', name: 'Altstadt-Lehel', neighbors: ['schwabing', 'maxvorstadt', 'ludwigsvorstadt', 'haidhausen'] },
    'schwabing': { key: 'schwabing', name: 'Schwabing', neighbors: ['maxvorstadt', 'altstadt', 'bogenhausen'] },
    'maxvorstadt': { key: 'maxvorstadt', name: 'Maxvorstadt', neighbors: ['schwabing', 'altstadt'] },
    'ludwigsvorstadt': { key: 'ludwigsvorstadt', name: 'Ludwigsvorstadt-Isarvorstadt', neighbors: ['altstadt', 'sendling'] },
    'bogenhausen': { key: 'bogenhausen', name: 'Bogenhausen', neighbors: ['schwabing', 'haidhausen'] },
    'haidhausen': { key: 'haidhausen', name: 'Haidhausen', neighbors: ['altstadt', 'bogenhausen'] },
    'sendling': { key: 'sendling', name: 'Sendling', neighbors: ['ludwigsvorstadt'] },
    'nymphenburg': { key: 'nymphenburg', name: 'Nymphenburg', neighbors: ['maxvorstadt'] }
  }
};

function normalizeSlugToken(str: string): string {
  return str
    .toLowerCase()
    .replace(/[ğ]/g, 'g')
    .replace(/[ü]/g, 'u')
    .replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i')
    .replace(/[ö]/g, 'o')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '-');
}

export function getCityDistricts(citySlug: string): DistrictInfo[] {
  const normCity = normalizeSlugToken(citySlug);
  const map = DISTRICTS_BY_CITY[normCity];
  if (!map) return [];
  return Object.values(map);
}

export function extractDistrictFromSlug(
  citySlug: string,
  rawSlug: string
): { district: DistrictInfo | null; remainingSlug: string } {
  const normCity = normalizeSlugToken(citySlug);
  const districts = DISTRICTS_BY_CITY[normCity];
  if (!districts) {
    return { district: null, remainingSlug: rawSlug };
  }

  const sortedKeys = Object.keys(districts).sort((a, b) => b.length - a.length);
  const cleanRaw = rawSlug.toLowerCase();

  for (const key of sortedKeys) {
    const d = districts[key];
    const regex = new RegExp(`(^|-)${key}(-|$)`);
    if (regex.test(cleanRaw)) {
      const remaining = cleanRaw.replace(regex, '$1$2').replace(/^-+|-+$/g, '').replace(/--+/g, '-');
      return { district: d, remainingSlug: remaining };
    }
  }

  return { district: null, remainingSlug: rawSlug };
}

export function getNearbyDistrictNames(citySlug: string, districtKey: string): string[] {
  const normCity = normalizeSlugToken(citySlug);
  const districts = DISTRICTS_BY_CITY[normCity];
  if (!districts || !districts[districtKey]) return [];

  const neighborKeys = districts[districtKey].neighbors;
  return neighborKeys
    .map(k => districts[k]?.name)
    .filter(Boolean);
}
