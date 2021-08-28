export class Icon
{
    constructor(public iconPath: string = '__internal__/__Unknown__.png',
                public size: number = 32,
                public scale: number = 1,
                public tint: { r: number, g: number, b: number, a: number } = { r: 1, g: 1, b: 1, a: 1 },
                public shift: { h: number, v: number } = { h: 0, v: 0 })
    { }

    public toString(): string
    {
        return this.iconPath;
    }

    public toRgbaHtmlString(): string
    {
        return `rgba(${this.tint.r * 255}, ${this.tint.g * 255}, ${this.tint.b * 255}, ${this.tint.a})`;
    }
}
