/// <reference types="@types/googlemaps" />

import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import { AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  lat: number = 41.878113;
  lng: number = -87.629799;
  tolls: any;
  fromAddress: string = "";
  toAddress: string = "";
  directionValue: any = {};
  directionTollValue: any = {};
  zoom: number = 4;

  @ViewChild(AgmMap) map: AgmMap;

  constructor(private zone: NgZone,
              private wrapper: GoogleMapsAPIWrapper,
              private http: HttpClient) {}

  ngOnInit() {
    this.directionValue = {
      routes: []
    };

    this.directionTollValue = this.directionValue;

  }

  search(){
    let toll = this.tolls;
    this.tolls = (this.tolls) ? 'tolls' : '';
    const directionUrl = environment.baseDirectionUrlDev + this.fromAddress + "&destination=" + this.toAddress + "&key=" + environment.key;

    if(toll){
      const directionTollUrl = environment.baseDirectionUrlDev + this.fromAddress + "&destination=" + this.toAddress + "&avoid=" + "tolls" + "&key=" + environment.key;

      this.http.get(directionTollUrl,{
        responseType: "json"
      }).subscribe(value => {
        this.directionTollValue = value;
      });
    }

    this.http.get(directionUrl,{
      responseType: "json"
    }).subscribe(value => {
      this.directionValue = value;
      this.lat = this.directionValue.routes[0].legs[0].start_location.lat;
      this.lng = this.directionValue.routes[0].legs[0].start_location.lng;
      this.zoom = 5;
    });
  }


}
