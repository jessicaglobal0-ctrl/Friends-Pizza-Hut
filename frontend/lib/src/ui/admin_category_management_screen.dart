import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/admin_provider.dart';

class AdminCategoryManagementScreen extends StatelessWidget {
  const AdminCategoryManagementScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final admin = Provider.of<AdminProvider>(context);
    final categories = admin.categories;
    return Scaffold(
      appBar: AppBar(title: const Text('Category Management')),
      body: categories.isEmpty
          ? const Center(child: Text('No categories found.'))
          : ListView.builder(
              itemCount: categories.length,
              itemBuilder: (context, i) {
                final c = categories[i];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  child: ListTile(
                    leading: c['image'] != null && c['image'].isNotEmpty
                        ? Image.network(c['image'], width: 48, height: 48, fit: BoxFit.cover)
                        : const Icon(Icons.category, size: 32),
                    title: Text(c['name'] ?? ''),
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
          // Show add category dialog/screen
        },
        backgroundColor: const Color(0xFFC62828),
        child: const Icon(Icons.add),
      ),
    );
  }
}
