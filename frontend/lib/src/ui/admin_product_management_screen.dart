import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/admin_provider.dart';

class AdminProductManagementScreen extends StatelessWidget {
  const AdminProductManagementScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final admin = Provider.of<AdminProvider>(context);
    final products = admin.products;
    return Scaffold(
      appBar: AppBar(title: const Text('Product Management')),
      body: products.isEmpty
          ? const Center(child: Text('No products found.'))
          : ListView.builder(
              itemCount: products.length,
              itemBuilder: (context, i) {
                final p = products[i];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  child: ListTile(
                    leading: p['images']?.isNotEmpty == true
                        ? Image.network(p['images'][0], width: 48, height: 48, fit: BoxFit.cover)
                        : const Icon(Icons.local_pizza, size: 32),
                    title: Text(p['name'] ?? ''),
                    subtitle: Text('PKR ${p['price']}'),
                    trailing: PopupMenuButton<String>(
                      onSelected: (v) {
                        // Handle edit, delete, toggle availability
                      },
                      itemBuilder: (ctx) => [
                        const PopupMenuItem(value: 'edit', child: Text('Edit')),
                        const PopupMenuItem(value: 'delete', child: Text('Delete')),
                        PopupMenuItem(
                          value: 'toggle',
                          child: Text(p['isAvailable'] == true ? 'Mark Unavailable' : 'Mark Available'),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Show add product dialog/screen
        },
        backgroundColor: const Color(0xFFC62828),
        child: const Icon(Icons.add),
      ),
    );
  }
}
