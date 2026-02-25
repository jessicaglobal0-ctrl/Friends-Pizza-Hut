import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/admin_provider.dart';

class AdminNotificationsScreen extends StatelessWidget {
  const AdminNotificationsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final admin = Provider.of<AdminProvider>(context);
    final notifications = admin.notifications ?? [];
    return Scaffold(
      appBar: AppBar(title: const Text('Notifications')),
      body: notifications.isEmpty
          ? const Center(child: Text('No notifications found.'))
          : ListView.builder(
              itemCount: notifications.length,
              itemBuilder: (context, i) {
                final n = notifications[i];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  child: ListTile(
                    leading: Icon(
                      n['type'] == 'order' ? Icons.shopping_bag : Icons.notifications,
                      color: n['isRead'] == true ? Colors.grey : Colors.blue,
                    ),
                    title: Text(n['title'] ?? ''),
                    subtitle: Text(n['message'] ?? ''),
                    trailing: Text(n['createdAt']?.toString().substring(0, 16) ?? ''),
                    onTap: () {
                      // Mark as read or show details
                    },
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Show send notification dialog/screen
        },
        backgroundColor: const Color(0xFFC62828),
        child: const Icon(Icons.add_alert),
      ),
    );
  }
}
