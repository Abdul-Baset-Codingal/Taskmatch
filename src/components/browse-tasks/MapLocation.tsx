/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaLocationArrow, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const MapLocation = ({ selectedTask, tasks = [] }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 22.3569, lng: 91.7832 }); // Default to Chittagong
    const [zoom, setZoom] = useState(10);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [leafletLoaded, setLeafletLoaded] = useState(false);

    // Load Leaflet dynamically
    useEffect(() => {
        const loadLeaflet = async () => {
            if (typeof window !== 'undefined' && !window.L) {
                // Load Leaflet CSS
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(cssLink);

                // Load Leaflet JS
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.onload = () => setLeafletLoaded(true);
                document.head.appendChild(script);
            } else if (window.L) {
                setLeafletLoaded(true);
            }
        };

        loadLeaflet();
    }, []);

    // FREE Geocoding using Nominatim (OpenStreetMap) - Improved
    const geocodeLocation = async (locationString) => {
        if (!locationString || locationString.trim() === '') {
            console.log('⚠️ Empty location string');
            return { lat: 22.3569, lng: 91.7832 };
        }

        try {
            // Try multiple search strategies
            const searchQueries = [
                `${locationString}, Bangladesh`,
                `${locationString}, Chittagong, Bangladesh`,
                `${locationString}, Dhaka, Bangladesh`,
                locationString // Original query as fallback
            ];

            for (const query of searchQueries) {
                console.log(`🔍 Trying query: "${query}"`);

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1&countrycodes=bd`,
                    {
                        headers: {
                            'User-Agent': 'TaskLocationApp/1.0'
                        }
                    }
                );

                if (!response.ok) {
                    console.log(`❌ HTTP error for "${query}": ${response.status}`);
                    continue;
                }

                const data = await response.json();
                console.log(`📍 Response for "${query}":`, data);

                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    const coords = { lat: parseFloat(lat), lng: parseFloat(lon) };
                    console.log(`✅ Found coordinates for "${locationString}":`, coords);
                    return coords;
                }
            }

            console.warn(`⚠️ No results found for any variation of: ${locationString}`);
            // Fallback to default location
            return { lat: 22.3569, lng: 91.7832 };

        } catch (error) {
            console.error('❌ Error geocoding location:', error);
            // Fallback to default location (Chittagong)
            return { lat: 22.3569, lng: 91.7832 };
        }
    };

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
                    setMapCenter(userPos);
                    setZoom(14);
                    setIsLoadingLocation(false);

                    // Pan map to user location if map exists
                    if (map) {
                        map.setView([latitude, longitude], 14);
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocationError("Unable to get your location");
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

    // Initialize map
    useEffect(() => {
        if (leafletLoaded && mapRef.current && !map) {
            const L = window.L;

            const newMap = L.map(mapRef.current).setView([mapCenter.lat, mapCenter.lng], zoom);

            // Add OpenStreetMap tiles (FREE!)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(newMap);

            setMap(newMap);
        }
    }, [leafletLoaded, mapCenter.lat, mapCenter.lng, zoom]);

    // Create task markers with coordinates (with caching)
    const [taskMarkers, setTaskMarkers] = useState([]);
    const [geocodingCache, setGeocodingCache] = useState({});
    const [mapMarkers, setMapMarkers] = useState([]);
    const [debugInfo, setDebugInfo] = useState('');

    useEffect(() => {
        const createMarkers = async () => {
            console.log('🔍 Debug: Tasks received:', tasks);
            setDebugInfo(`Tasks received: ${tasks ? tasks.length : 0}`);

            if (tasks && tasks.length > 0) {
                console.log('📍 Processing locations:', tasks.map(t => t.location));

                const markers = [];
                for (let i = 0; i < tasks.length; i++) {
                    const task = tasks[i];
                    console.log(`🗺️ Processing task ${i + 1}/${tasks.length}: "${task.location}"`);

                    // Check cache first
                    if (geocodingCache[task.location]) {
                        console.log(`✅ Using cached location for: ${task.location}`);
                        markers.push({
                            ...task,
                            coordinates: geocodingCache[task.location]
                        });
                        continue;
                    }

                    // Add delay to respect Nominatim rate limits (1 request per second)
                    if (i > 0) {
                        console.log('⏳ Waiting 1 second for rate limiting...');
                        await new Promise(resolve => setTimeout(resolve, 1100));
                    }

                    try {
                        // Geocode the location
                        console.log(`🌐 Geocoding: "${task.location}"`);
                        const coords = await geocodeLocation(task.location);
                        console.log(`📌 Geocoded result:`, coords);

                        // Update cache
                        setGeocodingCache(prev => ({
                            ...prev,
                            [task.location]: coords
                        }));

                        markers.push({
                            ...task,
                            coordinates: coords
                        });
                    } catch (error) {
                        console.error(`❌ Error geocoding ${task.location}:`, error);
                        // Use default coordinates if geocoding fails
                        markers.push({
                            ...task,
                            coordinates: { lat: 22.3569, lng: 91.7832 }
                        });
                    }
                }

                console.log('✅ Final markers:', markers);
                setTaskMarkers(markers);
                setDebugInfo(`Successfully processed ${markers.length} tasks`);
            } else {
                console.log('⚠️ No tasks to process');
                setDebugInfo('No tasks available');
                setTaskMarkers([]);
            }
        };

        createMarkers();
    }, [tasks]);

    // Add markers to map
    useEffect(() => {
        if (map && taskMarkers.length > 0 && leafletLoaded) {
            const L = window.L;

            // Clear existing markers
            mapMarkers.forEach(marker => map.removeLayer(marker));

            const newMarkers = taskMarkers.map(task => {
                const isSelected = selectedTask?._id === task._id;

                // Create custom icon
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
                                ${task.taskTitle}
                            </div>
                        </div>
                    `,
                    className: 'custom-div-icon',
                    iconSize: [40, 60],
                    iconAnchor: [20, 60]
                });

                const marker = L.marker([task.coordinates.lat, task.coordinates.lng], {
                    icon: customIcon
                }).addTo(map);

                // Add popup
                marker.bindPopup(`
                    <div class="p-2">
                        <h3 class="font-bold text-purple-600">${task.taskTitle}</h3>
                        <p class="text-sm text-gray-600">${task.serviceTitle}</p>
                        <p class="text-xs text-gray-500 mt-1">📍 ${task.location}</p>
                        <p class="text-xs text-green-600 font-semibold mt-1">$${task.price || 'N/A'}</p>
                    </div>
                `);

                return marker;
            });

            // Add user location marker
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
                }).addTo(map);

                newMarkers.push(userMarker);
            }

            setMapMarkers(newMarkers);
        }
    }, [map, taskMarkers, selectedTask, userLocation, leafletLoaded]);

    // Focus on selected task location
    useEffect(() => {
        if (selectedTask && selectedTask.location && map) {
            geocodeLocation(selectedTask.location).then(coords => {
                map.setView([coords.lat, coords.lng], 15);
            });
        }
    }, [selectedTask, map]);

    return (
        <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-[1000] bg-white shadow-md p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FaMapMarkerAlt className="text-2xl text-[#8560F1]" />
                        <h2 className="text-xl font-bold text-gray-800">Task Locations</h2>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                            FREE OpenStreetMap
                        </span>
                    </div>
                    <button
                        onClick={getCurrentLocation}
                        disabled={isLoadingLocation}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                    >
                        {isLoadingLocation ? (
                            <FaSpinner className="animate-spin" />
                        ) : (
                            <FaLocationArrow />
                        )}
                        <span>{isLoadingLocation ? 'Getting Location...' : 'My Location'}</span>
                    </button>
                </div>

                {selectedTask && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-[#8560F1] to-[#E7B6FE] rounded-lg text-white">
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-lg" />
                            <span className="font-semibold">{selectedTask.taskTitle}</span>
                        </div>
                        <div className="text-sm opacity-90 mt-1">
                            📍 {selectedTask.location}
                        </div>
                    </div>
                )}

                {locationError && (
                    <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2 text-red-700">
                        <FaExclamationTriangle />
                        <span>{locationError}</span>
                    </div>
                )}
            </div>

          
            <div className="absolute inset-0 mt-32">
                {!leafletLoaded ? (
                    <div className="flex justify-center items-center h-full bg-gray-100">
                        <div className="text-lg font-semibold text-gray-600 flex items-center gap-2">
                            <FaSpinner className="animate-spin text-[#8560F1]" />
                            Loading Map...
                        </div>
                    </div>
                ) : (
                    <div
                        ref={mapRef}
                        className="w-full h-full rounded-lg shadow-lg"
                        style={{ zIndex: 1 }}
                    />
                )}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
                <h3 className="font-semibold text-gray-800 mb-2">Legend</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"></div>
                        <span>Available Tasks</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full"></div>
                        <span>Selected Task</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span>Your Location</span>
                    </div>
                </div>
            </div>

            {/* Task Count */}
            <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
                <div className="text-center">
                    <div className="text-2xl font-bold text-[#8560F1]">{taskMarkers.length}</div>
                    <div className="text-sm text-gray-600">Available Tasks</div>
                </div>
            </div>
        </div>
    );
};

export default MapLocation;