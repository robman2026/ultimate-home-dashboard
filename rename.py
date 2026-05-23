
import os

replacements = [
    ("customElements.define('room-card'",            "customElements.define('uhd-room-card'"),
    ("customElements.define('energy-card'",           "customElements.define('uhd-energy-card'"),
    ("customElements.define('garage-card'",           "customElements.define('uhd-garage-card'"),
    ("customElements.define('media-card'",            "customElements.define('uhd-media-card'"),
    ("customElements.define('members-card'",          "customElements.define('uhd-members-card'"),
    ("customElements.define('clock-weather-card'",    "customElements.define('uhd-clock-weather-card'"),
    ("customElements.define('sensor-overview-card'",  "customElements.define('uhd-sensor-overview-card'"),
    ("customElements.define('dashboard-card-editor'", "customElements.define('uhd-dashboard-card-editor'"),
    ("customElements.define('room-card-editor'",      "customElements.define('uhd-room-card-editor'"),
    ("document.createElement('room-card-editor')",    "document.createElement('uhd-room-card-editor')"),
    ("document.createElement('dashboard-card-editor')", "document.createElement('uhd-dashboard-card-editor')"),
    ("<room-card", "<uhd-room-card"),
    ("</room-card>", "</uhd-room-card>"),
    ("<energy-card", "<uhd-energy-card"),
    ("</energy-card>", "</uhd-energy-card>"),
    ("<garage-card", "<uhd-garage-card"),
    ("</garage-card>", "</uhd-garage-card>"),
    ("<media-card", "<uhd-media-card"),
    ("</media-card>", "</uhd-media-card>"),
    ("<members-card", "<uhd-members-card"),
    ("</members-card>", "</uhd-members-card>"),
    ("<clock-weather-card", "<uhd-clock-weather-card"),
    ("</clock-weather-card>", "</uhd-clock-weather-card>"),
    ("<sensor-overview-card", "<uhd-sensor-overview-card"),
    ("</sensor-overview-card>", "</uhd-sensor-overview-card>"),
]

for root, dirs, files in os.walk("src"):
    for fname in files:
        if fname.endswith(".js"):
            path = os.path.join(root, fname)
            content = open(path, encoding="utf-8").read()
            for old, new in replacements:
                content = content.replace(old, new)
            open(path, "w", encoding="utf-8").write(content)
            print("Updated:", path)

print("Done!")