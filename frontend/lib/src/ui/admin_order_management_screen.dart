import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/admin_provider.dart';
import '../services/socket_service.dart';

class AdminOrderManagementScreen extends StatefulWidget {
  const AdminOrderManagementScreen({Key? key}) : super(key: key);

  @override
  State<AdminOrderManagementScreen> createState() => _AdminOrderManagementScreenState();
}

class _AdminOrderManagementScreenState extends State<AdminOrderManagementScreen> {
  late SocketService _socketService;
  @override
  void initState() {
    super.initState();
    Provider.of<AdminProvider>(context, listen: false).fetchDashboard();
    _socketService = SocketService();
    // _socketService.connect(admin accessToken); // Add token logic
    _socketService.onOrderStatusUpdate((data) {
      // Optionally refresh orders or show notification
      setState(() {});
    });
  }

  @override
  void dispose() {
    _socketService.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final admin = Provider.of<AdminProvider>(context);
    final orders = admin.orders;
    return Scaffold(
      appBar: AppBar(title: const Text('Order Management')),
      body: orders.isEmpty
          ? const Center(child: Text('No orders found.'))
          : ListView.builder(
              itemCount: orders.length,
              itemBuilder: (context, i) {
                final o = orders[i];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  child: ListTile(
                    title: Text('Order #${o['id']} - ${o['status']}'),
                    subtitle: Text('User: ${o['user']['name']}\nTotal: PKR ${o['totalAmount']}'),
                    trailing: PopupMenuButton<String>(
                      onSelected: (v) {
                        // Handle status update, assign rider, etc.
                      },
                      itemBuilder: (ctx) => [
                        const PopupMenuItem(value: 'view', child: Text('View Details')),
                        const PopupMenuItem(value: 'assign', child: Text('Assign Rider')),
                        const PopupMenuItem(value: 'update', child: Text('Update Status')),
                      ],
                    ),
                    onTap: () {
                      // Show order details dialog or screen
                    },
                  ),
                );
              },
            ),
    );
  }
}
