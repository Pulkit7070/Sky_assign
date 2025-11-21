# OpenStreetMap (OSM) Location Search - 100% FREE! 🗺️

Sky uses **OpenStreetMap** with **Photon** and **Nominatim** for location-based searches - completely free with zero billing and no API keys required!

## 🌟 Why OpenStreetMap?

- ✅ **100% Free Forever** - No API keys, no billing, no hidden costs
- ✅ **No Setup Required** - Works out of the box
- ✅ **Privacy-Friendly** - Open source and community-driven
- ✅ **Global Coverage** - Worldwide place data
- ✅ **Zero Configuration** - Just install and use!

## 🔧 Services Used

### 1. Photon API by Komoot (Place Search)

**What it does:** Search for places, POIs, addresses worldwide

**API Endpoint:** `https://photon.komoot.io/api/`

**Features:**

- Search restaurants, cafes, shops, ATMs, hospitals, etc.
- Location-based search with radius filtering
- Text search with location bias
- Geocoding and reverse geocoding

**Example Search:**

```
https://photon.komoot.io/api/?q=restaurant&lat=28.6139&lon=77.2090
```

**Documentation:** [Photon API Docs](https://photon.komoot.io/)

### 2. Nominatim (Geocoding)

**What it does:** Convert addresses to coordinates and vice versa

**API Endpoint:** `https://nominatim.openstreetmap.org/`

**Features:**

- Address → Coordinates (Geocoding)
- Coordinates → Address (Reverse Geocoding)
- Location name resolution

**Example:**

```
https://nominatim.openstreetmap.org/search?q=Connaught+Place+Delhi&format=json
```

**Documentation:** [Nominatim API Docs](https://nominatim.org/release-docs/latest/api/Overview/)

## 💬 Usage Examples

### Nearby Search (Uses Current Location)

Ask Sky to find places near you:

- "Find restaurants near me"
- "Coffee shops nearby"
- "ATMs close to me"
- "Grocery stores near my location"
- "Hospitals nearby"

### Text Search (Specific Location)

Search for places in specific cities:

- "Restaurants in Connaught Place"
- "Coffee shops in Manhattan"
- "Gyms in San Francisco"
- "Hotels in Paris"
- "Pharmacies in London"

### Supported Place Types

The app can search for:

- 🍽️ **Restaurants** - "restaurants", "food", "dining"
- ☕ **Cafes** - "cafe", "coffee shop", "coffee"
- 🏪 **Shops** - "grocery", "supermarket", "store", "shop"
- 🏥 **Healthcare** - "hospital", "clinic", "pharmacy", "doctor"
- 🏨 **Hotels** - "hotel", "accommodation", "motel"
- 🏦 **Banks** - "bank", "ATM", "banking"
- 🏋️ **Fitness** - "gym", "fitness center", "sports"
- 🏫 **Education** - "school", "university", "college"
- 🌳 **Recreation** - "park", "playground", "garden"
- And many more...

## 🎯 How It Works

1. **You ask:** "Find restaurants near me"
2. **Sky detects** it's a location query using NLP
3. **Gets your location** (with permission)
4. **Calls Photon API** to search nearby restaurants
5. **Displays results:**

   ```
   I found 5 places:

   1. **Olive Garden** (restaurant)
      123 Main Street, New York, NY
      📍 1.2km away

   2. **Starbucks** (cafe)
      456 Broadway, New York, NY
      📍 0.8km away
   ```

## 🚀 No Setup Needed!

Unlike Google Maps Platform:

| Feature         | OpenStreetMap   | Google Maps                  |
| --------------- | --------------- | ---------------------------- |
| **API Key**     | ❌ Not required | ✅ Required                  |
| **Billing**     | ❌ Free forever | ✅ Pay per request           |
| **Setup**       | ❌ Zero config  | ✅ GCP account + enable APIs |
| **Rate Limits** | Fair use policy | Strict quotas                |
| **Privacy**     | Open source     | Proprietary                  |

## 📊 What You Get

### Place Information:

- ✅ **Name** - Place name
- ✅ **Address** - Full address with street, city, country
- ✅ **Location** - Latitude & longitude coordinates
- ✅ **Type** - restaurant, cafe, hospital, etc.
- ✅ **Category** - OSM category (amenity, shop, etc.)
- ✅ **Distance** - Distance from your location (in km)

### What's NOT Available:

- ❌ **Ratings** - No star ratings (Google proprietary)
- ❌ **Reviews** - No user reviews
- ❌ **Opening Hours** - Limited availability
- ❌ **Photos** - No place photos
- ❌ **Phone Numbers** - Limited data

## 🔒 Privacy & Fair Use

### User-Agent Requirement

OSM services require a `User-Agent` header identifying your application. Sky automatically sends:

```
User-Agent: Sky-Assistant/1.0
```

This helps OSM track usage and prevent abuse.

### Fair Use Policy

OSM services are free but have fair use guidelines:

- **No bulk downloads** - Don't scrape entire databases
- **Reasonable request rates** - Don't hammer the servers
- **Cache results** - Avoid duplicate requests
- **Attribution** - Give credit to OSM contributors

Sky respects these guidelines by:

- Limiting search results to 10 places
- Using reasonable radius filters
- Displaying attribution in results

## 🌐 Data Attribution

OpenStreetMap data is provided by millions of contributors worldwide. When using Sky's location features, remember:

> **Map data © OpenStreetMap contributors**
>
> Search powered by Photon by Komoot and Nominatim

Learn more: [OpenStreetMap Copyright](https://www.openstreetmap.org/copyright)

## 🛠️ Technical Details

### Backend Implementation

Location searches use Electron's main process to call OSM APIs:

```javascript
// Photon search example
const url = `https://photon.komoot.io/api/?q=restaurant&lat=28.6139&lon=77.2090`;
const response = await fetch(url, {
  headers: { "User-Agent": "Sky-Assistant/1.0" },
});
```

### Distance Calculation

Sky uses the Haversine formula to calculate distances:

```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  // ... Haversine calculation
  return distance; // in meters
}
```

### NLP Detection

The NLP parser detects location intents:

```javascript
isLocationIntent("find restaurants near me"); // true
parseLocationQuery("coffee in NYC"); // { type: 'text', query: 'coffee in NYC' }
```

## 🔮 Future Enhancements

Possible improvements for location features:

1. **Map Visualization** - Show results on an interactive map using Leaflet.js
2. **Overpass API** - Use Overpass for more detailed POI queries
3. **Route Planning** - Add directions between locations
4. **Favorites** - Save frequently searched places
5. **Offline Support** - Cache map tiles for offline use

## 📚 Additional Resources

- **Photon API:** https://photon.komoot.io/
- **Nominatim API:** https://nominatim.org/release-docs/latest/api/
- **OpenStreetMap:** https://www.openstreetmap.org/
- **OSM Wiki:** https://wiki.openstreetmap.org/
- **Overpass API:** https://overpass-api.de/ (advanced queries)
- **Leaflet.js:** https://leafletjs.com/ (map rendering)

## ❓ FAQ

**Q: Why not use Google Maps?**  
A: Google Maps requires billing and API keys. OSM is completely free with no setup.

**Q: Is the data accurate?**  
A: OSM data quality varies by region. Major cities have excellent coverage.

**Q: Can I contribute to OSM?**  
A: Yes! Visit [openstreetmap.org](https://www.openstreetmap.org/) to contribute.

**Q: Are there rate limits?**  
A: OSM has fair use policies but no hard limits. Don't abuse the service.

**Q: Can I use this commercially?**  
A: Yes! OSM data is open and free for commercial use with attribution.

**Q: What about offline maps?**  
A: OSM tiles can be downloaded for offline use. This may be added in future updates.

## 🎉 Get Started

No setup required! Just:

1. Ask Sky: "Find restaurants near me"
2. Grant location permission when prompted
3. See results instantly!

That's it - no API keys, no billing, no configuration! 🚀
