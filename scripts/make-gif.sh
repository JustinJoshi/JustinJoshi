#!/usr/bin/env bash
# Convert Playwright screenshots to an animated GIF for the README.
# Usage: ./scripts/make-gif.sh piano|nano
#
# Requires: ffmpeg
set -euo pipefail

PROJECT="${1:-piano}"
OUT_DIR="scripts/out"
GIF_PATH="images/${PROJECT}-demo.gif"

mkdir -p "$(dirname "$GIF_PATH")"

# Gather screenshots in order
mapfile -t FRAMES < <(ls "${OUT_DIR}/${PROJECT}-"*.png 2>/dev/null | sort)

if [[ ${#FRAMES[@]} -eq 0 ]]; then
  echo "No frames found in ${OUT_DIR}/${PROJECT}-*.png" >&2
  exit 1
fi

echo "Converting ${#FRAMES[@]} frames → ${GIF_PATH}"

# Build a complex filterchain: scale all frames, stack as inputs
FILTER=""
INPUTS=""
for i in "${!FRAMES[@]}"; do
  INPUTS+=" -i ${FRAMES[$i]}"
  FILTER+="[${i}:v]scale=640:-1:flags=lanczos,format=yuva420p[f${i}];"
done

# Concat with crossfade-like transitions (simple concat for now)
CONCAT=""
for i in "${!FRAMES[@]}"; do
  CONCAT+="[f${i}]"
done
CONCAT+="concat=n=${#FRAMES[@]}:v=1:a=0[out]"

ffmpeg -y ${INPUTS} \
  -filter_complex "${FILTER}${CONCAT}" \
  -map "[out]" \
  -loop 0 \
  -r 1 \
  -vf "split[s0][s1];[s0]palettegen=max_colors=128:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" \
  "${GIF_PATH}"

echo "Done: ${GIF_PATH} ($(du -h "${GIF_PATH}" | cut -f1))"
