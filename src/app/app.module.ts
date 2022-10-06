import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { NgxCurrencyModule } from 'ngx-currency';
import { AppComponent } from './app.component';
import { CargaComponent } from './components/carga/carga.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { ContaComponent } from './components/conta/conta.component';
import { ExtratoComponent } from './components/extrato/extrato.component';
import { LancamentoComponent } from './components/lancamento/lancamento.component';
import { PlanilhaComponent } from './components/planilha/planilha.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { InterceptorService } from './services/interceptor.service';
import { LinkPlanilhaComponent } from './shared/link-planilha/link-planilha.component';
import { SelectPlanilhaComponent } from './shared/select-planilha/select-planilha.component';
import { TopBarComponent } from './shared/top-bar/top-bar.component';
import { ChartPieComponent } from './shared/chart-pie/chart-pie.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

registerLocaleData(localePt, 'pt-BR');

const routes: Routes = [
  {
    path: 'carga',
    component: CargaComponent
  },
  {
    path: 'extrato',
    component: ExtratoComponent
  },
  {
    path: 'lancamento',
    component: LancamentoComponent,
  },
  {
    path: 'conta',
    component: ContaComponent
  },
  {
    path: 'categoria',
    component: CategoriaComponent
  },
  {
    path: 'planilha',
    component: PlanilhaComponent
  },
  {
    path: '',
    redirectTo: 'principal',
    pathMatch: 'full'
  },
  { path: '**', component: PrincipalComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SelectPlanilhaComponent,
    PrincipalComponent,
    LinkPlanilhaComponent,
    PlanilhaComponent,
    TopBarComponent,
    CategoriaComponent,
    ContaComponent,
    LancamentoComponent,
    ExtratoComponent,
    CargaComponent,
    ChartPieComponent
  ],
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
    NgxChartsModule,
    //MATERIAL
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    //MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatBadgeModule,
    MatChipsModule,
    MatProgressBarModule,
    MatMenuModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatTableModule,
    MatSortModule,
    MatExpansionModule,
    MatDividerModule,
    MatListModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ],

  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
