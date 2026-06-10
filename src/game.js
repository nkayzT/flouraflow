// ============================================================
// SECTION A - CONSTANTS
// ============================================================

export const TILE_SIZE = 32;

export const TILE = {
  GRASS:      0,
  GRASS_DARK: 1,
  PATH:       2,
  TREE:       3,
  BORDER:     4,
  ROOF_L:     5,
  ROOF_M:     6,
  ROOF_R:     7,
  WALL_TOP:   8,
  WALL_F:     9,
  DOOR:       10,
  FLOWER:     11,
  PATH_H:     13,
  FLOOR:      20,
  WALL_IN:    22,
  WALL_FACE:  28,
  PAINT_L1:   23,
  PAINT_L2:   24,
  PAINT_R1:   25,
  PAINT_R2:   26,
  EXIT:       27,
};

export const SOLID = new Set([
  TILE.BORDER,
  TILE.TREE,
  TILE.ROOF_L,
  TILE.ROOF_M,
  TILE.ROOF_R,
  TILE.WALL_TOP,
  TILE.WALL_F,
  TILE.WALL_IN,
  TILE.WALL_FACE,
  TILE.PAINT_L1,
  TILE.PAINT_L2,
  TILE.PAINT_R1,
  TILE.PAINT_R2,
]);

// Maps tile type → index into the projects array
export const PAINTING_PROJECTS = new Map([
  [TILE.PAINT_L1, 0],
  [TILE.PAINT_L2, 1],
  [TILE.PAINT_R1, 2],
  [TILE.PAINT_R2, 3],
]);

// ============================================================
// SECTION B - MAP DATA
// ============================================================

const OUTDOOR_MAP = [
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,3,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,3,1,4],
  [4,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,4],
  [4,0,0,0,0,5,6,6,6,6,6,6,6,7,0,0,0,0,0,4],
  [4,0,0,0,0,8,8,8,8,8,8,8,8,8,0,0,0,0,0,4],
  [4,0,0,0,0,9,9,9,9,10,9,9,9,9,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,11,0,0,0,0,0,2,0,0,0,0,0,11,0,0,0,4],
  [4,3,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,3,0,4],
  [4,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,11,0,0,0,0,0,2,0,0,0,0,0,11,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,4],
  [4,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,4],
  [4,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
];

