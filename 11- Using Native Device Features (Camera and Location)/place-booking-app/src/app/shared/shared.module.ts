import {NgModule} from '@angular/core';
import {LocationPickerComponent} from './pickers/loacation-picker/location-picker.component';
import {MapModalComponent} from './map-modal/map-modal.component';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [LocationPickerComponent, MapModalComponent],
  imports: [CommonModule, IonicModule.forRoot()],
  exports: [LocationPickerComponent, MapModalComponent],
})
export class SharedModule {
}
