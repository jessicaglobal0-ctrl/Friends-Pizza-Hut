import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/order_provider.dart';
import '../services/socket_service.dart';

class OrderTrackingScreen extends StatefulWidget {
  final String orderId;
  const OrderTrackingScreen({Key? key, required this.orderId}) : super(key: key);

  @override
  State<OrderTrackingScreen> createState() => _OrderTrackingScreenState();
}

class _OrderTrackingScreenState extends State<OrderTrackingScreen> {
  Map<String, dynamic>? _riderLocation;
  String? _orderStatus;
  late SocketService _socketService;

  @override
  void initState() {
    super.initState();
    final orderProvider = Provider.of<OrderProvider>(context, listen: false);
    final order = orderProvider.orders.firstWhere((o) => o['id'] == widget.orderId, orElse: () => null);
    _orderStatus = order?['status'];
    _socketService = SocketService();
    // Assume you have accessToken from AuthProvider
    // _socketService.connect(accessToken);
    _socketService.joinOrderRoom(widget.orderId);
    _socketService.onOrderStatusUpdate((data) {
      setState(() {
        _orderStatus = data['status'];
      });
    });
    _socketService.onRiderLocationUpdate((data) {
      setState(() {
        _riderLocation = data;
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
    final orderProvider = Provider.of<OrderProvider>(context);
    final order = orderProvider.orders.firstWhere((o) => o['id'] == widget.orderId, orElse: () => null);
    if (order == null) {
      return const Scaffold(
        body: Center(child: Text('Order not found.')),
      );
    }
    return Scaffold(
      appBar: AppBar(title: const Text('Order Tracking')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Order Status: ${_orderStatus ?? order['status']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 16),
            if (_riderLocation != null) ...[
              const Text('Rider Location:'),
              Text('Lat: ${_riderLocation!['latitude']}, Lng: ${_riderLocation!['longitude']}'),
              // You can integrate Google Maps widget here for live map
            ] else ...[
              const Text('Waiting for rider location...'),
            ],
            const SizedBox(height: 24),
            Text('Order Progress:', style: Theme.of(context).textTheme.subtitle1),
            ...List.generate(order['trackingTimeline']?.length ?? 0, (i) {
              final t = order['trackingTimeline'][i];
              return ListTile(
                leading: Icon(Icons.check_circle, color: Colors.green, size: 20),
                title: Text('${t['status']}'),
                subtitle: Text('${t['timestamp'] ?? ''}'),
              );
            }),
          ],
        ),
      ),
    );
  }
}
