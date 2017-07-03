import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-widget-migracion-intercomunal',
  templateUrl: './widget-migracion-intercomunal.component.html',
  styleUrls: ['./widget-migracion-intercomunal.component.css']
})
export class WidgetMigracionIntercomunalComponent implements OnInit {

  @Input()
  comuna;

  constructor() { }

  ngOnInit() {
  }

}
