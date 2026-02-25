import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../providers/auth_provider.dart';
import '../providers/order_provider.dart';
import '../api/api_service.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({Key? key}) : super(key: key);

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  String? _selectedAddress;
  String _paymentMethod = 'COD';
  bool _loading = false;
  String? _error;

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);
    final auth = Provider.of<AuthProvider>(context);
    final orderProvider = Provider.of<OrderProvider>(context, listen: false);
    final addresses = auth.user?['addresses'] ?? [];
    return Scaffold(
      appBar: AppBar(title: const Text('Checkout')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: ListView(
                children: [
                  const Text('Select Address', style: TextStyle(fontWeight: FontWeight.bold)),
                  ...addresses.map<Widget>((a) => RadioListTile<String>(
                        value: a['street'],
                        groupValue: _selectedAddress,
                        onChanged: (v) => setState(() => _selectedAddress = v),
                        title: Text('${a['street']}, ${a['city']}'),
                      )),
                  const SizedBox(height: 16),
                  const Text('Payment Method', style: TextStyle(fontWeight: FontWeight.bold)),
                  RadioListTile<String>(
                    value: 'COD',
                    groupValue: _paymentMethod,
                    onChanged: (v) => setState(() => _paymentMethod = v!),
                    title: const Text('Cash on Delivery'),
                  ),
                  RadioListTile<String>(
                    value: 'JazzCash',
                    groupValue: _paymentMethod,
                    onChanged: (v) => setState(() => _paymentMethod = v!),
                    title: const Text('JazzCash'),
                  ),
                  RadioListTile<String>(
                    value: 'Easypaisa',
                    groupValue: _paymentMethod,
                    onChanged: (v) => setState(() => _paymentMethod = v!),
                    title: const Text('Easypaisa'),
                  ),
                  const SizedBox(height: 16),
                  Text('Total: PKR ${cart.totalPrice}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                  if (_error != null) ...[
                    const SizedBox(height: 8),
                    Text(_error!, style: const TextStyle(color: Colors.red)),
                  ],
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: _selectedAddress == null || cart.cartItems.isEmpty
                        ? null
                        : () async {
                            setState(() {
                              _loading = true;
                              _error = null;
                            });
                            try {
                              final api = Provider.of<ApiService>(context, listen: false);
                              final res = await api.post('/payment/initiate', body: {
                                'orderId': 'GENERATED_ORDER_ID', // Replace with actual order creation logic
                                'method': _paymentMethod,
                                'callbackUrl': 'yourapp://payment-callback',
                              });
                              if (res.statusCode == 200) {
                                // Handle payment flow (redirect, show confirmation, etc.)
                                Navigator.pushReplacementNamed(context, '/order-confirmation');
                                cart.clearCart();
                                orderProvider.fetchOrders();
                              } else {
                                setState(() => _error = 'Payment failed. Please try again.');
                              }
                            } catch (e) {
                              setState(() => _error = 'Error: $e');
                            } finally {
                              setState(() => _loading = false);
                            }
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFC62828),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text('Place Order'),
                  ),
                ],
              ),
            ),
    );
  }
}
