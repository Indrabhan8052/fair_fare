class PlaceModel {
  final String id;
  final String name;
  final String category;
  final double latitude;
  final double longitude;
  final String description;
  final String timing;
  final DateTime createdAt;

  PlaceModel({
    required this.id,
    required this.name,
    required this.category,
    required this.latitude,
    required this.longitude,
    required this.description,
    required this.timing,
    required this.createdAt,
  });

  PlaceModel copyWith({
    String? id,
    String? name,
    String? category,
    double? latitude,
    double? longitude,
    String? description,
    String? timing,
    DateTime? createdAt,
  }) {
    return PlaceModel(
      id: id ?? this.id,
      name: name ?? this.name,
      category: category ?? this.category,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      description: description ?? this.description,
      timing: timing ?? this.timing,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'category': category,
      'latitude': latitude,
      'longitude': longitude,
      'description': description,
      'timing': timing,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory PlaceModel.fromMap(String id, Map<String, dynamic> map) {
    return PlaceModel(
      id: id,
      name: map['name'] ?? '',
      category: map['category'] ?? '',
      latitude: (map['latitude'] ?? 0).toDouble(),
      longitude: (map['longitude'] ?? 0).toDouble(),
      description: map['description'] ?? '',
      timing: map['timing'] ?? '',
      createdAt: DateTime.tryParse(map['createdAt'] ?? '') ?? DateTime.now(),
    );
  }
}