const INDOOR_MAP = [
  [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
  [22,28,20,20,20,20,20,20,20,20,20,20,20,20,28,22],
  [22,23,20,20,20,20,20,20,20,20,20,20,20,20,25,22],
  [22,28,20,20,20,20,20,20,20,20,20,20,20,20,28,22],
  [22,28,20,20,20,20,20,20,20,20,20,20,20,20,28,22],
  [22,24,20,20,20,20,20,20,20,20,20,20,20,20,26,22],
  [22,28,20,20,20,20,20,20,20,20,20,20,20,20,28,22],
  [22,28,20,20,20,20,20,20,20,20,20,20,20,20,28,22],
  [22,28,20,20,20,27,20,20,20,20,20,20,20,20,28,22],
  [22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22],
];

const OUTDOOR_COLS = OUTDOOR_MAP[0].length; // 20
const OUTDOOR_ROWS = OUTDOOR_MAP.length;    // 15
const INDOOR_COLS  = INDOOR_MAP[0].length;  // 16
const INDOOR_ROWS  = INDOOR_MAP.length;     // 10

// ============================================================
// SECTION C - TILE DRAWING FUNCTIONS
// ============================================================

function drawTile(ctx, tileType, px, py, T) {
  const x = px;
  const y = py;

  switch (tileType) {

    // --- GRASS ---
    case TILE.GRASS: {
      ctx.fillStyle = '#78C850';
      ctx.fillRect(x, y, T, T);
      // subtle texture stripes
      ctx.fillStyle = '#6CBD46';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(x + (i * 11) % T, y + 2, 3, 1);
        ctx.fillRect(x + (i * 7 + 4) % T, y + 14, 2, 1);
        ctx.fillRect(x + (i * 13 + 2) % T, y + 24, 3, 1);
      }
      ctx.fillStyle = '#5AB840';
      ctx.fillRect(x + 6, y + 8, 2, 2);
      ctx.fillRect(x + 20, y + 20, 2, 2);
      break;
    }

    // --- GRASS DARK ---
    case TILE.GRASS_DARK: {
      ctx.fillStyle = '#4A8828';
      ctx.fillRect(x, y, T, T);
      ctx.fillStyle = '#3E7A22';
      ctx.fillRect(x + 4, y + 4, 3, 2);
      ctx.fillRect(x + 18, y + 18, 2, 2);
      ctx.fillRect(x + 10, y + 24, 4, 1);
      break;
    }

    // --- PATH (vertical) ---
    case TILE.PATH: {
      ctx.fillStyle = '#DCC070';
      ctx.fillRect(x, y, T, T);
      // side shading
      ctx.fillStyle = '#C8AC5C';
      ctx.fillRect(x, y, 2, T);
      ctx.fillRect(x + T - 2, y, 2, T);
      // subtle texture
      ctx.fillStyle = '#D0B464';
      ctx.fillRect(x + 8, y + 6, 2, 1);
      ctx.fillRect(x + 20, y + 18, 2, 1);
      ctx.fillRect(x + 14, y + 26, 2, 1);
      break;
    }

    // --- PATH HORIZONTAL ---
    case TILE.PATH_H: {
      ctx.fillStyle = '#DCC070';
      ctx.fillRect(x, y, T, T);
      ctx.fillStyle = '#C8AC5C';
      ctx.fillRect(x, y, T, 2);
      ctx.fillRect(x, y + T - 2, T, 2);
      ctx.fillStyle = '#D0B464';
      ctx.fillRect(x + 6, y + 12, 2, 1);
      ctx.fillRect(x + 18, y + 20, 2, 1);
      break;
    }

    // --- TREE ---
    case TILE.TREE: {
      // grass base
      ctx.fillStyle = '#78C850';
      ctx.fillRect(x, y, T, T);
      // trunk
      ctx.fillStyle = '#885030';
      ctx.fillRect(x + 12, y + 20, 8, 12);
      ctx.fillStyle = '#6A3C20';
      ctx.fillRect(x + 12, y + 20, 2, 12);
      // canopy shadow/base
      ctx.fillStyle = '#2A8818';
      ctx.fillRect(x + 2, y + 6, T - 4, T - 8);
      // canopy main
      ctx.fillStyle = '#3AA820';
      ctx.fillRect(x + 4, y + 4, T - 8, T - 10);
      // canopy highlight
      ctx.fillStyle = '#5AC838';
      ctx.fillRect(x + 6, y + 4, T - 14, 6);
      ctx.fillRect(x + 4, y + 6, 4, 4);
      // dark spots
      ctx.fillStyle = '#28901A';
      ctx.fillRect(x + 18, y + 10, 4, 4);
      ctx.fillRect(x + 10, y + 18, 3, 3);
      break;
    }

    // --- BORDER ---
    case TILE.BORDER: {
      ctx.fillStyle = '#283018';
      ctx.fillRect(x, y, T, T);
      ctx.fillStyle = '#202810';
      ctx.fillRect(x, y, T, 2);
      ctx.fillRect(x, y, 2, T);
      break;
    }

    // --- ROOF LEFT ---
    case TILE.ROOF_L: {
      ctx.fillStyle = '#CC3030';
      ctx.fillRect(x, y, T, T);
      // left cap / edge
      ctx.fillStyle = '#AA1818';
      ctx.fillRect(x, y, 4, T);
      // bottom shadow
      ctx.fillStyle = '#AA1818';
      ctx.fillRect(x, y + T - 6, T, 6);
      // tile grooves (horizontal lines)
      ctx.fillStyle = '#B82020';
      for (let gy = 6; gy < T - 6; gy += 8) {
        ctx.fillRect(x + 4, y + gy, T - 4, 2);
      }
      // highlight top edge
      ctx.fillStyle = '#E05050';
      ctx.fillRect(x + 4, y, T - 4, 3);
      break;
    }

    // --- ROOF MIDDLE ---
    case TILE.ROOF_M: {
      ctx.fillStyle = '#CC3030';
      ctx.fillRect(x, y, T, T);
      ctx.fillStyle = '#AA1818';
      ctx.fillRect(x, y + T - 6, T, 6);
      ctx.fillStyle = '#B82020';
      for (let gy = 6; gy < T - 6; gy += 8) {
        ctx.fillRect(x, y + gy, T, 2);
      }
      ctx.fillStyle = '#E05050';
      ctx.fillRect(x, y, T, 3);
      break;
    }

    // --- ROOF RIGHT ---
    case TILE.ROOF_R: {
      ctx.fillStyle = '#CC3030';
      ctx.fillRect(x, y, T, T);
      // right cap
      ctx.fillStyle = '#AA1818';
      ctx.fillRect(x + T - 4, y, 4, T);
      ctx.fillStyle = '#AA1818';
      ctx.fillRect(x, y + T - 6, T, 6);
      ctx.fillStyle = '#B82020';
      for (let gy = 6; gy < T - 6; gy += 8) {
        ctx.fillRect(x, y + gy, T - 4, 2);
      }
      ctx.fillStyle = '#E05050';
      ctx.fillRect(x, y, T - 4, 3);
      break;
    }

    // --- WALL TOP (beige header) ---
    case TILE.WALL_TOP: {
      ctx.fillStyle = '#B89060';
      ctx.fillRect(x, y, T, T);
      ctx.fillStyle = '#D0A870';
      ctx.fillRect(x, y + 2, T, T - 4);
      ctx.fillStyle = '#9A7848';
      ctx.fillRect(x, y, T, 2);
      ctx.fillRect(x, y + T - 2, T, 2);
      break;
    }

    // --- WALL FACE (outdoor) ---
    case TILE.WALL_F: {
      ctx.fillStyle = '#D0A868';
      ctx.fillRect(x, y, T, T);
      // window (if tile is wide enough conceptually - draw small window detail)
      ctx.fillStyle = '#B89050';
      ctx.fillRect(x, y, T, 3);
      ctx.fillRect(x, y + T - 3, T, 3);
      // faint horizontal planks
      ctx.fillStyle = '#C49A5C';
      ctx.fillRect(x, y + 10, T, 1);
      ctx.fillRect(x, y + 21, T, 1);
      break;
    }

    // --- DOOR ---
    case TILE.DOOR: {
      // step / threshold
      ctx.fillStyle = '#DCC080';
      ctx.fillRect(x, y + T - 6, T, 6);
      // door frame
      ctx.fillStyle = '#885020';
      ctx.fillRect(x + 4, y, T - 8, T - 4);
      // door opening
      ctx.fillStyle = '#2A1408';
      ctx.fillRect(x + 6, y + 2, T - 12, T - 10);
      // frame details
      ctx.fillStyle = '#6A3C14';
      ctx.fillRect(x + 4, y, 3, T - 4);
      ctx.fillRect(x + T - 7, y, 3, T - 4);
      ctx.fillRect(x + 4, y, T - 8, 3);
      // door knob
      ctx.fillStyle = '#E0C040';
      ctx.fillRect(x + T - 11, y + 16, 3, 3);
      break;
    }

    // --- FLOWER ---
    case TILE.FLOWER: {
      // grass base
      ctx.fillStyle = '#78C850';
      ctx.fillRect(x, y, T, T);
      ctx.fillStyle = '#6CBD46';
      ctx.fillRect(x + 8, y + 4, 2, 1);
      ctx.fillRect(x + 20, y + 20, 3, 1);
      // stem
      ctx.fillStyle = '#40A020';
      ctx.fillRect(x + 14, y + 18, 2, 5);
      ctx.fillRect(x + 14, y + 4, 2, 5);
      // petals (small cross pattern)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + 12, y + 10, 2, 8);
      ctx.fillRect(x + 10, y + 12, 6, 4);  // horizontal
      // center
      ctx.fillStyle = '#FFE000';
      ctx.fillRect(x + 13, y + 13, 4, 4);
      // second smaller flower
      ctx.fillStyle = '#FF88BB';
      ctx.fillRect(x + 22, y + 8, 2, 6);
      ctx.fillRect(x + 20, y + 10, 6, 2);
      ctx.fillStyle = '#FFE000';
      ctx.fillRect(x + 22, y + 10, 2, 2);
      break;
    }

    // --- FLOOR (indoor) ---
    case TILE.FLOOR: {
      ctx.fillStyle = '#D4C08A';
      ctx.fillRect(x, y, T, T);
      // wood plank lines
      ctx.fillStyle = '#C8B47C';
      ctx.fillRect(x, y + 8, T, 1);
      ctx.fillRect(x, y + 16, T, 1);
      ctx.fillRect(x, y + 24, T, 1);
      ctx.fillStyle = '#BCA870';
      ctx.fillRect(x + 16, y, 1, 8);
      ctx.fillRect(x + 8, y + 8, 1, 8);
      ctx.fillRect(x + 24, y + 16, 1, 8);
      ctx.fillRect(x + 16, y + 24, 1, 8);
      break;
    }

    // --- WALL IN (indoor outer wall, dark) ---
    case TILE.WALL_IN: {
      ctx.fillStyle = '#9A6838';
      ctx.fillRect(x, y, T, T);
      ctx.fillStyle = '#7A5028';
      ctx.fillRect(x, y, T, 3);
      ctx.fillRect(x, y + T - 3, T, 3);
      ctx.fillRect(x, y, 3, T);
      ctx.fillRect(x + T - 3, y, 3, T);
      ctx.fillStyle = '#8A5C30';
      ctx.fillRect(x + 3, y + 3, T - 6, T - 6);
      break;
    }

    // --- WALL FACE (indoor inner surface) ---
    case TILE.WALL_FACE: {
      ctx.fillStyle = '#C08840';
      ctx.fillRect(x, y, T, T);
      ctx.fillStyle = '#A87030';
      ctx.fillRect(x, y, T, 2);
      ctx.fillRect(x, y + T - 2, T, 2);
      ctx.fillStyle = '#D09A50';
      ctx.fillRect(x + 2, y + 6, T - 4, 2);
      ctx.fillRect(x + 2, y + 18, T - 4, 2);
      break;
    }

    // --- PAINTING LEFT 1 (blue canvas, circle icon) ---
    case TILE.PAINT_L1: {
      // wall face behind painting
      ctx.fillStyle = '#C08840';
      ctx.fillRect(x, y, T, T);
      // outer wood frame
      ctx.fillStyle = '#6B3F12';
      ctx.fillRect(x + 2, y + 2, T - 4, T - 4);
      // inner frame highlight
      ctx.fillStyle = '#A0681E';
      ctx.fillRect(x + 4, y + 4, T - 8, T - 8);
      // painting canvas - blue
      ctx.fillStyle = '#2858A0';
      ctx.fillRect(x + 6, y + 6, T - 12, T - 12);
      // gradient-like shading
      ctx.fillStyle = '#3870C8';
      ctx.fillRect(x + 6, y + 6, T - 12, 4);
      // white circle icon
      ctx.fillStyle = '#FFFFFF';
      // draw circle as block pixels
      const cx = x + T / 2;
      const cy = y + T / 2;
      const r = 6;
      for (let dy2 = -r; dy2 <= r; dy2++) {
        for (let dx2 = -r; dx2 <= r; dx2++) {
          if (dx2 * dx2 + dy2 * dy2 <= r * r) {
            ctx.fillRect(cx + dx2, cy + dy2, 1, 1);
          }
        }
      }
      // inner circle accent
      ctx.fillStyle = '#88BBFF';
      for (let dy2 = -3; dy2 <= 3; dy2++) {
        for (let dx2 = -3; dx2 <= 3; dx2++) {
          if (dx2 * dx2 + dy2 * dy2 <= 9) {
            ctx.fillRect(cx + dx2, cy + dy2, 1, 1);
          }
        }
      }
      break;
    }

    // --- PAINTING LEFT 2 (orange canvas, triangle icon) ---
    case TILE.PAINT_L2: {
      ctx.fillStyle = '#C08840';
      ctx.fillRect(x, y, T, T);
      ctx.fillStyle = '#6B3F12';
      ctx.fillRect(x + 2, y + 2, T - 4, T - 4);
      ctx.fillStyle = '#A0681E';
      ctx.fillRect(x + 4, y + 4, T - 8, T - 8);
      // orange canvas
      ctx.fillStyle = '#C05010';
      ctx.fillRect(x + 6, y + 6, T - 12, T - 12);
      ctx.fillStyle = '#E06820';
      ctx.fillRect(x + 6, y + 6, T - 12, 4);
      // white triangle icon (drawn as rows)
      ctx.fillStyle = '#FFFFFF';
      const tx = x + T / 2;
      const ty = y + 8;
      // triangle: top point at ty+2, base at ty+14
      for (let row = 0; row <= 12; row++) {
        const half = Math.round((row / 12) * 6);
        ctx.fillRect(tx - half, ty + row, half * 2 + 1, 1);
      }
      break;
    }

    // --- PAINTING RIGHT 1 (green canvas, diamond icon) ---
    case TILE.PAINT_R1: {
      ctx.fillStyle = '#C08840';
      ctx.fillRect(x, y, T, T);
      ctx.fillStyle = '#6B3F12';
      ctx.fillRect(x + 2, y + 2, T - 4, T - 4);
      ctx.fillStyle = '#A0681E';
      ctx.fillRect(x + 4, y + 4, T - 8, T - 8);
      // green canvas
      ctx.fillStyle = '#187830';
      ctx.fillRect(x + 6, y + 6, T - 12, T - 12);
      ctx.fillStyle = '#28A040';
      ctx.fillRect(x + 6, y + 6, T - 12, 4);
      // white diamond icon
      ctx.fillStyle = '#FFFFFF';
      const dx3 = x + T / 2;
      const dy3 = y + T / 2;
      const dr = 7;
      for (let row = -dr; row <= dr; row++) {
        const half = dr - Math.abs(row);
        ctx.fillRect(dx3 - half, dy3 + row, half * 2 + 1, 1);
      }
      // inner diamond
      ctx.fillStyle = '#88FFAA';
      for (let row = -3; row <= 3; row++) {
        const half = 3 - Math.abs(row);
        ctx.fillRect(dx3 - half, dy3 + row, half * 2 + 1, 1);
      }
      break;
    }

    // --- PAINTING RIGHT 2 (purple canvas, star icon) ---
    case TILE.PAINT_R2: {
      ctx.fillStyle = '#C08840';
      ctx.fillRect(x, y, T, T);
      ctx.fillStyle = '#6B3F12';
      ctx.fillRect(x + 2, y + 2, T - 4, T - 4);
      ctx.fillStyle = '#A0681E';
      ctx.fillRect(x + 4, y + 4, T - 8, T - 8);
      // purple canvas
      ctx.fillStyle = '#501880';
      ctx.fillRect(x + 6, y + 6, T - 12, T - 12);
      ctx.fillStyle = '#7030A8';
      ctx.fillRect(x + 6, y + 6, T - 12, 4);
      // white star icon (5-point star approximation with pixels)
      ctx.fillStyle = '#FFFFFF';
      const sx = x + T / 2;
      const sy = y + T / 2;
      // Draw a star using line segments approximated as rects
      // Center + 5 rays
      ctx.fillRect(sx - 1, sy - 8, 2, 16); // vertical
      ctx.fillRect(sx - 8, sy - 1, 16, 2); // horizontal
      // diagonals (approximate)
      for (let i = 0; i < 6; i++) {
        ctx.fillRect(sx - 5 + i, sy - 5 + i, 2, 2);
        ctx.fillRect(sx + 5 - i, sy - 5 + i, 2, 2);
      }
      // bright center
      ctx.fillStyle = '#FFEEAA';
      ctx.fillRect(sx - 2, sy - 2, 4, 4);
      break;
    }

    // --- EXIT (door mat / arrow) ---
    case TILE.EXIT: {
      ctx.fillStyle = '#DCC070';
      ctx.fillRect(x, y, T, T);
      ctx.fillStyle = '#C8AC5C';
      ctx.fillRect(x, y, 2, T);
      ctx.fillRect(x + T - 2, y, 2, T);
      // doormat
      ctx.fillStyle = '#A88840';
      ctx.fillRect(x + 4, y + 8, T - 8, T - 12);
      ctx.fillStyle = '#8A6C28';
      // down arrow
      ctx.fillRect(x + 14, y + 10, 4, 10);
      ctx.fillRect(x + 10, y + 16, 12, 3);
      ctx.fillRect(x + 11, y + 19, 10, 2);
      ctx.fillRect(x + 12, y + 21, 8, 2);
      ctx.fillRect(x + 14, y + 23, 4, 2);
      break;
    }

    default: {
      ctx.fillStyle = '#FF00FF';
      ctx.fillRect(x, y, T, T);
      break;
    }
  }
}

