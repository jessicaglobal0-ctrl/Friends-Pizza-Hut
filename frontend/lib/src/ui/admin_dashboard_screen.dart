import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/admin_provider.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({Key? key}) : super(key: key);

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  @override
  void initState() {
    super.initState();
    Provider.of<AdminProvider>(context, listen: false).fetchDashboard();
  }

  @override
  Widget build(BuildContext context) {
    final admin = Provider.of<AdminProvider>(context);
    final dashboard = admin.dashboard;
    return Scaffold(
      appBar: AppBar(title: const Text('Admin Dashboard')),
      body: dashboard == null
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text('Total Sales: PKR ${dashboard['totalSales']}', style: const TextStyle(fontWeight: FontWeight.bold)),
                  Text('Total Orders: ${dashboard['totalOrders']}'),
                  Text('Total Users: ${dashboard['totalUsers']}'),
                  const SizedBox(height: 16),
                  Text('Revenue by City:', style: Theme.of(context).textTheme.subtitle1),
                  ...List.generate((dashboard['revenueByCity'] as List?)?.length ?? 0, (i) {
                    final c = dashboard['revenueByCity'][i];
                    return ListTile(
                      title: Text('City: ${c['_id'] ?? ''}'),
                      trailing: Text('PKR ${c['revenue']}'),
                    );
                  }),
                  const SizedBox(height: 16),
                  Text('Best Selling Products:', style: Theme.of(context).textTheme.subtitle1),
                  ...List.generate((dashboard['bestSelling'] as List?)?.length ?? 0, (i) {
                    final p = dashboard['bestSelling'][i];
                    return ListTile(
                      title: Text('Product: ${p['_id'] ?? ''}'),
                      trailing: Text('Sold: ${p['count']}'),
                    );
                  }),
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    icon: const Icon(Icons.list_alt),
                    label: const Text('Manage Orders'),
                    onPressed: () => Navigator.pushNamed(context, '/admin-orders'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFC62828),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
