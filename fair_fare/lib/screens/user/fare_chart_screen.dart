import 'package:flutter/material.dart';

class FareChartScreen extends StatelessWidget {
  const FareChartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.deepPurple,
        title: const Text("Fare Chart"),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _fareCard(
            "Auto Rickshaw",
            "Base Fare: ₹10 (First 2 km)\n₹10 per km afterwards",
            Icons.local_taxi,
            Colors.orange,
          ),
          const SizedBox(height: 16),
          _fareCard(
            "City Bus",
            "0–5 km : ₹10\n5–10 km : ₹15\n10–20 km : ₹20\n20+ km : ₹25",
            Icons.directions_bus,
            Colors.blue,
          ),
          const SizedBox(height: 16),
          _fareCard(
            "Metro",
            "1–3 stations : ₹10\n3–6 stations : ₹20\n6–9 stations : ₹30\n9+ stations : ₹40",
            Icons.subway,
            Colors.green,
          ),
          const SizedBox(height: 16),
          _fareCard(
            "E-Rickshaw",
            "Base Fare: ₹10\n₹3 per km afterwards",
            Icons.electric_scooter,
            Colors.pink,
          ),
          const SizedBox(height: 16),
          _fareCard(
            "Shared Auto",
            "Local Route: ₹10 - ₹20\nFixed stand-to-stand fares",
            Icons.people_alt,
            Colors.indigo,
          ),
        ],
      ),
    );
  }

  // ----- FARE CARD WIDGET ------
  Widget _fareCard(String title, String details, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 10,
            offset: const Offset(2, 3),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CircleAvatar(
            radius: 28,
            backgroundColor: color.withValues(alpha: 0.5),
            child: Icon(icon, size: 30, color: color),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  details,
                  style: TextStyle(
                    fontSize: 15,
                    color: Colors.grey.shade700,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
