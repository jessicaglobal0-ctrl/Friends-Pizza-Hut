import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/admin_provider.dart';

class AdminCityManagementScreen extends StatelessWidget {
  const AdminCityManagementScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final admin = Provider.of<AdminProvider>(context);
    final cities = admin.cities;
    return Scaffold(
      appBar: AppBar(title: const Text('City Management')),
      body: cities.isEmpty
          ? const Center(child: Text('No cities found.'))
          : ListView.builder(
              itemCount: cities.length,
              itemBuilder: (context, i) {
                final c = cities[i];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  child: ListTile(
                    leading: const Icon(Icons.location_city, size: 32),
                    title: Text(c['cityName'] ?? ''),
                    subtitle: Text('Delivery Fee: PKR ${c['deliveryFee']}'),
                    trailing: PopupMenuButton<String>(
                      onSelected: (v) {
                        // Handle edit, delete
                      },
                      itemBuilder: (ctx) => [
                        const PopupMenuItem(value: 'edit', child: Text('Edit')),
                        const PopupMenuItem(value: 'delete', child: Text('Delete')),
                      ],
                    ),
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Show add city dialog/screen
        },
        backgroundColor: const Color(0xFFC62828),
        child: const Icon(Icons.add),
      ),
    );
  }
}
