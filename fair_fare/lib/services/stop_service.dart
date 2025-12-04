import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/stop_model.dart';

class StopService {
  final _db = FirebaseFirestore.instance.collection("stops");

  Stream<List<StopModel>> getStops() {
    return _db.snapshots().map((snap) {
      return snap.docs.map((d) => StopModel.fromJson(d.id, d.data())).toList();
    });
  }

  Future<void> addStop(StopModel stop) async {
    await _db.add(stop.toJson());
  }

  Future<void> updateStop(String id, StopModel stop) async {
    await _db.doc(id).update(stop.toJson());
  }

  Future<void> deleteStop(String id) async {
    await _db.doc(id).delete();
  }
}
