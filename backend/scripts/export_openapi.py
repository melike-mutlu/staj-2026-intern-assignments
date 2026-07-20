import json
import sys
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT_DIR / "openapi.json"
sys.path.insert(0, str(ROOT_DIR))

from app.main import app  # noqa: E402


def main() -> None:
    schema = app.openapi()
    OUTPUT_PATH.write_text(
        json.dumps(schema, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"OpenAPI contract exported to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
