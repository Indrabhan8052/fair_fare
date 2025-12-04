import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/place_model.dart';
import '../../providers/places_provider.dart';

class EditStopScreen extends StatefulWidget {
  final PlaceModel place;
  const EditStopScreen({super.key, required this.place});
  @override
  State<EditStopScreen> createState() => _EditStopScreenState();
}

class _EditStopScreenState extends State<EditStopScreen> {
  late TextEditingController nameCtrl;
  late TextEditingController latCtrl;
  late TextEditingController lngCtrl;
  late TextEditingController descCtrl;
  late TextEditingController timeCtrl;
  late String category;
  bool loading = false;

  @override
  void initState() {
    super.initState();
    nameCtrl = TextEditingController(text: widget.place.name);
    latCtrl = TextEditingController(text: widget.place.latitude.toString());
    lngCtrl = TextEditingController(text: widget.place.longitude.toString());
    descCtrl = TextEditingController(text: widget.place.description);
    timeCtrl = TextEditingController(text: widget.place.timing);
    category = widget.place.category;
  }

  Future<void> submit() async {
    setState(() => loading = true);
    final updated = widget.place.copyWith(
      name: nameCtrl.text.trim(),
      latitude: double.tryParse(latCtrl.text.trim()) ?? widget.place.latitude,
      longitude: double.tryParse(lngCtrl.text.trim()) ?? widget.place.longitude,
      description: descCtrl.text.trim(),
      timing: timeCtrl.text.trim(),
      category: category,
    );
    await context.read<PlacesProvider>().updatePlace(updated);
    setState(() => loading = false);
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Place')),
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
                  onPressed: submit, child: const Text('Save Changes')),
        ]),
      ),
    );
  }
}
