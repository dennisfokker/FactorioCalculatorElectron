import { Icon } from '../_models/Helpers/icon';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-icon-renderer',
  templateUrl: './icon-renderer.component.html',
  styleUrls: ['./icon-renderer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconRendererComponent implements OnInit {

    @Input() icon: Icon | Icon[];
    icons: Icon[];

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit(): void
    {
        if (this.icon instanceof Array)
        {
            this.icons = this.icon;
        }
    }

    sanitize(url: string): SafeResourceUrl
    {
        // Fix internal assets that don't require custom protocol handling
        if (url.indexOf('__internal__') >= 0)
        {
            url = url.replace('factorio-icon://', '').replace('__internal__', 'assets/icons');
            return url;
        }

        return this.sanitizer.bypassSecurityTrustUrl(url);
    }
}
