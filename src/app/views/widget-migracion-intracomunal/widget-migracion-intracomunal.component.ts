import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-widget-migracion-intracomunal',
  templateUrl: './widget-migracion-intracomunal.component.html',
  styleUrls: ['./widget-migracion-intracomunal.component.css']
})
export class WidgetMigracionIntracomunalComponent implements OnInit {

  @Input()
  comuna;
  
  constructor() { }

  ngOnInit() {
  }

}
