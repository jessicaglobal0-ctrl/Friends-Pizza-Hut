import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';
import '../providers/rider_provider.dart';
import '../services/socket_service.dart';

class RiderLiveMapScreen extends StatefulWidget {
  final String orderId;
  const RiderLiveMapScreen({Key? key, required this.orderId}) : super(key: key);

  @override
  State<RiderLiveMapScreen> createState() => _RiderLiveMapScreenState();
}

class _RiderLiveMapScreenState extends State<RiderLiveMapScreen> {
  GoogleMapController? _mapController;
  LatLng? _currentLocation;
  late SocketService _socketService;

  @override
  void initState() {
    super.initState();
    _socketService = SocketService();
    // _socketService.connect(rider accessToken); // Add token logic
    _socketService.joinOrderRoom(widget.orderId);
    _socketService.onRiderLocationUpdate((data) {
      setState(() {
        _currentLocation = LatLng(data['latitude'], data['longitude']);
      });
      if (_mapController != null && _currentLocation != null) {
        _mapController!.animateCamera(CameraUpdate.newLatLng(_currentLocation!));
      }
    });
  }

  @override
  void dispose() {
    _socketService.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Live Map Tracking')),
      body: _currentLocation == null
          ? const Center(child: Text('Waiting for location...'))
          : GoogleMap(
              initialCameraPosition: CameraPosition(
                target: _currentLocation!,
                zoom: 16,
              ),
              markers: {
                Marker(
                  markerId: const MarkerId('rider'),
                  position: _currentLocation!,
                  infoWindow: const InfoWindow(title: 'Your Location'),
                ),
              },
              onMapCreated: (controller) => _mapController = controller,
            ),
    );
  }
}
