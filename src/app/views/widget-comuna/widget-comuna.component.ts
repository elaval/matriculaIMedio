import { Component, OnInit, Input } from '@angular/core';
import { ComunaDeficit } from 'app/models/comunaDeficit';

@Component({
  selector: 'app-widget-comuna',
  templateUrl: './widget-comuna.component.html',
  styleUrls: ['./widget-comuna.component.css']
})
export class WidgetComunaComponent implements OnInit {

  @Input()
  comuna: ComunaDeficit;
  
  constructor() { }

  ngOnInit() {
  }

}
