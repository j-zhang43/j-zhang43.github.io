// TODO List:
// - Object Class
// - Morphing
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Point_2D, Point_3D } from "./points.js";
// colors
const black = "#1f1f1f";
const teal = "#62A8AC";
const white = "#FFFFFF";
const cyan = "#5497A7";
const dark_cyan = "#50858B";
class CanvasManager {
    constructor(canvas_id) {
        this.canvas = document.querySelector(`#${canvas_id}`);
        this.ctx = this.canvas.getContext("2d");
        // changes canvas style to correct width based on CSS
        const canvas_style = getComputedStyle(this.canvas);
        const css_width = parseInt(canvas_style.width);
        const css_height = parseInt(canvas_style.height);
        // changes width and height based on style
        this.canvas.width = css_width;
        this.canvas.height = css_height;
        // translate canvas to center
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        // color of stroke
        this.ctx.strokeStyle = cyan;
        this.ctx.fillStyle = dark_cyan;
    }
    width() { return this.canvas.width; }
    height() { return this.canvas.height; }
    clear() { this.ctx.clearRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height); }
    // draws line from p1 to p2
    draw_line(p1, p2) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    }
    // draws circle at p1 with radius r
    draw_circle(p1, r, is_filled) {
        this.ctx.beginPath();
        this.ctx.arc(p1.x, p1.y, r, 0, 2 * Math.PI);
        if (is_filled) {
            this.ctx.fill();
        }
        this.ctx.stroke();
    }
}
class Projector {
    constructor(canvas, path) {
        this.points_3d = [];
        this.points_2d = [];
        this.edges = [];
        this.scale = 1;
        this.path = "static/projection_inputs/input_blend_tower.txt";
        this.canvas = canvas;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.process_input();
            this.project();
            this.rescale();
        });
    }
    process_input() {
        return __awaiter(this, void 0, void 0, function* () {
            // clear past points ands edges
            this.points_3d.length = 0;
            this.edges.length = 0;
            // get file and parse to lines
            const response = yield fetch(this.path);
            const content = yield response.text();
            const lines = content.split(/\r?\n/);
            const points_count = parseInt(lines[0]);
            // add each line and edge
            for (let i = 1; i <= points_count; ++i) {
                this.points_3d.push(new Point_3D(lines[i]));
            }
            for (let i = points_count + 2; i < lines.length; ++i) {
                const parts = lines[i].split(" ");
                this.edges.push([parseInt(parts[0]), parseInt(parts[1])]);
            }
        });
    }
    draw() {
        return __awaiter(this, void 0, void 0, function* () {
            this.canvas.clear();
            for (const point2d of this.points_2d) {
                this.canvas.draw_circle(point2d, 4, false);
            }
            for (const edge of this.edges) {
                this.canvas.draw_line(this.points_2d[edge[0]], this.points_2d[edge[1]]);
            }
        });
    }
    project() {
        return __awaiter(this, void 0, void 0, function* () {
            // projects 3d points to 2d using basic projection matrix oblique projection of
            //  [ 1 0 1/2 ]
            //  [ 0 1 1/2 ]
            this.points_2d.length = 0;
            for (const point_3d of this.points_3d) {
                this.points_2d.push(new Point_2D(this.scale * (point_3d.x + (0.5) * point_3d.z), this.scale * (point_3d.y + (0.5) * point_3d.z)));
            }
        });
    }
    rescale() {
        return __awaiter(this, void 0, void 0, function* () {
            // do one full rotation to caclulate max_y and max_x for scale
            let min_x = Infinity;
            let max_x = -Infinity;
            let min_y = Infinity;
            let max_y = -Infinity;
            for (let theta = 0; theta < 2 * Math.PI; theta += (2 * Math.PI) / 1000) {
                for (const point2d of this.points_2d) {
                    min_x = Math.min(point2d.x, min_x);
                    max_x = Math.max(point2d.x, max_x);
                    min_y = Math.min(point2d.y, min_y);
                    max_y = Math.max(point2d.y, max_y);
                }
                this.rotate_z(0.1);
            }
            for (let theta = 0; theta < 2 * Math.PI; theta += (2 * Math.PI) / 1000) {
                for (const point2d of this.points_2d) {
                    min_x = Math.min(point2d.x, min_x);
                    max_x = Math.max(point2d.x, max_x);
                    min_y = Math.min(point2d.y, min_y);
                    max_y = Math.max(point2d.y, max_y);
                }
                this.rotate_y(0.1);
            }
            for (let theta = 0; theta < 2 * Math.PI; theta += (2 * Math.PI) / 1000) {
                for (const point2d of this.points_2d) {
                    min_x = Math.min(point2d.x, min_x);
                    max_x = Math.max(point2d.x, max_x);
                    min_y = Math.min(point2d.y, min_y);
                    max_y = Math.max(point2d.y, max_y);
                }
                this.rotate_z(0.1);
            }
            const x_scale = (this.canvas.width() * .8) / (max_x - min_x);
            const y_scale = (this.canvas.height() * .8) / (max_y - min_y);
            this.scale = Math.min(x_scale, y_scale);
            this.project();
        });
    }
    rotate_z(theta) {
        return __awaiter(this, void 0, void 0, function* () {
            // rotates 3d points by theta in radians
            for (let point_3d of this.points_3d) {
                const new_x = Math.cos(theta) * point_3d.x - Math.sin(theta) * point_3d.y;
                const new_y = Math.sin(theta) * point_3d.x + Math.cos(theta) * point_3d.y;
                point_3d.x = new_x;
                point_3d.y = new_y;
            }
        });
    }
    rotate_y(theta) {
        return __awaiter(this, void 0, void 0, function* () {
            // rotates 3d points by theta in radians
            for (let point_3d of this.points_3d) {
                const new_x = Math.cos(theta) * point_3d.x + Math.sin(theta) * point_3d.z;
                const new_z = -Math.sin(theta) * point_3d.x + Math.cos(theta) * point_3d.z;
                point_3d.x = new_x;
                point_3d.z = new_z;
            }
        });
    }
    rotate_x(theta) {
        return __awaiter(this, void 0, void 0, function* () {
            // rotates 3d points by theta in radians
            for (let point_3d of this.points_3d) {
                const new_y = Math.cos(theta) * point_3d.y - Math.sin(theta) * point_3d.z;
                const new_z = Math.sin(theta) * point_3d.y + Math.cos(theta) * point_3d.z;
                point_3d.y = new_y;
                point_3d.z = new_z;
            }
        });
    }
}
class EventsManager {
    constructor(projector) {
        this.ticking = false;
        this.last_scroll_pos = window.scrollY;
        this.idle_id = null;
        this.projector = projector;
        this.scroll_event();
        this.resize_event();
        this.start_idle_loop();
    }
    start_idle_loop() {
        // dont reanimate
        if (this.idle_id !== null)
            return;
        const animate = () => __awaiter(this, void 0, void 0, function* () {
            yield this.projector.rotate_x(0.00015);
            yield this.projector.project();
            yield this.projector.draw();
            this.idle_id = requestAnimationFrame(animate);
        });
        this.idle_id = requestAnimationFrame(animate);
    }
    stop_idle_loop() {
        // stop loop
        if (this.idle_id !== null) {
            cancelAnimationFrame(this.idle_id);
            this.idle_id = null;
        }
    }
    scroll_up_event() {
        return __awaiter(this, void 0, void 0, function* () {
            const header = document.querySelector("header");
            const hero = document.querySelector(".hero");
            // scroll up
            yield this.projector.rotate_z(-0.02);
            yield this.projector.project();
            // add fixed header
            header === null || header === void 0 ? void 0 : header.classList.add("header-fixed");
            hero.style.paddingTop = `${header.offsetHeight}px`;
        });
    }
    scroll_down_event() {
        return __awaiter(this, void 0, void 0, function* () {
            const header = document.querySelector("header");
            const hero = document.querySelector(".hero");
            // scroll down
            yield this.projector.rotate_z(0.02);
            yield this.projector.project();
            // remove fixed header
            header === null || header === void 0 ? void 0 : header.classList.remove("header-fixed");
            hero.style.paddingTop = "0px";
        });
    }
    scroll_event() {
        return __awaiter(this, void 0, void 0, function* () {
            // on scroll
            document.addEventListener("scroll", () => {
                this.stop_idle_loop();
                const current_scroll = window.scrollY;
                const is_scrolling_up = current_scroll < this.last_scroll_pos;
                this.last_scroll_pos = window.scrollY;
                if (!this.ticking) {
                    this.ticking = true;
                    window.requestAnimationFrame(() => __awaiter(this, void 0, void 0, function* () {
                        if (is_scrolling_up) {
                            this.scroll_up_event();
                        }
                        else {
                            this.scroll_down_event();
                        }
                        yield this.projector.draw();
                        this.ticking = false;
                    }));
                }
                // timeout for when scrolling stopoed
                window.clearTimeout(this.scroll_timer);
                this.scroll_timer = window.setTimeout(() => {
                    this.start_idle_loop();
                }, 150);
            });
        });
    }
    resize_event() {
        window.addEventListener("resize", () => __awaiter(this, void 0, void 0, function* () {
            yield this.projector.rescale();
            yield this.projector.project();
            yield this.projector.draw();
        }));
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const canvas = new CanvasManager("bg-canvas");
        const projector = new Projector(canvas, "static/projection_inputs/input_blend_tower.txt");
        yield projector.init();
        yield projector.rotate_y(Math.PI / 4);
        yield projector.draw();
        const bgM = new EventsManager(projector);
    });
}
main();
