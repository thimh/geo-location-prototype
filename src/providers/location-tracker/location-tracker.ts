import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter'

/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationTrackerProvider {
    public watch: any;
    public lat: number = 0;
    public lng: number = 0;

    private backgroundGeoLocation: BackgroundGeolocation;
    private geoLocation: Geolocation;

    constructor(public zone: NgZone) {
        this.backgroundGeoLocation = new BackgroundGeolocation();
        this.geoLocation           = new Geolocation();
    }

    startTracking() {
        let config = {
            desiredAccuracy: 0,
            stationaryRadius: 20,
            distanceFilter: 10,
            debug: true,
            interval: 2000
        };

        this.backgroundGeoLocation.configure(config).subscribe((location) => {
            console.log('BackgroundGeoLocation:  ' + location.latitude + ',' + location.longitude);

            this.zone.run(() => {
                this.lat = location.latitude;
                this.lng = location.longitude;
            });
        }, (error) => {
            console.log(error)
        });

        this.backgroundGeoLocation.start().then(() => {
            console.log('Stopped');
        }).catch(error => {
            console.log('Error:', error);
        });

        let options = {
            frequency: 3000,
            enableHighAccuracy: true
        };

        this.watch = this.geoLocation.watchPosition(options).filter((p: any) => p.code === undefined)
            .subscribe((position: Geoposition) => {
                console.log(position);

                this.zone.run(() => {
                    this.lat = position.coords.latitude;
                    this.lng = position.coords.longitude;
                });
            });
    }

    stopTracking() {
        console.log('stopTracking');

        this.backgroundGeoLocation.finish().then(() => {
            console.log('Stopped');
        }).catch(error => {
            console.log('Error:', error);
        });
        this.watch.unsubscribe();
    }
}
