import 'dart:async';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';
import 'dart:math';
import 'package:fair_fare_app/services/directions_service.dart';
import 'package:fair_fare_app/providers/places_provider.dart';
//import '../models/place_model.dart';
//import 'package:flutter_typeahead/flutter_typeahead.dart'; // optional

// helper: haversine (meters)
double haversineDistanceMeters(
    double lat1, double lon1, double lat2, double lon2) {
  const R = 6371000.0; // metres
  final phi1 = lat1 * (3.141592653589793 / 180.0);
  final phi2 = lat2 * (3.141592653589793 / 180.0);
  final dphi = (lat2 - lat1) * (3.141592653589793 / 180.0);
  final dlambda = (lon2 - lon1) * (3.141592653589793 / 180.0);

  final a = (sin(dphi / 2) * sin(dphi / 2)) +
      (cos(phi1) * cos(phi2) * sin(dlambda / 2) * sin(dlambda / 2));
  final c = 2 * atan2(sqrt(a), sqrt(1 - a));
  return R * c;
}

// import math functions

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});
  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final Completer<GoogleMapController> _mapController = Completer();
  LatLng? _currentLocation;
  final TextEditingController _destCtrl = TextEditingController();
  final DirectionsService _dirService = DirectionsService();

  Set<Marker> _markers = {};
  Set<Polyline> _polylines = {};
  bool _loadingRoute = false;

  @override
  void initState() {
    super.initState();
    _initLocation();
    // load places from provider
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PlacesProvider>().loadPlaces();
    });
  }

  Future<void> _initLocation() async {
    try {
      LocationPermission perm = await Geolocator.checkPermission();
      if (perm == LocationPermission.denied) {
        perm = await Geolocator.requestPermission();
      }
      final pos = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high);
      setState(() {
        _currentLocation = LatLng(pos.latitude, pos.longitude);
        _markers.add(Marker(
            markerId: const MarkerId('me'),
            position: _currentLocation!,
            infoWindow: const InfoWindow(title: 'You')));
      });
      _moveCamera(_currentLocation!);
    } catch (e) {
      // handle error or show prompt
      debugPrint('Location error: $e');
    }
  }

  Future<void> _moveCamera(LatLng latlng) async {
    final ctrl = await _mapController.future;
    await ctrl.animateCamera(CameraUpdate.newLatLngZoom(latlng, 14.0));
  }

  Future<void> _useCurrentLocation() async {
    await _initLocation();
  }

  // user typed address -> geocode and show route
  Future<void> _searchDestinationAndRoute(String address) async {
    if (_currentLocation == null) {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Current location unavailable')));
      return;
    }
    setState(() => _loadingRoute = true);
    final dest = await _dirService.geocodeAddress(address);
    if (dest == null) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Destination not found')));
      setState(() => _loadingRoute = false);
      return;
    }
    setState(() {
      _markers.removeWhere((m) => m.markerId.value == 'dest');
      _markers.add(Marker(
          markerId: const MarkerId('dest'),
          position: dest,
          infoWindow: InfoWindow(title: address)));
    });

    final directions = await _dirService.getDirections(
        origin: _currentLocation!, destination: dest);
    if (directions == null) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Route not found')));
      setState(() => _loadingRoute = false);
      return;
    }

    // add polyline
    final poly = Polyline(
      polylineId: const PolylineId('route'),
      points: directions.polyline,
      color: Colors.blue,
      width: 6,
    );

    setState(() {
      _polylines = {poly};
    });

    // move camera to show route bounds roughly at midpoint
    if (directions.polyline.isNotEmpty) {
      final mid = directions.polyline[(directions.polyline.length / 2).floor()];
      _moveCamera(mid);
    }

    setState(() => _loadingRoute = false);
  }

  // place nearby markers from provider (within X meters)
  void _showNearbyPlaces() {
    final prov = context.read<PlacesProvider>();
    if (_currentLocation == null) return;
    final userLat = _currentLocation!.latitude;
    final userLng = _currentLocation!.longitude;
    final nearby = prov.places.where((p) {
      final d =
          haversineDistanceMeters(userLat, userLng, p.latitude, p.longitude);
      return d <= 3000; // within 3km
    }).toList();

    // create markers for them
    for (final p in nearby) {
      final marker = Marker(
        markerId: MarkerId('place_${p.id}'),
        position: LatLng(p.latitude, p.longitude),
        infoWindow: InfoWindow(title: p.name, snippet: p.category),
        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueRose),
      );
      _markers.removeWhere((m) => m.markerId.value == marker.markerId.value);
      _markers.add(marker);
    }
    setState(() {});
  }

  // compute meters
  double haversineDistanceMeters(
      double lat1, double lon1, double lat2, double lon2) {
    const R = 6371000.0;
    final phi1 = lat1 * (pi / 180.0);
    final phi2 = lat2 * (pi / 180.0);
    final dphi = (lat2 - lat1) * (pi / 180.0);
    final dlambda = (lon2 - lon1) * (pi / 180.0);

    final a = sin(dphi / 2) * sin(dphi / 2) +
        cos(phi1) * cos(phi2) * sin(dlambda / 2) * sin(dlambda / 2);
    final c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return R * c;
  }

  @override
  Widget build(BuildContext context) {
    final prov = context.watch<PlacesProvider>();

    // show nearby after places loaded and current loc available
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_currentLocation != null && prov.places.isNotEmpty) {
        _showNearbyPlaces();
      }
    });

    return Scaffold(
      appBar: AppBar(title: const Text('Find Route')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(10),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _destCtrl,
                    decoration: const InputDecoration(
                      hintText: 'Enter destination',
                      border: OutlineInputBorder(),
                      contentPadding:
                          EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                    ),
                    onSubmitted: (v) => _searchDestinationAndRoute(v),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: _loadingRoute
                      ? null
                      : () => _searchDestinationAndRoute(_destCtrl.text.trim()),
                  child: _loadingRoute
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white))
                      : const Icon(Icons.search),
                )
              ],
            ),
          ),

          Expanded(
            child: Stack(
              children: [
                if (_currentLocation != null)
                  GoogleMap(
                    initialCameraPosition:
                        CameraPosition(target: _currentLocation!, zoom: 14),
                    myLocationEnabled: true,
                    myLocationButtonEnabled: false,
                    markers: _markers,
                    polylines: _polylines,
                    onMapCreated: (gm) {
                      if (!_mapController.isCompleted)
                        _mapController.complete(gm);
                    },
                  )
                else
                  const Center(child: CircularProgressIndicator()),

                // current location floating button
                Positioned(
                  bottom: 16,
                  right: 16,
                  child: FloatingActionButton(
                    onPressed: _useCurrentLocation,
                    child: const Icon(Icons.my_location),
                  ),
                ),
              ],
            ),
          ),

          // Nearby places list
          SizedBox(
            height: 140,
            child: prov.loading
                ? const Center(child: CircularProgressIndicator())
                : ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 10),
                    children: prov.places.map((p) {
                      // compute distance
                      final dist = _currentLocation != null
                          ? haversineDistanceMeters(
                              _currentLocation!.latitude,
                              _currentLocation!.longitude,
                              p.latitude,
                              p.longitude)
                          : double.infinity;
                      return GestureDetector(
                        onTap: () async {
                          // center map on this place and open Info
                          final ctrl = await _mapController.future;
                          await ctrl.animateCamera(CameraUpdate.newLatLngZoom(
                              LatLng(p.latitude, p.longitude), 15));
                        },
                        child: Container(
                          width: 250,
                          margin: const EdgeInsets.only(right: 12),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [
                              BoxShadow(
                                  color: Colors.black12,
                                  blurRadius: 6,
                                  offset: Offset(0, 2)),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(p.name,
                                  style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold)),
                              const SizedBox(height: 6),
                              Text(p.category),
                              const SizedBox(height: 6),
                              Text(dist.isFinite
                                  ? '${(dist / 1000).toStringAsFixed(2)} km'
                                  : '—'),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  ),
          ),
        ],
      ),
    );
  }
}
