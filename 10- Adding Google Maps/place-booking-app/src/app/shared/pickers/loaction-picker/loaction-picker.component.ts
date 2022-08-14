import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {MapModalComponent} from "../../map-modal/map-modal.component";

@Component({
  selector: 'app-loaction-picker',
  templateUrl: './loaction-picker.component.html',
  styleUrls: ['./loaction-picker.component.scss'],
})
export class LoactionPickerComponent implements OnInit {

  constructor(private _modalController: ModalController) {
  }

  ngOnInit() {
  }

  onPickLocation() {
    this._modalController.create({
      component: MapModalComponent
    });
  }
}