// ============================================================
// SECTION D - PLAYER SPRITE
// ============================================================

function drawPlayer(ctx, px, py, direction, animFrame, running) {
  const u = 2; // base pixel unit
  // center of the tile
  const cx = Math.floor(px + TILE_SIZE / 2);
  const cy = Math.floor(py + TILE_SIZE / 2);

  // Leg animation offsets
  // animFrame: 0 = neutral, 1 = left forward, 2 = neutral, 3 = right forward
  const legPhase = animFrame % 4;
  const leftLegOff  = (legPhase === 1) ? -2 : (legPhase === 3) ? 2 : 0;
  const rightLegOff = (legPhase === 1) ? 2  : (legPhase === 3) ? -2 : 0;
  const armSwing    = (legPhase === 1) ? 1  : (legPhase === 3) ? -1 : 0;

  if (direction === 'down') {
    // shoes / feet
    ctx.fillStyle = '#101010';
    ctx.fillRect(cx - 5,  cy + 9 + leftLegOff,  4, u);
    ctx.fillRect(cx + 1,  cy + 9 + rightLegOff, 4, u);
    // pants (blue)
    ctx.fillStyle = '#4060C0';
    ctx.fillRect(cx - 5,  cy + 5 + leftLegOff,  4, 6);
    ctx.fillRect(cx + 1,  cy + 5 + rightLegOff, 4, 6);
    // shirt (red)
    ctx.fillStyle = '#C83020';
    ctx.fillRect(cx - 6, cy - 2, 12, 8);
    // arms
    ctx.fillStyle = '#C83020';
    ctx.fillRect(cx - 8, cy - 2 + armSwing,  u, 6);
    ctx.fillRect(cx + 6,  cy - 2 - armSwing, u, 6);
    // skin hands
    ctx.fillStyle = '#F0C090';
    ctx.fillRect(cx - 8, cy + 4 + armSwing,  u, u);
    ctx.fillRect(cx + 6,  cy + 4 - armSwing, u, u);
    // neck/face
    ctx.fillStyle = '#F0C090';
    ctx.fillRect(cx - 4, cy - 8, 8, 8);
    // eyes
    ctx.fillStyle = '#181818';
    ctx.fillRect(cx - 3, cy - 5, u, u);
    ctx.fillRect(cx + 1,  cy - 5, u, u);
    // mouth (small)
    ctx.fillStyle = '#C07060';
    ctx.fillRect(cx - 1, cy - 2, 2, 1);
    // hat brim (front visible)
    ctx.fillStyle = '#CC2020';
    ctx.fillRect(cx - 7, cy - 10, 14, u);
    // hat top
    ctx.fillStyle = '#CC2020';
    ctx.fillRect(cx - 5, cy - 16, 10, 8);
    // hat button
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cx - 1, cy - 16, u, u);
    // hair visible under brim
    ctx.fillStyle = '#301808';
    ctx.fillRect(cx - 4, cy - 10, 8, 2);
  }

  else if (direction === 'up') {
    // shoes
    ctx.fillStyle = '#101010';
    ctx.fillRect(cx - 5, cy + 9 + leftLegOff,  4, u);
    ctx.fillRect(cx + 1, cy + 9 + rightLegOff, 4, u);
    // pants
    ctx.fillStyle = '#4060C0';
    ctx.fillRect(cx - 5, cy + 5 + leftLegOff,  4, 6);
    ctx.fillRect(cx + 1, cy + 5 + rightLegOff, 4, 6);
    // shirt back
    ctx.fillStyle = '#C83020';
    ctx.fillRect(cx - 6, cy - 2, 12, 8);
    // arms (back view, same sides flipped)
    ctx.fillStyle = '#C83020';
    ctx.fillRect(cx - 8, cy - 2 - armSwing, u, 6);
    ctx.fillRect(cx + 6,  cy - 2 + armSwing, u, 6);
    ctx.fillStyle = '#F0C090';
    ctx.fillRect(cx - 8, cy + 4 - armSwing, u, u);
    ctx.fillRect(cx + 6,  cy + 4 + armSwing, u, u);
    // head back (dark hair)
    ctx.fillStyle = '#301808';
    ctx.fillRect(cx - 4, cy - 8, 8, 8);
    // hat from behind
    ctx.fillStyle = '#CC2020';
    ctx.fillRect(cx - 5, cy - 16, 10, 8);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cx - 1, cy - 16, u, u);
    // hat brim back
    ctx.fillStyle = '#AA1818';
    ctx.fillRect(cx - 6, cy - 9, 12, u);
  }

  else if (direction === 'left') {
    // shoes
    ctx.fillStyle = '#101010';
    ctx.fillRect(cx - 6, cy + 9 + leftLegOff,  5, u);
    ctx.fillRect(cx - 4, cy + 9 + rightLegOff, 5, u);
    // pants
    ctx.fillStyle = '#4060C0';
    ctx.fillRect(cx - 5, cy + 5 + leftLegOff,  4, 6);
    ctx.fillRect(cx - 3, cy + 5 + rightLegOff, 4, 6);
    // shirt
    ctx.fillStyle = '#C83020';
    ctx.fillRect(cx - 6, cy - 2, 10, 8);
    // arm forward/back
    ctx.fillStyle = '#C83020';
    ctx.fillRect(cx - 8, cy - 1 + armSwing * 2, u, 5);
    ctx.fillRect(cx + 2,  cy - 1 - armSwing * 2, u, 5);
    ctx.fillStyle = '#F0C090';
    ctx.fillRect(cx - 8, cy + 4 + armSwing * 2, u, u);
    ctx.fillRect(cx + 2,  cy + 4 - armSwing * 2, u, u);
    // face (side)
    ctx.fillStyle = '#F0C090';
    ctx.fillRect(cx - 6, cy - 8, 6, 8);
    // nose
    ctx.fillStyle = '#D8A878';
    ctx.fillRect(cx - 7, cy - 4, u, u);
    // eye (one visible)
    ctx.fillStyle = '#181818';
    ctx.fillRect(cx - 5, cy - 5, u, u);
    // ear
    ctx.fillStyle = '#D8A878';
    ctx.fillRect(cx + 0, cy - 6, u, u);
    // hair
    ctx.fillStyle = '#301808';
    ctx.fillRect(cx - 5, cy - 9, 8, 3);
    // hat
    ctx.fillStyle = '#CC2020';
    ctx.fillRect(cx - 5, cy - 16, 8, 8);
    ctx.fillStyle = '#CC2020';
    ctx.fillRect(cx - 7, cy - 9,  10, u);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cx - 1, cy - 16, u, u);
  }

  else if (direction === 'right') {
    // shoes
    ctx.fillStyle = '#101010';
    ctx.fillRect(cx + 1, cy + 9 + leftLegOff,  5, u);
    ctx.fillRect(cx - 1, cy + 9 + rightLegOff, 5, u);
    // pants
    ctx.fillStyle = '#4060C0';
    ctx.fillRect(cx + 1, cy + 5 + leftLegOff,  4, 6);
    ctx.fillRect(cx - 1, cy + 5 + rightLegOff, 4, 6);
    // shirt
    ctx.fillStyle = '#C83020';
    ctx.fillRect(cx - 4, cy - 2, 10, 8);
    // arms
    ctx.fillStyle = '#C83020';
    ctx.fillRect(cx + 6,  cy - 1 + armSwing * 2, u, 5);
    ctx.fillRect(cx - 8, cy - 1 - armSwing * 2, u, 5);
    ctx.fillStyle = '#F0C090';
    ctx.fillRect(cx + 6,  cy + 4 + armSwing * 2, u, u);
    ctx.fillRect(cx - 8, cy + 4 - armSwing * 2, u, u);
    // face (side)
    ctx.fillStyle = '#F0C090';
    ctx.fillRect(cx, cy - 8, 6, 8);
    // nose
    ctx.fillStyle = '#D8A878';
    ctx.fillRect(cx + 5, cy - 4, u, u);
    // eye
    ctx.fillStyle = '#181818';
    ctx.fillRect(cx + 3, cy - 5, u, u);
    // ear
    ctx.fillStyle = '#D8A878';
    ctx.fillRect(cx - 2, cy - 6, u, u);
    // hair
    ctx.fillStyle = '#301808';
    ctx.fillRect(cx - 3, cy - 9, 8, 3);
    // hat
    ctx.fillStyle = '#CC2020';
    ctx.fillRect(cx - 3, cy - 16, 8, 8);
    ctx.fillStyle = '#CC2020';
    ctx.fillRect(cx - 3, cy - 9, 10, u);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cx - 1, cy - 16, u, u);
  }
}

