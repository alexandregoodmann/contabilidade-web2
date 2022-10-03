import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
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
import { CategoriaComponent } from './components/categoria/categoria.component';
import { ContaComponent } from './components/conta/conta.component';
import { LancamentoComponent } from './components/lancamento/lancamento.component';
import { PlanilhaComponent } from './components/planilha/planilha.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { LinkPlanilhaComponent } from './shared/link-planilha/link-planilha.component';
import { SelectPlanilhaComponent } from './shared/select-planilha/select-planilha.component';
import { TopBarComponent } from './shared/top-bar/top-bar.component';

const routes: Routes = [
  /*
  {
    path: 'carga',
    component: CargaComponent
  },
  {
    path: 'extrato',
    component: ExtratoComponent
  },*/
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
    LancamentoComponent
  ],
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
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
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
