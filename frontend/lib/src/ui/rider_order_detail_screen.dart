import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/rider_provider.dart';
import '../services/socket_service.dart';

class RiderOrderDetailScreen extends StatefulWidget {
  final Map<String, dynamic> order;
  const RiderOrderDetailScreen({Key? key, required this.order}) : super(key: key);

  @override
  State<RiderOrderDetailScreen> createState() => _RiderOrderDetailScreenState();
}

class _RiderOrderDetailScreenState extends State<RiderOrderDetailScreen> {
  String? _orderStatus;
  late SocketService _socketService;

  @override
  void initState() {
    super.initState();
    _orderStatus = widget.order['status'];
    _socketService = SocketService();
    // _socketService.connect(rider accessToken); // Add token logic
    _socketService.joinOrderRoom(widget.order['id']);
    _socketService.onOrderStatusUpdate((data) {
      setState(() {
        _orderStatus = data['status'];
      });
    });
  }

  @override
  void dispose() {
    _socketService.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final order = widget.order;
    return Scaffold(
      appBar: AppBar(title: Text('Order #${order['id']}')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            Text('Status: ${_orderStatus ?? order['status']}', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text('Customer: ${order['user']['name']}'),
            Text('Address: ${order['user']['addresses']?[0]?['street'] ?? ''}'),
            const SizedBox(height: 8),
            Text('Items:', style: Theme.of(context).textTheme.subtitle1),
            ...List.generate(order['items'].length, (i) {
              final item = order['items'][i];
              return ListTile(
                title: Text(item['product']['name'] ?? ''),
                subtitle: Text('Qty: ${item['quantity']}'),
                trailing: Text('PKR ${item['price']}'),
              );
            }),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                // Update order status logic (Processing, OnTheWay, Delivered)
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFC62828),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: const Text('Update Status'),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/rider-live-map', arguments: order['id']),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFffc107),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              child: const Text('Live Map Tracking'),
            ),
          ],
        ),
      ),
    );
  }
}