// ============================================================
// DEFAULT PROJECTS DATA
// ============================================================

export const DEFAULT_PROJECTS = [
  {
    title: 'FlourAFlow',
    subtitle: 'Baking Intelligence',
    description: 'An AI-powered baking assistant that helps professional bakers scale recipes, track fermentation timing, and predict the perfect proofing window based on ambient conditions.',
    icon: '🌾',
    link: '#',
  },
  {
    title: 'NightRide',
    subtitle: 'Ambient Journey',
    description: 'A lo-fi music experience built with the Web Audio API. Drift through procedurally generated soundscapes inspired by late-night city drives. No two rides sound the same.',
    icon: '🌙',
    link: '#',
  },
  {
    title: 'PixelVault',
    subtitle: 'Asset Manager',
    description: 'A browser-based sprite sheet editor and asset manager for indie game developers. Supports palette swaps, animation preview, and one-click export to popular game engines.',
    icon: '🎮',
    link: '#',
  },
  {
    title: 'ChromaCast',
    subtitle: 'Color Tool',
    description: 'A colour harmony generator that takes a single seed colour and builds entire design system palettes. Exports to CSS custom properties, Tailwind config, or Figma tokens.',
    icon: '🎨',
    link: '#',
  },
];

// ============================================================
// SECTION E - GAME CLASS
// ============================================================

