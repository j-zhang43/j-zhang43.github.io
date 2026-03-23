export class Point_2D {
    constructor(x_or_xy, y) {
        if (typeof x_or_xy === "string") {
            const parts = x_or_xy.split(" ");
            this.x = parseFloat(parts[0]);
            this.y = parseFloat(parts[1]);
        }
        else {
            this.x = x_or_xy;
            this.y = y;
        }
    }
}
export class Point_3D {
    constructor(x_or_xyz, y, z) {
        if (typeof x_or_xyz === "string") {
            const parts = x_or_xyz.split(" ");
            this.x = parseFloat(parts[0]);
            this.y = parseFloat(parts[1]);
            this.z = parseFloat(parts[2]);
        }
        else {
            this.x = x_or_xyz;
            this.y = y;
            this.z = z;
        }
    }
}
