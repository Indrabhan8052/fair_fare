import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:fair_fare_app/models/place_model.dart';

class PlacesService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // Add new place under /places/{category}/{id}
  Future<PlaceModel> addPlace(PlaceModel place) async {
    final categoryDoc = _db.collection('places').doc(place.category);
    final col = categoryDoc.collection(place.category);
    final docRef = col.doc(); // generate id
    final withId = place.copyWith(id: docRef.id);
    await docRef.set(withId.toMap());
    return withId;
  }

  // Get a stream of all places across all categories (reading category subcollections)
  Stream<List<PlaceModel>> streamAllPlaces() async* {
    final placesRoot = _db.collection('places');
    final catSnapshot = await placesRoot.get();

    // we'll combine streams for each category
    for (var cat in catSnapshot.docs) {
      placesRoot.doc(cat.id).collection(cat.id);
      // yield each category's docs appended
    }

    // Simpler approach: re-scan on-demand
    while (true) {
      final cats = await placesRoot.get();
      List<PlaceModel> all = [];
      for (var c in cats.docs) {
        final snaps = await placesRoot.doc(c.id).collection(c.id).get();
        for (var d in snaps.docs) {
          all.add(PlaceModel.fromMap(d.id, d.data()));
        }
      }
      yield all;
      await Future.delayed(const Duration(seconds: 5)); // poll every 5s
    }
  }

  // Fetch once
  Future<List<PlaceModel>> fetchAllPlaces() async {
    final placesRoot = _db.collection('places');
    final cats = await placesRoot.get();
    final List<PlaceModel> all = [];
    for (var c in cats.docs) {
      final snaps = await placesRoot.doc(c.id).collection(c.id).get();
      for (var d in snaps.docs) {
        all.add(PlaceModel.fromMap(d.id, d.data()));
      }
    }
    return all;
  }

  Future<void> updatePlace(PlaceModel place) async {
    await _db
        .collection('places')
        .doc(place.category)
        .collection(place.category)
        .doc(place.id)
        .update(place.toMap());
  }

  Future<void> deletePlace(String category, String id) async {
    await _db
        .collection('places')
        .doc(category)
        .collection(category)
        .doc(id)
        .delete();
  }
}