export class Game {
  constructor(canvas, projects, onProjectOpen) {
    this.canvas = canvas;
    this.projects = projects || DEFAULT_PROJECTS;
    this.onProjectOpen = onProjectOpen;

    // Fixed logical resolution
    this.W = 480;
    this.H = 288;
    canvas.width  = this.W;
    canvas.height = this.H;

    this.ctx = canvas.getContext('2d');

    // ---- Input ----
    this.keys = {};
    this.prevKeys = {};
    this.modalOpen = false;

    // ---- Scene state ----
    // 'outdoor' | 'indoor'
    this.scene = 'outdoor';

    // ---- Fade state ----
    // 'none' | 'fade_out' | 'fade_in'
    this.fadeState = 'none';
    this.fadeAlpha = 0;
    this.fadeDuration = 400; // ms
    this.fadeTimer = 0;
    this.pendingScene = null;
    this.pendingPlayerTile = null;

    // ---- Player ----
    this.player = {
      tileX: 9,
      tileY: 12,
      pixelX: 9 * TILE_SIZE,
      pixelY: 12 * TILE_SIZE,
      targetTileX: 9,
      targetTileY: 12,
      direction: 'down',
      moving: false,
      stepProgress: 0,
      animFrame: 0,
      stepCount: 0,
      running: false,
    };

    // ---- Camera ----
    this.camera = {
      x: 0,
      y: 0,
    };
    this._snapCamera();

    // ---- Painting proximity ----
    this.nearPainting = null; // { tileType, projectIndex, paintTileX, paintTileY }
    this.facingInteractive = false;

    // ---- Animation ----
    this.lastTime = 0;
    this.rafId = null;

    // ---- Movement input repeat ----
    this.moveHeld = false;
    this.moveHeldDir = null;

    this.setupInput();
    this.rafId = requestAnimationFrame((t) => this._loop(t));
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
  }

