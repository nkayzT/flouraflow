#!/usr/bin/env python3
"""
Extracts frames from a 4x3 sprite sheet, removes frame-number labels,
and produces a smooth looping MP4.
Output: 4 FPS, 6 seconds (24 total frames, cycling through 12 sprite frames 2×).
"""

import sys
from pathlib import Path
from PIL import Image
import numpy as np

IMAGE_PATH = Path("/root/.claude/uploads/1fe3dea2-6915-570b-8093-1bb65ff21856/2b1d9c7b-1000077950.png")
OUTPUT_PATH = Path("motorcycle_animation.mp4")

COLS = 4
ROWS = 3
FPS = 4
DURATION_SEC = 6
TOTAL_FRAMES = FPS * DURATION_SEC    # 24
NUM_SPRITE_FRAMES = COLS * ROWS      # 12

# The frame-number labels live in this top-left rectangle (pixels).
# "12." widest label reaches ~x=60, tallest glyph+dot reaches ~y=60; add margins.
LABEL_H = 72   # height of number label area
LABEL_W = 78   # width ensures full clone zone ends well past "12." (x≈60)


def remove_label(frame_arr: np.ndarray) -> np.ndarray:
    """
    Erase the frame-number label in the top-left corner by cloning
    a matching sky patch from just to the right of the label area,
    then feather-blend the seam so there's no hard edge.
    """
    arr = frame_arr.copy().astype(np.float32)
    h, w = arr.shape[:2]

    # Source patch: same vertical strip well clear of the label (no text there).
    src_x0 = LABEL_W + 5          # small gap so we don't sample any shadow
    src_x1 = min(src_x0 + LABEL_W, w)
    src_patch = arr[:LABEL_H, src_x0:src_x1].copy()

    # Tile if narrower than needed (edge case for very small frames).
    if src_patch.shape[1] < LABEL_W:
        reps = -(-LABEL_W // src_patch.shape[1])
        src_patch = np.tile(src_patch, (1, reps, 1))
    src_patch = src_patch[:LABEL_H, :LABEL_W]

    # Build a soft alpha mask: full cover in the centre, fading to 0
    # at the right and bottom edges so the clone blends into the original.
    fade_px = 14   # feather width in pixels; fade starts at x=64 (past "12." at x≈60)
    alpha = np.ones((LABEL_H, LABEL_W), dtype=np.float32)
    # fade right edge (clone→original)
    for k in range(fade_px):
        alpha[:, LABEL_W - fade_px + k] = k / fade_px
    # fade bottom edge
    for k in range(fade_px):
        alpha[LABEL_H - fade_px + k, :] = np.minimum(
            alpha[LABEL_H - fade_px + k, :], k / fade_px
        )
    alpha = alpha[:, :, np.newaxis]   # (H, W, 1) for broadcasting

    arr[:LABEL_H, :LABEL_W] = (
        src_patch * alpha + arr[:LABEL_H, :LABEL_W] * (1 - alpha)
    )
    return arr.clip(0, 255).astype(np.uint8)


def extract_frames(sheet: Image.Image) -> list[Image.Image]:
    """Split a 4×3 sprite sheet into individual frames and strip labels."""
    w, h = sheet.size
    fw = w // COLS
    fh = h // ROWS
    frames = []
    for row in range(ROWS):
        for col in range(COLS):
            box = (col * fw, row * fh, (col + 1) * fw, (row + 1) * fh)
            crop = sheet.crop(box).convert("RGB")
            clean = remove_label(np.array(crop))
            frames.append(Image.fromarray(clean))
    return frames


def write_video_cv2(frames: list[Image.Image], out_path: Path) -> bool:
    try:
        import cv2
        sample = np.array(frames[0])
        h, w = sample.shape[:2]
        # Use H.264 via ffmpeg backend for high quality
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        writer = cv2.VideoWriter(str(out_path), fourcc, FPS, (w, h))
        for frame in frames:
            bgr = cv2.cvtColor(np.array(frame), cv2.COLOR_RGB2BGR)
            writer.write(bgr)
        writer.release()
        return True
    except ImportError:
        return False


def write_video_imageio(frames: list[Image.Image], out_path: Path) -> bool:
    try:
        import imageio
        arrays = [np.array(f) for f in frames]
        imageio.mimwrite(
            str(out_path), arrays, fps=FPS, codec="libx264",
            output_params=["-crf", "12", "-pix_fmt", "yuv420p", "-preset", "slow"],
        )
        return True
    except (ImportError, Exception):
        return False


def write_gif_fallback(frames: list[Image.Image], out_path: Path) -> Path:
    gif_path = out_path.with_suffix(".gif")
    delay_ms = int(1000 / FPS)
    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        loop=0,
        duration=delay_ms,
        optimize=False,
    )
    return gif_path


def main():
    print(f"Loading sprite sheet: {IMAGE_PATH}")
    sheet = Image.open(IMAGE_PATH)
    print(f"  Sheet size: {sheet.size[0]}×{sheet.size[1]} px")

    sprite_frames = extract_frames(sheet)
    fw, fh = sprite_frames[0].size
    print(f"  Extracted {len(sprite_frames)} frames ({fw}×{fh} px each, labels removed)")

    video_frames = [sprite_frames[i % NUM_SPRITE_FRAMES] for i in range(TOTAL_FRAMES)]
    print(f"  Building {TOTAL_FRAMES} video frames ({FPS} FPS × {DURATION_SEC}s)")

    if write_video_cv2(video_frames, OUTPUT_PATH):
        print(f"Video written (cv2):     {OUTPUT_PATH}")
    elif write_video_imageio(video_frames, OUTPUT_PATH):
        print(f"Video written (imageio): {OUTPUT_PATH}")
    else:
        gif = write_gif_fallback(video_frames, OUTPUT_PATH)
        print(f"No video encoder found — wrote GIF fallback: {gif}")
        sys.exit(0)

    print("Done.")


if __name__ == "__main__":
    main()
