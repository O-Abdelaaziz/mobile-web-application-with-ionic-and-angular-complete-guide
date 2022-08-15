import {NgModule} from '@angular/core';
import {LocationPickerComponent} from './pickers/loacation-picker/location-picker.component';
import {MapModalComponent} from './map-modal/map-modal.component';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ImagePickerComponent} from './pickers/image-picker/image-picker.component';

@NgModule({
  declarations: [LocationPickerComponent, MapModalComponent, ImagePickerComponent],
  imports: [CommonModule, IonicModule.forRoot()],
  exports: [LocationPickerComponent, MapModalComponent, ImagePickerComponent],
})
export class SharedModule {
}
