import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SvgIconComponent } from './svg-icon/svg-icon.component';
import { ReplaceCharacterPipe } from './pipes/replace-character.pipe';
import { TimeTransformPipe } from './pipes/time-transform.pipe';
import { ThousandTransformPipe } from './pipes/thousand-transform.pipe';
import { EtaTimePipe } from './pipes/eta-time.pipe';
import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { NotifierModule } from 'angular-notifier';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProgressBarInterceptor } from './progress-bar/progress-bar.interceptor.service';
import { VarDirective } from './directives/var.directive';
import { VirtualScrollDirective } from './virtual-scroll/virtual-scroll.directive';
import { VirtualScrollFromTopDirective } from './virtual-scroll/virtual-scroll-from-top.directive';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    SvgIconComponent,
    ReplaceCharacterPipe,
    TimeTransformPipe,
    ThousandTransformPipe,
    EtaTimePipe,
    ErrorPopupComponent,
    ProgressBarComponent,
    VarDirective,
    VirtualScrollDirective,
    VirtualScrollFromTopDirective,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right'
        },
        vertical: {
          position: 'top'
        }
      },
      behaviour: {
        onMouseover: 'pauseAutoHide'
      }
    }),
    MatTabsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    FlexLayoutModule,
    SvgIconComponent,
    ReplaceCharacterPipe,
    TimeTransformPipe,
    ThousandTransformPipe,
    EtaTimePipe,
    ErrorPopupComponent,
    ProgressBarComponent,
    VarDirective,
    VirtualScrollDirective,
    VirtualScrollFromTopDirective,
    MatTabsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressBarInterceptor,
      multi: true
    },
  ]
})
export class TezedgeSharedModule {}
