import { Icon } from '../_models/Helpers/icon';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-icon-renderer',
  templateUrl: './icon-renderer.component.html',
  styleUrls: ['./icon-renderer.component.css']
})
export class IconRendererComponent implements OnInit {

    @Input() icon: Icon | Icon[];
    icons: Icon[];

    constructor() { }

    ngOnInit(): void
    {
        if (this.icon instanceof Array)
        {
            this.icons = this.icon;
        }
    }
}
