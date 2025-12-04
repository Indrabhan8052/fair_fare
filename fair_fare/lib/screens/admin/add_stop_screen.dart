import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:provider/provider.dart';

import '../../models/place_model.dart';
import '../../providers/places_provider.dart';

class AddStopScreen extends StatefulWidget {
  const AddStopScreen({super.key});
  @override
  State<AddStopScreen> createState() => _AddStopScreenState();
}

class _AddStopScreenState extends State<AddStopScreen> {
  final nameCtrl = TextEditingController();
  final latCtrl = TextEditingController();
  final lngCtrl = TextEditingController();
  final descCtrl = TextEditingController();
  final timeCtrl = TextEditingController();
  String category = 'colleges';
  bool loading = false;

  Future<void> useCurrentLocation() async {
    final perm = await Geolocator.checkPermission();
    if (perm == LocationPermission.denied) {
      await Geolocator.requestPermission();
    }
    final pos = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high);
    latCtrl.text = pos.latitude.toString();
    lngCtrl.text = pos.longitude.toString();
    setState(() {});
  }

  Future<void> submit() async {
    if (nameCtrl.text.isEmpty || latCtrl.text.isEmpty || lngCtrl.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please fill name and coordinates')));
      return;
    }
    setState(() => loading = true);
    final place = PlaceModel(
      id: '',
      name: nameCtrl.text.trim(),
      category: category,
      latitude: double.tryParse(latCtrl.text.trim()) ?? 0,
      longitude: double.tryParse(lngCtrl.text.trim()) ?? 0,
      description: descCtrl.text.trim(),
      timing: timeCtrl.text.trim(),
      createdAt: DateTime.now(),
    );
    await context.read<PlacesProvider>().addPlace(place);
    setState(() => loading = false);
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add New Place')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(children: [
          TextField(
              controller: nameCtrl,
              decoration: const InputDecoration(labelText: 'Place Name')),
          const SizedBox(height: 8),
          DropdownButtonFormField<String>(
            initialValue: category,
            items: const [
              DropdownMenuItem(value: 'colleges', child: Text('College')),
              DropdownMenuItem(value: 'hospitals', child: Text('Hospital')),
              DropdownMenuItem(value: 'bus_stands', child: Text('Bus Stand')),
              DropdownMenuItem(value: 'auto_stands', child: Text('Auto Stand')),
              DropdownMenuItem(
                  value: 'universities', child: Text('University')),
            ],
            onChanged: (v) => setState(() => category = v ?? category),
            decoration: const InputDecoration(labelText: 'Category'),
          ),
          const SizedBox(height: 8),
          Row(children: [
            Expanded(
                child: TextField(
                    controller: latCtrl,
                    decoration: const InputDecoration(labelText: 'Latitude'))),
            const SizedBox(width: 8),
            Expanded(
                child: TextField(
                    controller: lngCtrl,
                    decoration: const InputDecoration(labelText: 'Longitude'))),
          ]),
          const SizedBox(height: 8),
          ElevatedButton.icon(
              onPressed: useCurrentLocation,
              icon: const Icon(Icons.my_location),
              label: const Text('Use Current Location')),
          const SizedBox(height: 8),
          TextField(
              controller: descCtrl,
              decoration: const InputDecoration(labelText: 'Description')),
          const SizedBox(height: 8),
          TextField(
              controller: timeCtrl,
              decoration: const InputDecoration(labelText: 'Timing')),
          const SizedBox(height: 16),
          loading
              ? const CircularProgressIndicator()
              : ElevatedButton(
                  onPressed: submit, child: const Text('Add Place')),
        ]),
      ),
    );
  }
}
