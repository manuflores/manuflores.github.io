#!/usr/bin/env python3
"""Print a song's waveform peaks as JSON for the orb's ring.

Usage: python3 scripts/waveform.py public/audio/song.mp3 > src/data/waveforms/song.json

Decodes with ffmpeg (mono, 8 kHz) and keeps the max amplitude of each of
BINS equal slices, normalised to 0..1 with two decimals.
"""
import array
import json
import subprocess
import sys

BINS = 160
RATE = 8000


def peaks(path: str) -> list[float]:
    raw = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(RATE), '-f', 's16le', '-'],
        check=True,
        capture_output=True,
    ).stdout
    samples = array.array('h', raw)
    size = max(1, len(samples) // BINS)
    out = [max((abs(s) for s in samples[i * size:(i + 1) * size]), default=0) for i in range(BINS)]
    top = max(out) or 1
    return [round(v / top, 2) for v in out]


if __name__ == '__main__':
    print(json.dumps(peaks(sys.argv[1])))
