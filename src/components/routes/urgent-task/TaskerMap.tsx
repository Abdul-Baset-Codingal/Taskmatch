import { useState, useEffect, useRef } from 'react';
import { FaExclamationTriangle, FaLocationArrow, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
const TaskerMap = ({ taskers = [], selectedTasker, onTaskerSelect }) => {
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [leafletLoaded, setLeafletLoaded] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [mapMarkers, setMapMarkers] = useState(null);
    const [loadError, setLoadError] = useState(null);

    // Known locations for GTA areas
    const knownLocations = {
        'toronto': { lat: 43.6532, lng: -79.3832 },
        'greater toronto area': { lat: 43.6532, lng: -79.3832 },
        'gta': { lat: 43.6532, lng: -79.3832 },
        'markham': { lat: 43.8561, lng: -79.3370 },
        'north york': { lat: 43.7615, lng: -79.4111 },
        'scarborough': { lat: 43.7764, lng: -79.2318 },
        'mississauga': { lat: 43.589045, lng: -79.644120 },
        'etobicoke': { lat: 43.6532, lng: -79.5672 },
        'brampton': { lat: 43.7315, lng: -79.7624 },
        'vaughan': { lat: 43.8361, lng: -79.4982 }
    };

    // Load Leaflet dynamically with fallback and timeout
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const loadLeaflet = async () => {
            if (window.L) {
                setLeafletLoaded(true);
                return () => { };
            }

            const loadResource = async (url, type) => {
                if (type === 'css') {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = url;
                    document.head.appendChild(link);
                    return new Promise((resolve, reject) => {
                        link.onload = resolve;
                        link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
                    });
                } else {
                    const script = document.createElement('script');
                    script.src = url;
                    script.async = true;
                    document.head.appendChild(script);
                    return new Promise((resolve, reject) => {
                        script.onload = resolve;
                        script.onerror = () => reject(new Error(`Failed to load JS: ${url}`));
                    });
                }
            };

            const primaryUrls = {
                css: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
                js: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
            };
            const fallbackUrls = {
                css: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
                js: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
            };

            const timeoutPromise = (promise, ms) => {
                return Promise.race([
                    promise,
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout loading resource')), ms))
                ]);
            };

            let cssElement, jsElement;
            try {
                try {
                    [cssElement, jsElement] = await Promise.all([
                        timeoutPromise(loadResource(primaryUrls.css, 'css'), 5000),
                        timeoutPromise(loadResource(primaryUrls.js, 'js'), 5000)
                    ]);
                } catch (error) {
                    console.warn('Primary CDN failed, trying fallback:', error);
                    [cssElement, jsElement] = await Promise.all([
                        timeoutPromise(loadResource(fallbackUrls.css, 'css'), 5000),
                        timeoutPromise(loadResource(fallbackUrls.js, 'js'), 5000)
                    ]);
                }
                setLeafletLoaded(true);
                return () => {
                    if (cssElement?.parentNode) document.head.removeChild(cssElement);
                    if (jsElement?.parentNode) document.head.removeChild(jsElement);
                };
            } catch (error) {
                console.error('Failed to load Leaflet:', error);
                setLoadError('Unable to load map. Please check your internet connection and try again.');
                return () => { };
            }
        };

        let cleanup;
        loadLeaflet().then(clean => { cleanup = clean; }).catch(console.error);

        return () => {
            if (cleanup) cleanup();
        };
    }, []);

    // Initialize map when Leaflet is loaded
    useEffect(() => {
        if (!leafletLoaded || !mapRef.current || map) return;

        const L = window.L;
        if (!L) {
            setLoadError('Map library failed to initialize.');
            return;
        }

        const newMap = L.map(mapRef.current, {
            attributionControl: true
        }).setView([43.6532, -79.3832], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(newMap);

        setMap(newMap);
        setMapMarkers(L.layerGroup().addTo(newMap));

        return () => {
            newMap.remove();
            setMap(null);
            setMapMarkers(null);
        };
    }, [leafletLoaded]);

    // Get user's current location
    const getCurrentLocation = () => {
        setIsLoadingLocation(true);
        setLocationError(null);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const userPos = { lat: latitude, lng: longitude };
                    setUserLocation(userPos);
                    setIsLoadingLocation(false);

                    if (map) {
                        map.setView([latitude, longitude], 14);
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                    let errorMessage = "Unable to get your location";
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = "Location access denied. Please enable location services.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = "Location information is unavailable.";
                            break;
                        case error.TIMEOUT:
                            errorMessage = "The request to get your location timed out.";
                            break;
                        default:
                            break;
                    }
                    setLocationError(errorMessage);
                    setIsLoadingLocation(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        } else {
            setLocationError("Geolocation is not supported by this browser");
            setIsLoadingLocation(false);
        }
    };

    // Process taskers and create markers
    useEffect(() => {
        if (!map || !mapMarkers || !taskers?.length) return;

        const L = window.L;
        mapMarkers.clearLayers();
        const bounds = L.latLngBounds([]);

        taskers.forEach(tasker => {
            if (!tasker.serviceAreas?.length) return;

            tasker.serviceAreas.forEach(area => {
                try {
                    const cleanArea = area.toLowerCase()
                        .replace(/&.*?\)/, '')
                        .replace(/\(.*?\)/g, '')
                        .split(',')[0]
                        .trim();

                    const coords = knownLocations[cleanArea] || knownLocations['toronto'];
                    const isSelected = selectedTasker?._id === tasker._id;

                    const customIcon = L.divIcon({
                        html: `
                            <div class="flex flex-col items-center">
                                <div class="p-2 rounded-full shadow-lg border-2 transition-all duration-300 ${isSelected
                                ? 'bg-gradient-to-r from-purple-500 to-pink-400 border-white scale-125 animate-bounce'
                                : 'bg-gradient-to-r from-orange-400 to-pink-400 border-white hover:scale-110'
                            }">
                                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <div class="text-xs text-center mt-1 px-2 py-1 rounded shadow max-w-24 truncate ${isSelected
                                ? 'bg-gradient-to-r from-purple-500 to-pink-400 text-white font-semibold'
                                : 'bg-white text-gray-700 border'
                            }">
                                    ${(tasker.fullName || '').replace(/[<>&"]/g, '')}
                                </div>
                            </div>
                        `,
                        className: 'custom-div-icon',
                        iconSize: [40, 60],
                        iconAnchor: [20, 60]
                    });

                    const marker = L.marker([coords.lat, coords.lng], {
                        icon: customIcon
                    }).addTo(mapMarkers);

                    const popupContent = document.createElement('div');
                    popupContent.className = 'p-2';
                    popupContent.innerHTML = `
                        <h3 class="font-bold text-purple-600">${(tasker.fullName || '').replace(/[<>&"]/g, '')}</h3>
                        <p class="text-sm text-gray-600">${(tasker.service || '').replace(/[<>&"]/g, '')}</p>
                        <p class="text-xs text-gray-500 mt-1">📍 ${(area || '').replace(/[<>&"]/g, '')}</p>
                        ${tasker.rate ? `<p class="text-xs text-green-600 font-semibold mt-1">$${tasker.rate}/hr</p>` : ''}
                    `;
                    const button = document.createElement('button');
                    button.className = 'mt-2 w-full bg-[#8560F1] text-white text-xs py-1 rounded hover:bg-[#FF8609] transition-colors';
                    button.textContent = 'View Profile';
                    button.onclick = (e) => {
                        e.stopPropagation();
                        onTaskerSelect(tasker._id);
                    };
                    popupContent.appendChild(button);

                    marker.bindPopup(popupContent);
                    marker.on('click', () => onTaskerSelect(tasker._id));
                    bounds.extend([coords.lat, coords.lng]);
                } catch (error) {
                    console.error(`Error processing area "${area}":`, error);
                }
            });
        });

        if (userLocation) {
            const userIcon = L.divIcon({
                html: `
                    <div class="flex flex-col items-center animate-pulse">
                        <div class="bg-blue-500 rounded-full p-2 shadow-lg border-2 border-white">
                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <div class="text-xs text-center mt-1 bg-blue-500 text-white px-2 py-1 rounded shadow">
                            You are here
                        </div>
                    </div>
                `,
                className: 'user-location-icon',
                iconSize: [40, 60],
                iconAnchor: [20, 60]
            });

            const userMarker = L.marker([userLocation.lat, userLocation.lng], {
                icon: userIcon
            }).addTo(mapMarkers);

            bounds.extend([userLocation.lat, userLocation.lng]);
        }

        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, mapMarkers, taskers, selectedTasker, userLocation, onTaskerSelect]);

    return (
        <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-[1000] bg-white shadow-md p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FaMapMarkerAlt className="text-2xl text-[#8560F1]" aria-hidden="true" />
                        <h2 className="text-xl font-bold text-gray-800">Tasker Locations</h2>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                            Greater Toronto Area
                        </span>
                    </div>
                    <button
                        onClick={getCurrentLocation}
                        disabled={isLoadingLocation}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                        aria-label={isLoadingLocation ? 'Getting location' : 'Find my location'}
                    >
                        {isLoadingLocation ? (
                            <FaSpinner className="animate-spin" aria-hidden="true" />
                        ) : (
                            <FaLocationArrow aria-hidden="true" />
                        )}
                        <span>{isLoadingLocation ? 'Getting Location...' : 'My Location'}</span>
                    </button>
                </div>

                {selectedTasker && selectedTasker.fullName && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] rounded-lg text-white">
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-lg" aria-hidden="true" />
                            <span className="font-semibold">{selectedTasker.fullName.replace(/[<>&"]/g, '')}</span>
                        </div>
                        <div className="text-sm opacity-90 mt-1">
                            {(selectedTasker.serviceAreas || []).map(area => area.replace(/[<>&"]/g, '')).join(', ')}
                        </div>
                    </div>
                )}

                {locationError && (
                    <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2 text-red-700">
                        <FaExclamationTriangle aria-hidden="true" />
                        <span>{locationError}</span>
                    </div>
                )}

                {loadError && (
                    <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2 text-red-700">
                        <FaExclamationTriangle aria-hidden="true" />
                        <span>{loadError}</span>
                    </div>
                )}
            </div>

            {/* Map Container */}
            <div className="absolute top-0 left-0 right-0 bottom-0 ">
                {!leafletLoaded && !loadError ? (
                    <div className="flex justify-center items-center h-full bg-gray-100">
                        <div className="text-lg font-semibold text-gray-600 flex items-center gap-2">
                            <FaSpinner className="animate-spin text-[#8560F1]" aria-hidden="true" />
                            Loading Map...
                        </div>
                    </div>
                ) : loadError ? (
                    <div className="flex justify-center items-center h-full bg-gray-100">
                        <div className="text-lg font-semibold text-red-600 flex items-center gap-2">
                            <FaExclamationTriangle aria-hidden="true" />
                            {loadError}
                        </div>
                    </div>
                ) : (
                    <div
                        ref={mapRef}
                        className="w-full h-full rounded-lg shadow-lg"
                        style={{ zIndex: 1 }}
                        aria-label="Map showing tasker locations"
                    />
                )}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
                <h3 className="font-semibold text-gray-800 mb-2">Legend</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"></div>
                        <span>Available Taskers</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full"></div>
                        <span>Selected Tasker</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span>Your Location</span>
                    </div>
                </div>
            </div>

            {/* Tasker Count */}
            <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
                <div className="text-center">
                    <div className="text-2xl font-bold text-[#8560F1]">
                        {taskers.reduce((count, tasker) => count + (tasker.serviceAreas?.length || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Service Areas</div>
                </div>
            </div>
        </div>
    );
};

export default TaskerMap;