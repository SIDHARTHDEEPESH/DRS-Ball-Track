# DRS-Ball-Track

A Flask web application that recreates a simplified cricket **Decision Review System (DRS) ball-tracking** pipeline. Users upload a video clip of a cricket delivery; the app detects the ball in each frame using a Roboflow-hosted object detection model, masks/highlights it, predicts its trajectory with a Kalman filter, overlays the trajectory (and an estimated stump position) on the frames, and stitches the processed frames back into an output video for playback in the browser.

## Table of Contents

- [Overview](#overview)
- [How It Works (Pipeline)](#how-it-works-pipeline)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Setup](#setup)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Usage](#usage)
- [Module Reference](#module-reference)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)

## Overview

Given an uploaded video of a bowled delivery, the app:

1. Splits the video into individual frames.
2. Runs a cricket-ball object-detection model (Roboflow) on each frame.
3. Masks/highlights the detected ball.
4. Feeds detected ball positions into a Kalman-filter-based trajectory predictor.
5. Draws the predicted trajectory (and a rough stump box, via a second Roboflow "batsman/stump" model) onto each frame.
6. Reassembles the processed frames into an MP4 video and serves it back to the user for viewing (mimicking a TV-style DRS ball-tracking replay).

## How It Works (Pipeline)

```
Uploaded video
      │
      ▼
converttoframes.py  → splits video into frames/ (cropped to remove scorecard, centered crop)
      │
      ▼
det.py (Roboflow "crickettrack" model) → detects cricket-ball bounding box per frame
      │
      ▼
mask.py → draws a solid circle mask over the detected ball on the frame  (masked/)
      │
      ▼
predict_trajectory.py → Kalman filter predicts/smooths the ball's (x, y) trajectory
      │
      ▼
processstump.py + stump.py (Roboflow "batsman-detection" model) → estimates stump region and draws a marker
      │
      ▼
plot.py → overlays the predicted trajectory line onto the masked frame (trajectory/)
      │
      ▼
generate.py → stitches all frames in trajectory/ into static/output.mp4
      │
      ▼
cleanup.py → deletes temporary frames/, masked/, trajectory/ folders
      │
      ▼
Flask serves static/output.mp4 via video.html
```

## Project Structure

```
DRS-Ball-Track/
├── app.py                  # Flask web server (routes, file upload, triggers pipeline)
├── main.py                 # Orchestrates the full frame-by-frame processing pipeline
├── converttoframes.py      # Splits an uploaded video into individual PNG frames
├── det.py                  # Roboflow client: cricket-ball detection model ("crickettrack")
├── mask.py                 # Draws a mask/highlight circle over the detected ball
├── predict_trajectory.py   # Kalman-filter based trajectory prediction
├── stump.py                # Roboflow client: stump/batsman detection model
├── processstump.py         # Uses stump.py's predictions to draw an estimated stump marker
├── plot.py                 # Overlays the predicted trajectory as a line on frames
├── generate.py             # Reassembles processed frames into an output video (static/output.mp4)
├── cleanup.py              # Removes temporary frames/masked/trajectory directories after processing
├── test.py                 # Ad-hoc script for testing ball detection + masking on a single frame
├── gunicorn_config.py      # Gunicorn config for production deployment (binds 0.0.0.0:8080, 2 workers)
├── requirements.txt        # Python dependencies
├── templates/
│   ├── frontpage.html      # Upload form (landing page)
│   ├── video.html          # Displays the processed output video
│   ├── yespage.html        # (Result/feedback page)
│   └── nopage.html         # (Result/feedback page)
├── static/
│   ├── bg.png, bgt.png, grass.jpg, jmrlogo.png  # UI assets
│   └── output.mp4          # Generated at runtime (final processed video)
└── first.png, second.png   # Sample/reference images
```

At runtime, `main.py` also creates three working directories (not checked into version control by default):

- `frames/` — raw extracted video frames
- `masked/` — frames with the ball masked/highlighted
- `trajectory/` — frames with the trajectory line overlaid (source for the final video)

## Requirements

- Python 3.8+ (developed against a `pyvenv.cfg`-based virtual environment)
- pip packages (see `requirements.txt`):
  - `torch`
  - `numpy`
  - `roboflow`
  - `opencv-python`
  - `matplotlib`
  - `PIL` (Pillow)
  - `tqdm`
  - `Flask==2.2.3` (plus `click`, `colorama`, `itsdangerous`, `Jinja2`, `MarkupSafe`, `Werkzeug` pinned versions)
- A [Roboflow](https://roboflow.com/) account/API key with access to:
  - the `crickettrack` project (cricket ball detection model)
  - the `batsman-detection-ozpnz` project (stump/batsman detection model)
- `ffmpeg`/OpenCV codec support for writing H.264 MP4 files (`cv2.VideoWriter_fourcc(*"h264")`)

## Setup

```bash
# 1. Clone the repository and enter the project directory
cd DRS-Ball-Track

# 2. Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate      # on Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create the working directories used at runtime (optional — main.py creates them automatically)
mkdir -p frames masked trajectory
```

## Configuration

The Roboflow API keys and model/project names are currently **hardcoded** in the source files and must be updated before running:

- `det.py` — set your real Roboflow API key in place of `"YOUR_API_KEY"`:
  ```python
  rf = Roboflow(api_key="YOUR_API_KEY")
  project = rf.workspace().project("crickettrack")
  model = project.version(1).model
  ```
- `stump.py` — uses a separate Roboflow API key/project for stump detection:
  ```python
  rf = Roboflow(api_key="PYIeBdrA2u4Z7c8wNi3G")
  project = rf.workspace().project("batsman-detection-ozpnz")
  ```

> ⚠️ For any real deployment, move these credentials out of source code and into environment variables (e.g. `os.environ["ROBOFLOW_API_KEY"]`) rather than leaving them hardcoded.

## Running the App

**Development server (Flask built-in):**

```bash
python app.py
```

The app starts in debug mode on the default Flask port (`http://127.0.0.1:5000/`).

**Production (Gunicorn):**

```bash
gunicorn -c gunicorn_config.py app:app
```

`gunicorn_config.py` binds the app to `0.0.0.0:8080` with 2 worker processes.

## Usage

1. Navigate to the home page (`/`).
2. Upload a cricket delivery video clip via the form on `frontpage.html` (form field name: `file1`).
3. The server saves the file to `static/`, then runs the full detection → masking → trajectory-prediction → stump-marking → video-generation pipeline (`main.process(path)`).
4. Temporary frame directories are cleaned up (`cleanup.clean()`).
5. The browser is redirected to `/video/`, which plays the generated `static/output.mp4` (DRS-style trajectory replay).
6. Submitting the form again on the video page (`POST /video/`) redirects back to the home page to upload another clip.

## Module Reference

| File | Purpose |
|---|---|
| `app.py` | Flask routes: `GET/POST /` (upload + trigger processing) and `GET/POST /video/` (playback page) |
| `main.py` | `process(video)` — top-level pipeline: frame extraction → per-frame detection/masking/trajectory/stump → video generation |
| `converttoframes.py` | `convert_to_frames(video)` — reads video with OpenCV, crops out the scorecard region and center-crops width, writes numbered PNG frames to `frames/` |
| `det.py` | `detect(image)` — calls the Roboflow `crickettrack` model to detect the ball, returns prediction JSON |
| `mask.py` | `maskimg(image, x, y, w, h)` — draws a filled red circle over the ball's bounding box |
| `predict_trajectory.py` | `predict_trajectory(ball_detections, predicted_trajectory=[])` — simple linear Kalman filter (state: position + velocity) that smooths/predicts ball positions |
| `stump.py` | `pred_stump(image)` — calls the Roboflow `batsman-detection-ozpnz` model |
| `processstump.py` | `get(image)` — uses `pred_stump` output to draw an estimated stump-height green rectangle |
| `plot.py` | `plot_trajectory_as_mask(image, predicted_trajectory)` — draws the trajectory line and alpha-blends it onto the frame |
| `generate.py` | `gen(path)` — sorts frames in `trajectory/` alphanumerically and writes them to `static/output.mp4` via `cv2.VideoWriter` |
| `cleanup.py` | Deletes all files in `frames/`, `masked/`, and `trajectory/` after processing completes |
| `test.py` | Standalone script to test detection + masking against a single sample frame (`frames/305.png`) |
| `gunicorn_config.py` | Gunicorn WSGI server configuration for production hosting |

## Deployment

The project includes a `gunicorn_config.py`, indicating it is intended to be deployed behind Gunicorn (e.g. on a PaaS or containerized environment):

```bash
gunicorn -c gunicorn_config.py app:app
```

Ensure the `frames/`, `masked/`, `trajectory/`, and `static/` directories are writable by the process, and that the Roboflow API keys are configured (see [Configuration](#configuration)).

## Known Limitations

- Roboflow API keys/project names are hardcoded in `det.py` and `stump.py` — not suitable for public/shared deployments as-is.
- `converttoframes.py` calls `cv2.imshow`/`cv2.waitKey`, which requires a display and will fail or hang on headless servers; this should be removed for server-side/production use.
- The Kalman-filter trajectory prediction (`predict_trajectory.py`) uses a default mutable argument (`predicted_trajectory=[]`), which can cause state to leak across multiple calls/videos if not reset.
- `main.py` uses `prev = prev.append(...)`, which is a bug — `list.append()` returns `None`, so `prev` becomes `None` after the first detection rather than accumulating positions.
- The output video codec (`h264` via OpenCV `VideoWriter`) may not be available in all OpenCV builds/environments and can require an FFmpeg-enabled OpenCV install.
- No authentication, input validation, or file-type/size checks are performed on uploaded videos.
- `app.py`'s broad `except:` block on the upload route silently swallows all errors and re-renders the front page, making failures hard to diagnose.
