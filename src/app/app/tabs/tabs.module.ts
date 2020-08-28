import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { TranslateModule } from '@ngx-translate/core';
import { ModalPageModule } from '../modal/modal.module';
import { ModalPage } from '../modal/modal.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  entryComponents :[
    ModalPage
],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    TranslateModule,
    ModalPageModule,
    ComponentsModule,
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
