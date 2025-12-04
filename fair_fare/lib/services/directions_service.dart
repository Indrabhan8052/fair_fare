import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:google_maps_flutter/google_maps_flutter.dart';

// IMPORTANT: replace with your API key (or store in env)
const String _GOOGLE_API_KEY = 'AIzaSyALlYfAV-7T_80vjDs3qeiCaVf4MhjdWrs';

class DirectionsResult {
  final List<LatLng> polyline;
  final String distanceText;
  final int distanceMeters;
  final String durationText;
  final int durationSeconds;

  DirectionsResult({
    required this.polyline,
    required this.distanceText,
    required this.distanceMeters,
    required this.durationText,
    required this.durationSeconds,
  });
}

class DirectionsService {
  // Geocode an address to LatLng
  Future<LatLng?> geocodeAddress(String address) async {
    final url = Uri.parse(
        'https://maps.googleapis.com/maps/api/geocode/json?address=${Uri.encodeComponent(address)}&key=$_GOOGLE_API_KEY');
    final res = await http.get(url);
    if (res.statusCode != 200) return null;
    final j = json.decode(res.body);
    if (j['status'] != 'OK' || (j['results'] as List).isEmpty) return null;
    final loc = j['results'][0]['geometry']['location'];
    return LatLng(
        (loc['lat'] as num).toDouble(), (loc['lng'] as num).toDouble());
  }

  // Get directions (driving) between origin and destination
  Future<DirectionsResult?> getDirections({
    required LatLng origin,
    required LatLng destination,
    String mode = 'driving', // driving, walking, bicycling, transit
  }) async {
    final originStr = '${origin.latitude},${origin.longitude}';
    final destStr = '${destination.latitude},${destination.longitude}';
    final url = Uri.parse(
        'https://maps.googleapis.com/maps/api/directions/json?origin=$originStr&destination=$destStr&mode=$mode&key=$_GOOGLE_API_KEY');

    final res = await http.get(url);
    if (res.statusCode != 200) return null;
    final j = json.decode(res.body);
    if (j['status'] != 'OK') return null;

    // take first route
    final route = j['routes'][0];
    final leg = route['legs'][0];
    final polyline = route['overview_polyline']['points'] as String;
    final points = _decodePolyline(polyline);

    final distText = leg['distance']['text'] as String;
    final distMeters = (leg['distance']['value'] as int);
    final durText = leg['duration']['text'] as String;
    final durSecs = (leg['duration']['value'] as int);

    return DirectionsResult(
      polyline: points,
      distanceText: distText,
      distanceMeters: distMeters,
      durationText: durText,
      durationSeconds: durSecs,
    );
  }

  // helper: decode polyline from google
  static List<LatLng> _decodePolyline(String encoded) {
    final List<LatLng> poly = [];
    int index = 0;
    int len = encoded.length;
    int lat = 0, lng = 0;

    while (index < len) {
      int b, shift = 0, result = 0;
      do {
        b = encoded.codeUnitAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      final dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.codeUnitAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      final dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      poly.add(LatLng(lat / 1e5, lng / 1e5));
    }
    return poly;
  }
}
