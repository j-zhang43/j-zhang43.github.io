// TODO: transport to typescript

// TODO:
// custom animation for underline
// custom mouse
// nav always on, (sticky) and remove background

// TODO 
// only work when
function swipe_in_header() {

}

function isInView(element){
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// TODO
// when holding on small screens move dots away
// delete after 60 secs, 
// only play when in view
function magSection() {
  // Generate Dots
  const BODY_WIDTH = Math.min(1000, document.querySelector("body").clientWidth);
  const MAX_DOTS = BODY_WIDTH;
  const MIN_DOT_SIZE = 0.5;
  const VAR_DOT = 0.5;
  const RANDOM_COLOR = false;

  const mag_sec = document.querySelector(".mag-sec");
  const rem_size = parseFloat(
    window.getComputedStyle(document.documentElement).fontSize
  );
  let dots = [];

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < MAX_DOTS; i++) {
    const mag_dot = document.createElement("div");
    mag_dot.className = "mag-dot";

    const size = (Math.random() * VAR_DOT + MIN_DOT_SIZE) * rem_size;
    mag_dot.style.width = `${size}px`;
    mag_dot.style.height = `${size}px`;

    mag_dot.style.left = `${Math.random() * (mag_sec.clientWidth - size)}px`;
    mag_dot.style.top = `${Math.random() * (mag_sec.clientHeight - size)}px`;

    if (RANDOM_COLOR)
      mag_dot.style.backgroundColor = `rgb(${Math.random() * 255},${
        Math.random() * 255
      },${Math.random() * 255})`;
        
    dots.push(mag_dot);
    fragment.appendChild(mag_dot);
  }
  mag_sec.appendChild(fragment);

  // Create Dots movement
  const SPEED_CONST = 0.5;
  const SPEED_MIN = 0.5;
  const SECONDS_FADE = 60;

  let velocities = [];

  for (let i = 0; i < MAX_DOTS; i++) {
    let speed = SPEED_CONST * Math.random() + SPEED_MIN;

    const rand_rad = Math.random() * 2 * Math.PI;
    const x_velocity = Math.cos(rand_rad) * speed;
    const y_velocity = Math.sin(rand_rad) * speed;

    velocities.push([x_velocity, y_velocity]);
  }

  const STARTING_OPACITY = 0.5;
  const START_TIME = Date.now();

  function updateDots() {
    const now = Date.now();
    const elapsed_time = (now - START_TIME) / 1000;

    if (elapsed_time >= SECONDS_FADE) {
      return;
    }

    for (let i = 0; i < MAX_DOTS; i++) {
      const dot = dots[i];
      const dot_x = parseFloat(dot.style.left);
      const dot_y = parseFloat(dot.style.top);

      dot.style.left = `${dot_x + velocities[i][0]}px`;
      dot.style.top = `${dot_y + velocities[i][1]}px`;

      dot.style.opacity =
        STARTING_OPACITY - (elapsed_time / SECONDS_FADE) * STARTING_OPACITY;
    }
    requestAnimationFrame(updateDots);
  }
  updateDots();

  // Mouse repeals dots
  const MAX_DIST = 100;
  const REPEAL_CONST = 0.5;
  mag_sec.addEventListener("mousemove", mouseRepeal);

  function mouseRepeal(e) {
    const mouse_x = e.clientX - mag_sec.offsetLeft;
    const mouse_y = e.clientY - mag_sec.offsetTop;
    for (let i = 0; i < MAX_DOTS; i++) {
      const dot = dots[i];
      const dot_x = parseFloat(dot.style.left);
      const dot_y = parseFloat(dot.style.top);

      const dist = Math.sqrt(
        Math.pow(mouse_x - dot_x, 2) + Math.pow(mouse_y - dot_y, 2)
      );
      if (dist < MAX_DIST) {
        velocities[i][0] += (REPEAL_CONST * (dot_x - mouse_x)) / dist;
        velocities[i][1] += (REPEAL_CONST * (dot_y - mouse_y)) / dist;
      }
    }
  }
}

magSection();
