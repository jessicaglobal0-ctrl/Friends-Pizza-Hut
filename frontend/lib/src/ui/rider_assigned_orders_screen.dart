import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/rider_provider.dart';

class RiderAssignedOrdersScreen extends StatelessWidget {
  const RiderAssignedOrdersScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final rider = Provider.of<RiderProvider>(context);
    final orders = rider.assignedOrders;
    return Scaffold(
      appBar: AppBar(title: const Text('Assigned Orders')),
      body: orders.isEmpty
          ? const Center(child: Text('No assigned orders.'))
          : ListView.builder(
              itemCount: orders.length,
              itemBuilder: (context, i) {
                final o = orders[i];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  child: ListTile(
                    title: Text('Order #${o['id']} - ${o['status']}'),
                    subtitle: Text('Customer: ${o['user']['name']}\nTotal: PKR ${o['totalAmount']}'),
                    trailing: Icon(Icons.arrow_forward_ios),
                    onTap: () => Navigator.pushNamed(context, '/rider-order-detail', arguments: o),
                  ),
                );
              },
            ),
    );
  }
}
