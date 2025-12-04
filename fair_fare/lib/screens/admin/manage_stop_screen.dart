import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fair_fare_app/providers/places_provider.dart';
// import 'package:fair_fare_app/models/place_model.dart';
import 'edit_stop_screen.dart';
import 'add_stop_screen.dart';

class ManageStopsScreen extends StatefulWidget {
  const ManageStopsScreen({super.key});
  @override
  State<ManageStopsScreen> createState() => _ManageStopsScreenState();
}

class _ManageStopsScreenState extends State<ManageStopsScreen> {
  @override
  void initState() {
    super.initState();
    final prov = Provider.of<PlacesProvider>(context, listen: false);
    prov.loadPlaces();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<PlacesProvider>(
      builder: (context, prov, _) {
        if (prov.loading) {
          return const Center(child: CircularProgressIndicator());
        }
        if (prov.places.isEmpty) {
          return Center(
              child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text('No places yet.'),
              ElevatedButton(
                  onPressed: () => Navigator.push(context,
                      MaterialPageRoute(builder: (_) => const AddStopScreen())),
                  child: const Text('Add Place')),
            ],
          ));
        }
        return ListView.builder(
          itemCount: prov.places.length,
          itemBuilder: (ctx, i) {
            final p = prov.places[i];
            return ListTile(
              title: Text(p.name),
              subtitle: Text('${p.category} • ${p.timing}'),
              trailing: Row(mainAxisSize: MainAxisSize.min, children: [
                IconButton(
                  icon: const Icon(Icons.edit),
                  onPressed: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) => EditStopScreen(place: p))),
                ),
                IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () async {
                    final ok = await showDialog<bool>(
                      context: context,
                      builder: (_) => AlertDialog(
                        title: const Text('Delete'),
                        content: const Text('Delete this place?'),
                        actions: [
                          TextButton(
                              onPressed: () => Navigator.pop(context, false),
                              child: const Text('No')),
                          TextButton(
                              onPressed: () => Navigator.pop(context, true),
                              child: const Text('Yes')),
                        ],
                      ),
                    );
                    if (ok == true) {
                      await prov.deletePlace(p.category, p.id);
                    }
                  },
                ),
              ]),
            );
          },
        );
      },
    );
  }
}
