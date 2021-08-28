import { Icon } from './../../../models/Helpers/icon';
import { Component, OnInit, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-icon-renderer',
    templateUrl: './icon-renderer.component.html',
    styleUrls: ['./icon-renderer.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconRendererComponent implements OnInit
{
    @Input() icon: Icon | Icon[];
    @Input() @HostBinding('style.height.px') @HostBinding('style.width.px') componentSize: number;

    icons: Icon[];

    constructor(private sanitizer: DomSanitizer)
    { }

    ngOnInit(): void
    {
        if (this.icon instanceof Array)
        {
            this.icons = this.icon;
        }
    }

    sanitizeUrl(url: string): string
    {
        // Fix internal assets that don't require custom protocol handling
        if (url.indexOf('__internal__') >= 0)
        {
            url = url.replace('factorio-icon://', '').replace('__internal__', 'assets/icons');
        }
        return url;

        //return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    constructedScale(iconLayer: Icon): number
    {
        // If scale = 1, assume we actually want scale 1
        if (iconLayer.scale === 1)
        {
            return 1;
        }
        return iconLayer.size / this.componentSize * iconLayer.scale;
    }

    // imageStyle(iconLayer: Icon): SafeStyle
    // {
    //     console.log(this.sanitize('factorio-icon://' + iconLayer))
    //     const temp = this.sanitizer.bypassSecurityTrustStyle(`
    //         background-color: ${iconLayer.toRgbaHtmlString()};
    //         -webkit-mask-image: url(${this.sanitize('factorio-icon://' + iconLayer)});
    //     `);
    //     console.log(temp);
    //     return temp;
    // }
}
