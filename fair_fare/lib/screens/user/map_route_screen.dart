import 'package:flutter/material.dart';

class MapRouteScreen extends StatelessWidget {
  final String start;
  final String destination;

  const MapRouteScreen({
    super.key,
    required this.start,
    required this.destination,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Route Overview")),
      body: Center(
        child: Text(
          "Route From $start → $destination",
          style: const TextStyle(fontSize: 22),
        ),
      ),
    );
  }
}
