import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/product_provider.dart';
import '../providers/cart_provider.dart';
import '../providers/order_provider.dart';
import '../providers/auth_provider.dart';

class ProductDetailScreen extends StatelessWidget {
  final Map<String, dynamic> product;
  const ProductDetailScreen({Key? key, required this.product}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final cart = Provider.of<CartProvider>(context);
    final auth = Provider.of<AuthProvider>(context);
    final orderProvider = Provider.of<OrderProvider>(context);
    final reviews = product['reviews'] ?? [];
    return Scaffold(
      appBar: AppBar(title: Text(product['name'] ?? 'Product')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          AspectRatio(
            aspectRatio: 1.2,
            child: product['images']?.isNotEmpty == true
                ? Image.network(product['images'][0], fit: BoxFit.cover)
                : const Icon(Icons.local_pizza, size: 80),
          ),
          const SizedBox(height: 16),
          Text(product['name'] ?? '', style: Theme.of(context).textTheme.headline6),
          Text('PKR ${product['price']}', style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(Icons.star, color: Colors.amber, size: 18),
              Text('${product['ratingAverage'] ?? 0}'),
              const SizedBox(width: 8),
              Text('(${product['totalReviews'] ?? 0} reviews)'),
            ],
          ),
          const SizedBox(height: 8),
          Text(product['description'] ?? ''),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              cart.addToCart(product);
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Added to cart!')));
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFC62828),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Add to Cart'),
          ),
          const SizedBox(height: 24),
          Text('Reviews', style: Theme.of(context).textTheme.subtitle1),
          ...reviews.map<Widget>((r) => ListTile(
                leading: Icon(Icons.person, color: Colors.grey[600]),
                title: Text(r['comment'] ?? ''),
                subtitle: Row(
                  children: [
                    Icon(Icons.star, color: Colors.amber, size: 16),
                    Text('${r['rating'] ?? 0}'),
                  ],
                ),
                trailing: r['user'] == auth.user?['id']
                    ? IconButton(
                        icon: const Icon(Icons.edit),
                        onPressed: () {
                          // Edit review logic
                        },
                      )
                    : null,
              )),
          const SizedBox(height: 8),
          ElevatedButton(
            onPressed: auth.user == null
                ? null
                : () {
                    // Show dialog to submit review
                    showDialog(
                      context: context,
                      builder: (ctx) {
                        int rating = 5;
                        String comment = '';
                        return AlertDialog(
                          title: const Text('Leave a Review'),
                          content: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              DropdownButton<int>(
                                value: rating,
                                items: List.generate(5, (i) => DropdownMenuItem(value: i + 1, child: Text('${i + 1} Stars'))),
                                onChanged: (v) => rating = v ?? 5,
                              ),
                              TextField(
                                decoration: const InputDecoration(labelText: 'Comment'),
                                onChanged: (v) => comment = v,
                              ),
                            ],
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(ctx),
                              child: const Text('Cancel'),
                            ),
                            ElevatedButton(
                              onPressed: () async {
                                await orderProvider.leaveReview(product['id'], rating, comment);
                                Navigator.pop(ctx);
                                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Review submitted!')));
                              },
                              child: const Text('Submit'),
                            ),
                          ],
                        );
                      },
                    );
                  },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFffc107),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text('Leave a Review'),
          ),
        ],
      ),
    );
  }
}
