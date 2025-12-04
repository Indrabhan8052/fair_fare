import 'package:fair_fare_app/firebase_options.dart';
import 'package:fair_fare_app/screens/login_screen.dart';
import 'package:fair_fare_app/screens/map_screen.dart';
import 'package:fair_fare_app/screens/signup_screen.dart';
import 'package:fair_fare_app/screens/user/user_dashboard.dart';
import 'package:fair_fare_app/screens/user/user_profile_screen.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/places_provider.dart';
import 'screens/user/user_home_screen.dart';
import 'screens/admin/admin_dashboard_screen.dart';
import 'screens/user/fare_chart_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const FairFareApp());
}

class FairFareApp extends StatelessWidget {
  const FairFareApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PlacesProvider()),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'Fair Fare',
        initialRoute: '/login',
        routes: {
          '/login': (c) => const LoginScreen(),
          '/signup': (c) => const SignupScreen(),
          '/home': (c) => const UserHomeScreen(),
          '/userDashboard': (c) => const UserDashboard(),
          '/profile': (c) => const UserProfileScreen(),
          '/adminDashboard': (c) => const AdminDashboardScreen(),
          "/fareChart": (context) => const FareChartScreen(),
          "/map": (context) => const MapScreen(),
        },
      ),
    );
  }
}