  resumeFromModal() {
    this.modalOpen = false;
  }

  // ---- Input ----
  setupInput() {
    this._onKeyDown = (e) => {
      const k = e.key;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
           'w','a','s','d','W','A','S','D',
           ' ','z','Z','Enter','Escape','Shift'].includes(k)) {
        e.preventDefault();
      }
      if (!this.keys[k]) {
        this.keys[k] = true;
        // Interact on press
        if ((k === 'z' || k === 'Z' || k === 'Enter') && !this.modalOpen) {
          this._handleInteract();
        }
      }
    };
    this._onKeyUp = (e) => {
      this.keys[e.key] = false;
    };
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
  }

  // ---- Main Loop ----
  _loop(timestamp) {
    const dt = Math.min(timestamp - this.lastTime, 50); // cap at 50ms
    this.lastTime = timestamp;

    this._update(dt);
    this._render();

    this.rafId = requestAnimationFrame((t) => this._loop(t));
  }

  // ---- Update ----
  _update(dt) {
    // Fade logic
    if (this.fadeState === 'fade_out') {
      this.fadeTimer += dt;
      this.fadeAlpha = Math.min(1, this.fadeTimer / this.fadeDuration);
      if (this.fadeAlpha >= 1) {
        // Switch scene
        this._switchScene();
        this.fadeState = 'fade_in';
        this.fadeTimer = 0;
      }
      return; // block movement during fade
    }
    if (this.fadeState === 'fade_in') {
      this.fadeTimer += dt;
      this.fadeAlpha = Math.max(0, 1 - this.fadeTimer / this.fadeDuration);
      if (this.fadeAlpha <= 0) {
        this.fadeAlpha = 0;
        this.fadeState = 'none';
      }
      // allow movement to resume after fade in (don't block)
    }

    if (this.modalOpen) return;

    // Running
    const running = !!(this.keys['Shift']);
    this.player.running = running;
    const stepSpeed = running ? 0.25 : 0.125;

    // Movement
    if (this.player.moving) {
      this.player.stepProgress += stepSpeed;
      if (this.player.stepProgress >= 1) {
        this.player.stepProgress = 1;
        // Snap to target
        this.player.tileX = this.player.targetTileX;
        this.player.tileY = this.player.targetTileY;
        this.player.pixelX = this.player.tileX * TILE_SIZE;
        this.player.pixelY = this.player.tileY * TILE_SIZE;
        this.player.moving = false;
        this.player.stepProgress = 0;
        // step counter for animation
        this.player.stepCount++;
        this.player.animFrame = this.player.stepCount % 4;
        // check triggers
        this._checkTriggers();
      } else {
        // Lerp pixel position
        const startX = this.player.tileX * TILE_SIZE;
        const startY = this.player.tileY * TILE_SIZE;
        const endX   = this.player.targetTileX * TILE_SIZE;
        const endY   = this.player.targetTileY * TILE_SIZE;
        this.player.pixelX = startX + (endX - startX) * this.player.stepProgress;
        this.player.pixelY = startY + (endY - startY) * this.player.stepProgress;
      }
    } else {
      // Try to start a new move
      let dx = 0, dy = 0;
      if (this.keys['ArrowUp']    || this.keys['w'] || this.keys['W']) { dy = -1; }
      else if (this.keys['ArrowDown']  || this.keys['s'] || this.keys['S']) { dy = 1;  }
      else if (this.keys['ArrowLeft']  || this.keys['a'] || this.keys['A']) { dx = -1; }
      else if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) { dx = 1;  }

      if (dx !== 0 || dy !== 0) {
        this._startMove(dx, dy);
      } else {
        // Idle - reset anim to neutral
        this.player.animFrame = 0;
      }
    }

    this._updateCamera();
    this._checkPaintingProximity();
  }

  _startMove(dx, dy) {
    // Update facing direction
    if (dy === -1) this.player.direction = 'up';
    else if (dy === 1)  this.player.direction = 'down';
    else if (dx === -1) this.player.direction = 'left';
    else if (dx === 1)  this.player.direction = 'right';

    const nx = this.player.tileX + dx;
    const ny = this.player.tileY + dy;

    if (!this._canMove(nx, ny)) return; // face direction but don't move

    this.player.targetTileX = nx;
    this.player.targetTileY = ny;
    this.player.moving = true;
    this.player.stepProgress = 0;
  }

  _canMove(tx, ty) {
    const map = this.scene === 'outdoor' ? OUTDOOR_MAP : INDOOR_MAP;
    const cols = map[0].length;
    const rows = map.length;
    if (tx < 0 || ty < 0 || tx >= cols || ty >= rows) return false;
    const tileType = map[ty][tx];
    return !SOLID.has(tileType);
  }

  _getTile(tx, ty) {
    const map = this.scene === 'outdoor' ? OUTDOOR_MAP : INDOOR_MAP;
    if (!map[ty] || map[ty][tx] === undefined) return -1;
    return map[ty][tx];
  }

  _checkTriggers() {
    const t = this._getTile(this.player.tileX, this.player.tileY);
    if (this.scene === 'outdoor' && t === TILE.DOOR) {
      this._startTransition('indoor', 7, 8);
    } else if (this.scene === 'indoor' && t === TILE.EXIT) {
      this._startTransition('outdoor', 9, 6);
    }
  }

  _startTransition(targetScene, targetTileX, targetTileY) {
    if (this.fadeState !== 'none') return;
    this.fadeState = 'fade_out';
    this.fadeTimer = 0;
    this.fadeAlpha = 0;
    this.pendingScene = targetScene;
    this.pendingPlayerTile = { x: targetTileX, y: targetTileY };
  }

  _switchScene() {
    this.scene = this.pendingScene;
    const p = this.pendingPlayerTile;
    this.player.tileX = p.x;
    this.player.tileY = p.y;
    this.player.targetTileX = p.x;
    this.player.targetTileY = p.y;
    this.player.pixelX = p.x * TILE_SIZE;
    this.player.pixelY = p.y * TILE_SIZE;
    this.player.moving = false;
    this.player.stepProgress = 0;
    this.player.direction = this.pendingScene === 'indoor' ? 'up' : 'down';
    this._snapCamera();
  }

  _snapCamera() {
    const map = this.scene === 'outdoor'
      ? { w: OUTDOOR_COLS * TILE_SIZE, h: OUTDOOR_ROWS * TILE_SIZE }
      : { w: INDOOR_COLS  * TILE_SIZE, h: INDOOR_ROWS  * TILE_SIZE };
    const target = this._cameraTarget(map);
    this.camera.x = target.x;
    this.camera.y = target.y;
  }

  _cameraTarget(map) {
    const cx = this.player.pixelX + TILE_SIZE / 2 - this.W / 2;
    const cy = this.player.pixelY + TILE_SIZE / 2 - this.H / 2;
    return {
      x: Math.max(0, Math.min(cx, map.w - this.W)),
      y: Math.max(0, Math.min(cy, map.h - this.H)),
    };
  }

  _updateCamera() {
    const mapW = this.scene === 'outdoor' ? OUTDOOR_COLS * TILE_SIZE : INDOOR_COLS * TILE_SIZE;
    const mapH = this.scene === 'outdoor' ? OUTDOOR_ROWS * TILE_SIZE : INDOOR_ROWS * TILE_SIZE;
    const map = { w: mapW, h: mapH };
    const target = this._cameraTarget(map);
    const lerpSpeed = 0.15;
    this.camera.x += (target.x - this.camera.x) * lerpSpeed;
    this.camera.y += (target.y - this.camera.y) * lerpSpeed;
    this.camera.x = Math.max(0, Math.min(this.camera.x, mapW - this.W));
    this.camera.y = Math.max(0, Math.min(this.camera.y, mapH - this.H));
  }

  _checkPaintingProximity() {
    if (this.scene !== 'indoor') {
      this.nearPainting = null;
      this.facingInteractive = false;
      return;
    }

    const paintings = [
      { tileType: TILE.PAINT_L1, tx: 1, ty: 2, projectIndex: 0, label: 'Project 1' },
      { tileType: TILE.PAINT_L2, tx: 1, ty: 5, projectIndex: 1, label: 'Project 2' },
      { tileType: TILE.PAINT_R1, tx: 14, ty: 2, projectIndex: 2, label: 'Project 3' },
      { tileType: TILE.PAINT_R2, tx: 14, ty: 5, projectIndex: 3, label: 'Project 4' },
    ];

    const px = this.player.tileX;
    const py = this.player.tileY;
    const dir = this.player.direction;

    this.nearPainting = null;
    this.facingInteractive = false;

    for (const p of paintings) {
      const dist = Math.abs(px - p.tx) + Math.abs(py - p.ty);
      if (dist <= 2) {
        this.nearPainting = p;
        // Check if facing the painting
        if (p.tx === 1 && dir === 'left' && px <= 3) {
          this.facingInteractive = true;
        } else if (p.tx === 14 && dir === 'right' && px >= 12) {
          this.facingInteractive = true;
        }
        break;
      }
    }
  }

  _handleInteract() {
    if (this.scene !== 'indoor' || !this.nearPainting || this.fadeState !== 'none') return;
    if (!this.facingInteractive) return;
    const projectIndex = this.nearPainting.projectIndex;
    const project = this.projects[projectIndex];
    if (project && this.onProjectOpen) {
      this.modalOpen = true;
      this.onProjectOpen(project);
    }
  }

  // ---- Render ----
  _render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);

    ctx.save();
    ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    this._drawMap();
    this._drawPlayerSprite();

    ctx.restore();

    // UI overlays (in screen space)
    if (this.scene === 'indoor') {
      this._drawHoverLabels();
      if (this.facingInteractive && this.nearPainting) {
        this._drawPrompt();
      }
    }
    this._drawControls();
    this._drawFade();
  }

  _drawMap() {
    const map = this.scene === 'outdoor' ? OUTDOOR_MAP : INDOOR_MAP;
    const cols = map[0].length;
    const rows = map.length;

    const startCol = Math.max(0, Math.floor(this.camera.x / TILE_SIZE) - 1);
    const startRow = Math.max(0, Math.floor(this.camera.y / TILE_SIZE) - 1);
    const endCol   = Math.min(cols - 1, Math.ceil((this.camera.x + this.W) / TILE_SIZE) + 1);
    const endRow   = Math.min(rows - 1, Math.ceil((this.camera.y + this.H) / TILE_SIZE) + 1);

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const tileType = map[row][col];
        drawTile(this.ctx, tileType, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE);
      }
    }
  }

  _drawPlayerSprite() {
    drawPlayer(
      this.ctx,
      this.player.pixelX,
      this.player.pixelY,
      this.player.direction,
      this.player.animFrame,
      this.player.running,
    );
  }

  _drawHoverLabels() {
    if (!this.nearPainting) return;
    const ctx = this.ctx;
    const paintings = [
      { tileType: TILE.PAINT_L1, tx: 1, ty: 2, projectIndex: 0, label: 'Project 1' },
      { tileType: TILE.PAINT_L2, tx: 1, ty: 5, projectIndex: 1, label: 'Project 2' },
      { tileType: TILE.PAINT_R1, tx: 14, ty: 2, projectIndex: 2, label: 'Project 3' },
      { tileType: TILE.PAINT_R2, tx: 14, ty: 5, projectIndex: 3, label: 'Project 4' },
    ];

    for (const p of paintings) {
      const px2 = this.player.tileX;
      const py2 = this.player.tileY;
      const dist = Math.abs(px2 - p.tx) + Math.abs(py2 - p.ty);
      if (dist > 3) continue;

      const screenX = p.tx * TILE_SIZE - this.camera.x + TILE_SIZE / 2;
      const bob = Math.sin(Date.now() / 500) * 3;
      const screenY = p.ty * TILE_SIZE - this.camera.y - 10 + bob;

      ctx.font = '6px "Press Start 2P", monospace';
      const label = p.label;
      const textW = ctx.measureText(label).width;
      const boxW = textW + 12;
      const boxH = 16;
      const boxX = Math.round(screenX - boxW / 2);
      const boxY = Math.round(screenY - boxH);

      // Box shadow
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(boxX + 2, boxY + 2, boxW, boxH);
      // Box background
      ctx.fillStyle = '#F8F8D8';
      ctx.fillRect(boxX, boxY, boxW, boxH);
      // Box border
      ctx.fillStyle = '#383838';
      ctx.strokeStyle = '#383838';
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      // Text
      ctx.fillStyle = '#181828';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, boxX + 6, boxY + boxH / 2);
    }
  }

  _drawPrompt() {
    const ctx = this.ctx;
    const text = 'Z: View Project';
    ctx.font = '6px "Press Start 2P", monospace';
    const textW = ctx.measureText(text).width;
    const boxW = textW + 16;
    const boxH = 20;
    const boxX = Math.round(this.W / 2 - boxW / 2);
    const boxY = this.H - boxH - 8;

    // Dark border
    ctx.fillStyle = '#383838';
    ctx.fillRect(boxX - 2, boxY - 2, boxW + 4, boxH + 4);
    // White inner
    ctx.fillStyle = '#F8F8F8';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    // Inner border
    ctx.strokeStyle = '#383838';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX + 2, boxY + 2, boxW - 4, boxH - 4);
    // Text
    ctx.fillStyle = '#181828';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, boxX + 8, boxY + boxH / 2);
  }

  _drawControls() {
    const ctx = this.ctx;
    ctx.font = '5px "Press Start 2P", monospace';
    const lines = [
      '←↑→↓ Move',
      'SHIFT Run',
      'Z Interact',
    ];
    const lineH = 10;
    const padX = 6;
    const padY = 5;
    const boxW = 88;
    const boxH = lines.length * lineH + padY * 2;
    const boxX = 4;
    const boxY = this.H - boxH - 4;

    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#888868';
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = '#D8D8B8';
    ctx.textBaseline = 'top';
    lines.forEach((line, i) => {
      ctx.fillText(line, boxX + padX, boxY + padY + i * lineH);
    });
  }

  _drawFade() {
    if (this.fadeAlpha <= 0) return;
    const ctx = this.ctx;
    ctx.fillStyle = `rgba(0,0,0,${this.fadeAlpha})`;
    ctx.fillRect(0, 0, this.W, this.H);
  }
}
