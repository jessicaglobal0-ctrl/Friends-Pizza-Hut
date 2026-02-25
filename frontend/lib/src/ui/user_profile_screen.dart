import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class UserProfileScreen extends StatelessWidget {
  const UserProfileScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final user = auth.user;
    if (user == null) {
      return const Scaffold(
        body: Center(child: Text('Not logged in.')),
      );
    }
    return Scaffold(
      appBar: AppBar(title: const Text('My Profile')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Center(
            child: CircleAvatar(
              radius: 40,
              backgroundImage: user['profileImage'] != null && user['profileImage'].isNotEmpty
                  ? NetworkImage(user['profileImage'])
                  : null,
              child: user['profileImage'] == null || user['profileImage'].isEmpty
                  ? const Icon(Icons.person, size: 40)
                  : null,
            ),
          ),
          const SizedBox(height: 16),
          Text('Name: ${user['name'] ?? ''}', style: const TextStyle(fontWeight: FontWeight.bold)),
          Text('Email: ${user['email'] ?? ''}'),
          Text('Phone: ${user['phone'] ?? ''}'),
          Text('City: ${user['city'] ?? ''}'),
          const SizedBox(height: 16),
          const Text('Addresses:', style: TextStyle(fontWeight: FontWeight.bold)),
          ...List.generate((user['addresses'] as List?)?.length ?? 0, (i) {
            final a = user['addresses'][i];
            return ListTile(
              title: Text('${a['street']}, ${a['city']}'),
              subtitle: Text(a['label'] ?? ''),
              trailing: IconButton(
                icon: const Icon(Icons.delete),
                onPressed: () {
                  // Remove address logic
                },
              ),
            );
          }),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              // Edit profile logic
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFC62828),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Edit Profile'),
          ),
          const SizedBox(height: 8),
          ElevatedButton(
            onPressed: () {
              auth.logout();
              Navigator.pushReplacementNamed(context, '/login');
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.grey[700],
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Logout'),
          ),
        ],
      ),
    );
  }
}
