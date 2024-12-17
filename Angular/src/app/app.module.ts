import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DxLoadPanelModule } from 'devextreme-angular/ui/load-panel';
import { DxPaginationModule } from 'devextreme-angular/ui/pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxLoadPanelModule,
    DxPaginationModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
