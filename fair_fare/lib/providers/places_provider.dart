import 'package:flutter/material.dart';
import '../models/place_model.dart';
import '../services/places_service.dart';

class PlacesProvider extends ChangeNotifier {
  final PlacesService _service = PlacesService();

  List<PlaceModel> places = [];
  bool loading = false;

  PlacesProvider() {
    loadPlaces();
  }

  Future<void> loadPlaces() async {
    loading = true;
    notifyListeners();
    places = await _service.fetchAllPlaces();
    loading = false;
    notifyListeners();
  }

  Future<void> addPlace(PlaceModel place) async {
    await _service.addPlace(place);
    await loadPlaces();
  }

  Future<void> updatePlace(PlaceModel place) async {
    await _service.updatePlace(place);
    await loadPlaces();
  }

  Future<void> deletePlace(String category, String id) async {
    await _service.deletePlace(category, id);
    await loadPlaces();
  }
}
