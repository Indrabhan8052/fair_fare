import 'package:flutter/material.dart';
// import 'package:fair_fare_app/screens/map_screen.dart';
import 'package:fair_fare_app/screens/user/user_profile_screen.dart';

class RouteHomeScreen extends StatefulWidget {
  const RouteHomeScreen({super.key});

  @override
  State<RouteHomeScreen> createState() => _RouteHomeScreenState();
}

class _RouteHomeScreenState extends State<RouteHomeScreen> {
  int currentIndex = 0;
  final pages = [
    // simple placeholders; map_screen contains search + map logic
    const Placeholder(), // Home placeholder
    // const MapScreen(),
    const UserProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: pages[currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIndex,
        selectedItemColor: Colors.deepPurple,
        unselectedItemColor: Colors.grey,
        onTap: (i) => setState(() => currentIndex = i),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.map), label: 'Route'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}
