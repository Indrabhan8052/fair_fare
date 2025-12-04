import 'package:flutter/material.dart';
import '../models/stop_model.dart';
import '../services/stop_service.dart';

class StopProvider extends ChangeNotifier {
  final StopService _service = StopService();

  List<StopModel> stops = [];

  StopProvider() {
    loadStops();
  }

  void loadStops() {
    _service.getStops().listen((data) {
      stops = data;
      notifyListeners();
    });
  }

  Future<void> add(StopModel stop) => _service.addStop(stop);
  Future<void> update(String id, StopModel stop) =>
      _service.updateStop(id, stop);
  Future<void> delete(String id) => _service.deleteStop(id);
}
s
