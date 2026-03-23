// TODO List:
// - Object Class
// - Morphing


import {Point_2D, Point_3D} from "./points.js";

// colors
const black = "#1f1f1f";
const teal = "#62A8AC";
const white = "#FFFFFF";
const cyan = "#5497A7";
const dark_cyan = "#50858B";

class CanvasManager {
    constructor(canvas_id:string) {
        this.canvas = document.querySelector(`#${canvas_id}`) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        // changes canvas style to correct width based on CSS
        const canvas_style = getComputedStyle(this.canvas) as CSSStyleDeclaration;
        const css_width = parseInt(canvas_style.width) as number;
        const css_height = parseInt(canvas_style.height) as number;

        // changes width and height based on style
        this.canvas.width = css_width;
        this.canvas.height = css_height;

        // translate canvas to center
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

        // color of stroke
        this.ctx.strokeStyle = cyan;
        this.ctx.fillStyle = dark_cyan;
    }

    public width(): number {return this.canvas.width;}
    public height(): number {return this.canvas.height;}
    public clear():void {this.ctx.clearRect(-this.canvas.width/2, -this.canvas.height/2, this.canvas.width, this.canvas.height);}

    // draws line from p1 to p2
    public draw_line(p1:Point_2D, p2:Point_2D):void {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    }

    // draws circle at p1 with radius r
    public draw_circle(p1: Point_2D, r: number, is_filled: boolean):void {
        this.ctx.beginPath();
        this.ctx.arc(p1.x,p1.y, r, 0, 2 * Math.PI);

        if (is_filled) {
            this.ctx.fill();
        } 
        this.ctx.stroke();
        
    }

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
}

class Projector {
    
    constructor(canvas: CanvasManager, path: string) {
        this.canvas = canvas;
    }

    public async init(): Promise<void> {
        await this.process_input();

        this.project();
        this.rescale();
    }

    private async process_input(): Promise<void> {
        // clear past points ands edges
        this.points_3d.length = 0;
        this.edges.length = 0;

        // get file and parse to lines
        const response = await fetch(this.path);
        const content: string = await response.text();
        const lines: string[] = content.split(/\r?\n/);
        
        const points_count: number = parseInt(lines[0]);

        // add each line and edge
        for (let i: number = 1; i <= points_count; ++i) {
            this.points_3d.push(new Point_3D(lines[i]));
        }

        for (let i: number = points_count + 2; i< lines.length; ++i) {
            const parts:string[] = lines[i].split(" ");
            this.edges.push([parseInt(parts[0]), parseInt(parts[1])]);
        }
    }
    
    public async draw(): Promise<void> {
        this.canvas.clear();
        for (const point2d of this.points_2d) {
            this.canvas.draw_circle(point2d, 4, false);
        }
        for (const edge of this.edges) {
            this.canvas.draw_line(this.points_2d[edge[0]], this.points_2d[edge[1]]);
        }
    }

    public async project(): Promise<void> {
        // projects 3d points to 2d using basic projection matrix oblique projection of
        //  [ 1 0 1/2 ]
        //  [ 0 1 1/2 ]
        this.points_2d.length = 0;
        for (const point_3d of this.points_3d){
            this.points_2d.push(new Point_2D(this.scale*(point_3d.x+(0.5)*point_3d.z), this.scale*(point_3d.y+(0.5)*point_3d.z)));
        }
    }

    public async rescale() {
        // do one full rotation to caclulate max_y and max_x for scale
        let min_x = Infinity;
        let max_x = -Infinity;
        let min_y = Infinity;
        let max_y = -Infinity;

        for (let theta: number = 0; theta < 2*Math.PI; theta += (2*Math.PI)/1000) {
            for (const point2d of this.points_2d) {
                min_x = Math.min(point2d.x, min_x);
                max_x = Math.max(point2d.x, max_x);
                min_y = Math.min(point2d.y, min_y);
                max_y = Math.max(point2d.y, max_y);
            }
            this.rotate_z(0.1);
        }
        for (let theta: number = 0; theta < 2*Math.PI; theta += (2*Math.PI)/1000) {
            for (const point2d of this.points_2d) {
                min_x = Math.min(point2d.x, min_x);
                max_x = Math.max(point2d.x, max_x);
                min_y = Math.min(point2d.y, min_y);
                max_y = Math.max(point2d.y, max_y);
            }
            this.rotate_y(0.1);
        }
        for (let theta: number = 0; theta < 2*Math.PI; theta += (2*Math.PI)/1000) {
            for (const point2d of this.points_2d) {
                min_x = Math.min(point2d.x, min_x);
                max_x = Math.max(point2d.x, max_x);
                min_y = Math.min(point2d.y, min_y);
                max_y = Math.max(point2d.y, max_y);
            }
            this.rotate_z(0.1);
        }

        const x_scale = (this.canvas.width()*.8)/(max_x-min_x);
        const y_scale = (this.canvas.height()*.8)/(max_y-min_y);
        this.scale = Math.min(x_scale, y_scale);
        this.project();
    }

