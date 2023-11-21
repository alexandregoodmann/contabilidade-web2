import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { GoogleChartsModule } from 'angular-google-charts';
import { NgxCurrencyModule } from 'ngx-currency';
import { AppComponent } from './app.component';
import { AnaliseCategoriaComponent } from './components/analise-categoria/analise-categoria.component';
import { CargaComponent } from './components/carga/carga.component';
import { ContaComponent } from './components/conta/conta.component';
import { ExtratoComponent } from './components/extrato/extrato.component';
import { LabelComponent } from './components/label/label.component';
import { LancamentoDialogComponent } from './components/lancamento-dialog/lancamento-dialog.component';
import { LancamentoComponent } from './components/lancamento/lancamento.component';
import { PlanilhaComponent } from './components/planilha/planilha.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { ResumoExtratoComponent } from './components/resumo-extrato/resumo-extrato.component';
import { SaldocontasComponent } from './components/saldocontas/saldocontas.component';
import { InterceptorService } from './services/interceptor.service';
import { CheckComponent } from './shared/check/check.component';
import { ChipsComponent } from './shared/chips/chips.component';
import { LinkPlanilhaComponent } from './shared/link-planilha/link-planilha.component';
import { SelectPlanilhaComponent } from './shared/select-planilha/select-planilha.component';
import { TopBarComponent } from './shared/top-bar/top-bar.component';


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
    path: 'conta',
    component: ContaComponent
  },
  {
    path: 'label',
    component: LabelComponent
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
    LabelComponent,
    ContaComponent,
    LancamentoComponent,
    ExtratoComponent,
    CargaComponent,
    ChipsComponent,
    AnaliseCategoriaComponent,
    ResumoExtratoComponent,
    CheckComponent,
    LancamentoDialogComponent,
    SaldocontasComponent

  ],
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
    GoogleChartsModule,
    //MATERIAL
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
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
    MatListModule,
    MatTooltipModule,
    MatDialogModule
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

export const MESES = [
  { mes: 1, descricao: 'Janeiro', abr: 'JAN' },
  { mes: 2, descricao: 'Fevereiro', abr: 'FEV' },
  { mes: 3, descricao: 'Março', abr: 'MAR' },
  { mes: 4, descricao: 'Abril', abr: 'ABR' },
  { mes: 5, descricao: 'Maio', abr: 'MAI' },
  { mes: 6, descricao: 'Junho', abr: 'JUN' },
  { mes: 7, descricao: 'Julho', abr: 'JUL' },
  { mes: 8, descricao: 'Agosto', abr: 'AGO' },
  { mes: 9, descricao: 'Setembro', abr: 'SET' },
  { mes: 10, descricao: 'Outubro', abr: 'OUT' },
  { mes: 11, descricao: 'Novembro', abr: 'NOV' },
  { mes: 12, descricao: 'Dezembro', abr: 'DEZ' },
]