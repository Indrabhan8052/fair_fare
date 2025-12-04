class StopModel {
  final String id;
  final String name;
  final String category;
  final double latitude;
  final double longitude;
  final String description;

  StopModel({
    required this.id,
    required this.name,
    required this.category,
    required this.latitude,
    required this.longitude,
    required this.description,
  });

  Map<String, dynamic> toJson() {
    return {
      "name": name,
      "category": category,
      "latitude": latitude,
      "longitude": longitude,
      "description": description,
    };
  }

  factory StopModel.fromJson(String id, Map<String, dynamic> json) {
    return StopModel(
      id: id,
      name: json["name"],
      category: json["category"],
      latitude: json["latitude"].toDouble(),
      longitude: json["longitude"].toDouble(),
      description: json["description"],
    );
  }

  StopModel copyWith({
    String? name,
    String? category,
    double? latitude,
    double? longitude,
    String? description,
  }) {
    return StopModel(
      id: id,
      name: name ?? this.name,
      category: category ?? this.category,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      description: description ?? this.description,
    );
  }
}
