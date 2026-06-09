#!/usr/bin/env python3
"""
Extracts frames from a 4x3 sprite sheet and creates a smooth looping video.
Output: 8 FPS, 6 seconds (48 total frames, cycling through 12 sprite frames 4 times).
"""

import sys
from pathlib import Path
from PIL import Image
import numpy as np

IMAGE_PATH = Path("/root/.claude/uploads/1fe3dea2-6915-570b-8093-1bb65ff21856/2b1d9c7b-1000077950.png")
OUTPUT_PATH = Path("motorcycle_animation.mp4")

COLS = 4
ROWS = 3
FPS = 8
DURATION_SEC = 6
TOTAL_FRAMES = FPS * DURATION_SEC  # 48
NUM_SPRITE_FRAMES = COLS * ROWS    # 12


def extract_frames(sheet: Image.Image) -> list[Image.Image]:
    """Split a 4×3 sprite sheet into individual frames, top-left to bottom-right."""
    w, h = sheet.size
    fw = w // COLS
    fh = h // ROWS
    frames = []
    for row in range(ROWS):
        for col in range(COLS):
            box = (col * fw, row * fh, (col + 1) * fw, (row + 1) * fh)
            frames.append(sheet.crop(box).convert("RGB"))
    return frames


def write_video_cv2(frames: list[Image.Image], out_path: Path) -> bool:
    try:
        import cv2
        sample = np.array(frames[0])
        h, w = sample.shape[:2]
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
        imageio.mimwrite(str(out_path), arrays, fps=FPS, codec="libx264",
                         output_params=["-crf", "18", "-pix_fmt", "yuv420p"])
        return True
    except (ImportError, Exception):
        return False


def write_gif_fallback(frames: list[Image.Image], out_path: Path) -> Path:
    """GIF fallback if no video writer is available."""
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
    print(f"  Extracted {len(sprite_frames)} frames "
          f"({sprite_frames[0].size[0]}×{sprite_frames[0].size[1]} px each)")

    # Build full frame list: cycle through sprite frames to fill TOTAL_FRAMES
    video_frames = [sprite_frames[i % NUM_SPRITE_FRAMES] for i in range(TOTAL_FRAMES)]
    print(f"  Building {TOTAL_FRAMES} video frames ({FPS} FPS × {DURATION_SEC}s)")

    if write_video_cv2(video_frames, OUTPUT_PATH):
        print(f"Video written (cv2):    {OUTPUT_PATH}")
    elif write_video_imageio(video_frames, OUTPUT_PATH):
        print(f"Video written (imageio): {OUTPUT_PATH}")
    else:
        gif = write_gif_fallback(video_frames, OUTPUT_PATH)
        print(f"No video encoder found — wrote GIF fallback: {gif}")
        print("Install opencv-python or imageio[ffmpeg] for MP4 output.")
        sys.exit(0)

    print("Done.")


if __name__ == "__main__":
    main()
