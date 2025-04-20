# StepTracker Docker Setup

## Usage

1. From the `docker` directory, run:
   ```sh
   docker compose up --build
   ```
2. The backend will be available at http://localhost:5120
3. The frontend (Vite dev server) will be available at http://localhost:5173

Both services run in watch mode for hot reload on code changes.

## Notes
- Volumes are mounted for live reload.
- If you encounter permission issues on Linux, try adding `:z` to the volume mounts.
- Stop with `docker compose down`.
