export class Point_2D {
    constructor(x:number, y:number);
    constructor(xy:string);

    constructor(x_or_xy: string | number, y?: number) {
        if (typeof x_or_xy === "string") {
            const parts: string[] = x_or_xy.split(" ");
            this.x = parseFloat(parts[0]);
            this.y = parseFloat(parts[1]);
        } else {
            this.x = x_or_xy;
            this.y = y!;
        }
    }

    public x: number;
    public y: number;
}

export class Point_3D {
    constructor(x:number, y:number, z:number);
    constructor(xyz:string);

    constructor(x_or_xyz: string | number, y?: number, z?: number) {
        if (typeof x_or_xyz === "string") {
            const parts: string[] = x_or_xyz.split(" ");
            this.x = parseFloat(parts[0]);
            this.y = parseFloat(parts[1]);
            this.z = parseFloat(parts[2]);
        } else {
            this.x = x_or_xyz;
            this.y = y!;
            this.z = z!;
        }
    }

    public x: number;
    public y: number;
    public z: number;
}