    public async rotate_z(theta: number): Promise<void> {
        // rotates 3d points by theta in radians
        for (let point_3d of this.points_3d){
            const new_x: number = Math.cos(theta)*point_3d.x - Math.sin(theta)*point_3d.y;
            const new_y: number = Math.sin(theta)*point_3d.x + Math.cos(theta)*point_3d.y;
            point_3d.x = new_x;
            point_3d.y = new_y;
        }
    }
    
    public async rotate_y(theta: number): Promise<void> {
        // rotates 3d points by theta in radians
        for (let point_3d of this.points_3d){
            const new_x: number = Math.cos(theta)*point_3d.x + Math.sin(theta)*point_3d.z;
            const new_z: number = -Math.sin(theta)*point_3d.x + Math.cos(theta)*point_3d.z;
            point_3d.x = new_x;
            point_3d.z = new_z;
        }
    }

    public async rotate_x(theta: number): Promise<void> {
        // rotates 3d points by theta in radians
        for (let point_3d of this.points_3d){
            const new_y: number = Math.cos(theta)*point_3d.y - Math.sin(theta)*point_3d.z;
            const new_z: number = Math.sin(theta)*point_3d.y + Math.cos(theta)*point_3d.z;
            point_3d.y = new_y;
            point_3d.z = new_z;
        }
    }

    private points_3d: Point_3D[] = [];
    private points_2d: Point_2D[] = [];
    private edges: number[][] = [];

    private scale:number = 1;

    private canvas: CanvasManager; 
    private path:string = "static/projection_inputs/input_blend_tower.txt";
}

class EventsManager {
    constructor(projector: Projector) {
        this.projector = projector;
        this.scroll_event();
        this.resize_event();
        this.start_idle_loop(); 
    }

    private start_idle_loop() {
        // dont reanimate
        if (this.idle_id !== null) return;

        const animate = async () => {
            await this.projector.rotate_x(0.00015); 
            await this.projector.project();
            await this.projector.draw();
            
            this.idle_id = requestAnimationFrame(animate);
        };
        
        this.idle_id = requestAnimationFrame(animate);
    }

    private stop_idle_loop() {
        // stop loop
        if (this.idle_id !== null) {
            cancelAnimationFrame(this.idle_id);
            this.idle_id = null;
        }
    }

    private async scroll_up_event() {
        const header: HTMLElement = document.querySelector("header") as HTMLElement;
        const hero: HTMLElement = document.querySelector(".hero") as HTMLElement;
        // scroll up
        await this.projector.rotate_z(-0.02);
        await this.projector.project();
        // add fixed header
        header?.classList.add("header-fixed");
        hero.style.paddingTop = `${header.offsetHeight}px`;
    }
    private async scroll_down_event() {
        const header: HTMLElement = document.querySelector("header") as HTMLElement;
        const hero: HTMLElement = document.querySelector(".hero") as HTMLElement;
        // scroll down
        await this.projector.rotate_z(0.02);
        await this.projector.project();
        // remove fixed header
        header?.classList.remove("header-fixed");
        hero.style.paddingTop = "0px";
    }

    private async scroll_event() {
        // on scroll
        document.addEventListener("scroll", () => {
            this.stop_idle_loop();

            const current_scroll = window.scrollY;
            const is_scrolling_up = current_scroll < this.last_scroll_pos;
            this.last_scroll_pos = window.scrollY;

            if (!this.ticking) {
                this.ticking = true;
                window.requestAnimationFrame(async ()=>{
                    if (is_scrolling_up) {
                        this.scroll_up_event();
                    } else {
                        this.scroll_down_event();
                    }
                    await this.projector.draw();
                    this.ticking = false;
                });
            }

            // timeout for when scrolling stopoed
            window.clearTimeout(this.scroll_timer);
            this.scroll_timer = window.setTimeout(() => {
                this.start_idle_loop();
            }, 150); 
        });
    }

    private resize_event() {
        window.addEventListener("resize", async ()=> {    
            await this.projector.rescale();
            await this.projector.project();
            await this.projector.draw();
        });
    }

    private ticking: boolean = false;
    private last_scroll_pos: number = window.scrollY;
    private idle_id: number | null = null;          
    private scroll_timer: number | undefined;

    private projector: Projector;
}

async function main(): Promise<void> {
    const canvas: CanvasManager = new CanvasManager("bg-canvas");
    const projector: Projector = new Projector(canvas, "static/projection_inputs/input_blend_tower.txt");
    await projector.init();
    await projector.rotate_y(Math.PI/4);
    await projector.draw();

    const bgM: EventsManager = new EventsManager(projector); 
}

main();