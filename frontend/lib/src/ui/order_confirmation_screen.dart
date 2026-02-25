import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/order_provider.dart';

class OrderConfirmationScreen extends StatelessWidget {
  final String orderId;
  const OrderConfirmationScreen({Key? key, required this.orderId}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final orderProvider = Provider.of<OrderProvider>(context);
    final order = orderProvider.orders.firstWhere((o) => o['id'] == orderId, orElse: () => null);
    if (order == null) {
      return const Scaffold(
        body: Center(child: Text('Order not found.')),
      );
    }
    return Scaffold(
      appBar: AppBar(title: const Text('Order Confirmation')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Icon(Icons.check_circle, color: Colors.green, size: 64),
            const SizedBox(height: 16),
            Text('Thank you for your order!', style: Theme.of(context).textTheme.headline6, textAlign: TextAlign.center),
            const SizedBox(height: 8),
            Text('Order ID: ${order['id']}', textAlign: TextAlign.center),
            const SizedBox(height: 8),
            Text('Payment Status: ${order['paymentStatus'] ?? 'Pending'}', textAlign: TextAlign.center, style: TextStyle(color: order['paymentStatus'] == 'Paid' ? Colors.green : Colors.red)),
            const SizedBox(height: 16),
            Text('Order Summary:', style: Theme.of(context).textTheme.subtitle1),
            ...List.generate(order['items'].length, (i) {
              final item = order['items'][i];
              return ListTile(
                title: Text(item['product']['name'] ?? ''),
                subtitle: Text('Qty: ${item['quantity']}'),
                trailing: Text('PKR ${item['price']}'),
              );
            }),
            const SizedBox(height: 16),
            Text('Total: PKR ${order['totalAmount']}', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              icon: const Icon(Icons.track_changes),
              label: const Text('Track Order'),
              onPressed: () => Navigator.pushNamed(context, '/order-tracking', arguments: orderId),
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
