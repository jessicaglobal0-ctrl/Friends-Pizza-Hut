import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/admin_provider.dart';

class AdminPaymentLogsScreen extends StatelessWidget {
  const AdminPaymentLogsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final admin = Provider.of<AdminProvider>(context);
    final payments = admin.payments;
    return Scaffold(
      appBar: AppBar(title: const Text('Payment Logs')),
      body: payments.isEmpty
          ? const Center(child: Text('No payment logs found.'))
          : ListView.builder(
              itemCount: payments.length,
              itemBuilder: (context, i) {
                final p = payments[i];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  child: ListTile(
                    leading: Icon(
                      p['status'] == 'Paid' ? Icons.check_circle : Icons.error,
                      color: p['status'] == 'Paid' ? Colors.green : Colors.red,
                    ),
                    title: Text('Order: ${p['order']?['id'] ?? ''}'),
                    subtitle: Text('Method: ${p['method']}\nStatus: ${p['status']}\nTxn: ${p['transactionId'] ?? '-'}'),
                    trailing: Text('PKR ${p['order']?['totalAmount'] ?? ''}'),
                    onTap: () {
                      // Show payment details dialog
                    },
                  ),
                );
              },
            ),
    );
  }
}
