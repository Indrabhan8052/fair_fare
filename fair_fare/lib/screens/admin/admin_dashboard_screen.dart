import 'package:fair_fare_app/screens/admin/manage_stop_screen.dart';
import 'package:flutter/material.dart';
import 'add_stop_screen.dart';

class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
        actions: [
          TextButton(
            onPressed: () => Navigator.push(context,
                MaterialPageRoute(builder: (_) => const AddStopScreen())),
            child: const Text('Add New Place',
                style: TextStyle(color: Colors.white)),
          )
        ],
      ),
      body: const ManageStopsScreen(),
    );
  }
}
