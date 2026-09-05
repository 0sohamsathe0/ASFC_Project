"""Public UI browser regression checks. Requires Python playwright and Chrome.
Run from repository root: python Frontend/scripts/public-ui-qa.py
Start Vite on 127.0.0.1:5173 first. All API responses are test fixtures;
no real contact messages, credentials, or club records are used.
Screenshots and JSON results are written to the OS temporary directory.
"""
import json
import tempfile
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright, expect

OUTPUT = Path(tempfile.gettempdir()) / "asfc-public-ui-qa"
OUTPUT.mkdir(exist_ok=True)
BASE = "http://127.0.0.1:5173"
WIDTHS = [320, 375, 390, 640, 768, 1024, 1440]
ROUTES = ["/", "/about", "/contact", "/explore-tournament", "/club-medal-record", "/not-a-page", "/maintenance"]
TOURNAMENTS = [{"_id": "qa-upcoming", "title": "QA fixture: National fencing competition with a longer tournament title", "level": "National", "startingDate": "2099-05-01", "endDate": "2099-05-03", "locationCity": "Solapur", "locationState": "Maharashtra"}, {"_id": "qa-past", "title": "QA fixture: State championship", "level": "State", "startingDate": "2020-04-01", "endDate": "2020-04-02", "locationCity": "Solapur", "locationState": "Maharashtra"}]
RESULTS = [{"level": "National", "tournaments": [{**TOURNAMENTS[0], "medalTally": {"gold": 1, "silver": 1, "bronze": 0}, "totalMedals": 2, "achievements": {"individual": [{"medal": "First", "name": "QA athlete with a deliberately long name for wrapping", "category": "under_17_foil"}], "team": [{"medal": "Second", "players": ["QA athlete one", "QA athlete two", "QA athlete three"], "category": "senior_team_foil"}]}}]}]

with sync_playwright() as pw:
    browser = pw.chromium.launch(channel="chrome", headless=True)
    context = browser.new_context(reduced_motion="reduce")
    state = {"mode": "populated", "contact": "success", "role": "guest"}
    api_calls = []
    pending = []
    def intercept(route):
        request = route.request
        path = urlparse(request.url).path
        if path in ["/admin/verify", "/player/profile", "/health", "/tournament/all", "/result/club"] or (path == "/contact" and request.method == "POST"):
            api_calls.append(path)
            if path in ["/tournament/all", "/result/club"] and state["mode"] == "loading":
                pending.append(route)
                return
            status, payload = 200, {"success": True}
            if path == "/admin/verify":
                if state["role"] != "admin": status, payload = 401, {"success": False}
            elif path == "/player/profile":
                status, payload = (200, {"success": True, "player": {"fullName": "QA player"}}) if state["role"] == "player" else (401, {"success": False})
            elif path == "/health": status = 503
            elif path in ["/tournament/all", "/result/club"]:
                if state["mode"] == "error": status, payload = 500, {"message": "QA simulated unavailable service"}
                elif path == "/tournament/all": payload = {"success": True, "data": [] if state["mode"] == "empty" else TOURNAMENTS}
                else: payload = {"success": True, "data": [] if state["mode"] == "empty" else RESULTS, "analytics": {"totalMedals": 0 if state["mode"] == "empty" else 2}}
            elif path == "/contact":
                status, payload = (200, {"message": "QA enquiry accepted"}) if state["contact"] == "success" else (400, {"message": "QA enquiry failed"})
            route.fulfill(status=status, content_type="application/json", body=json.dumps(payload), headers={"access-control-allow-origin": BASE, "access-control-allow-credentials": "true"})
        elif urlparse(request.url).hostname not in ["127.0.0.1", "localhost"]:
            # External embeds are intentionally isolated from the visual regression run.
            route.fulfill(status=200, content_type="text/html", body="<body style='background:#e6e9ed;color:#556174;font:16px Arial;padding:32px'>Map embed isolated for local visual QA</body>")
        else: route.continue_()
    context.route("**/*", intercept)
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    measurements = []
    for width in WIDTHS:
        page.set_viewport_size({"width": width, "height": 900})
        for path in ROUTES:
            page.goto(BASE + path)
            expect(page.locator("h1")).to_have_count(1)
            page.wait_for_timeout(250)
            assert urlparse(page.url).path == path, page.url
            if path == "/club-medal-record":
                expect(page.get_by_role("button", name="View results (2)")).to_be_visible()
                page.get_by_role("button", name="View results (2)").click()
                expect(page.get_by_text("QA athlete with a deliberately long name for wrapping")).to_be_visible()
            dimensions = page.evaluate("""() => ({width: innerWidth, scroll: document.documentElement.scrollWidth, heading: document.querySelector('h1').getBoundingClientRect().width})""")
            assert dimensions["scroll"] <= width, (path, width, dimensions)
            measurements.append({"route": path, **dimensions})
            if width in [390, 1440]:
                # Trigger lazy image loading before full-page capture.
                for image in page.locator("main img").all():
                    image.scroll_into_view_if_needed()
                    image.evaluate("img => img.decode()")
                for frame in page.locator("iframe").all():
                    frame.scroll_into_view_if_needed()
                    page.wait_for_timeout(150)
                page.evaluate("window.scrollTo(0,0)")
                page.screenshot(path=str(OUTPUT / ((path.strip("/") or "home") + f"-{width}.png")), full_page=True)
        if width < 1200:
            page.goto(BASE)
            button = page.get_by_role("button", name="Open navigation")
            button.click()
            expect(page.get_by_role("button", name="Close navigation")).to_have_attribute("aria-expanded", "true")
            assert page.evaluate("document.body.style.overflow") == "hidden"
            assert page.locator("#public-mobile-menu").bounding_box()["y"] == 80
            page.get_by_role("link", name="Join ASFC", exact=True).focus()
            page.keyboard.press("Tab")
            expect(page.get_by_role("button", name="Close navigation")).to_be_focused()
            page.keyboard.press("Escape")
            expect(button).to_be_focused()
            assert page.evaluate("document.body.style.overflow") != "hidden"
            button.click()
            page.get_by_role("navigation", name="Mobile navigation", exact=True).get_by_role("link", name="About", exact=True).click()
            expect(page.locator("#public-mobile-menu")).to_have_count(0)
            assert page.evaluate("document.body.style.overflow") != "hidden"
    for path in ["/explore-tournament", "/club-medal-record"]:
        state["mode"] = "loading"
        page.goto(BASE + path)
        expect(page.locator(".public-data-state--loading")).to_be_visible()
        while pending:
            pending.pop().fulfill(status=200, content_type="application/json", body=json.dumps({"success": True, "data": []}))
        expect(page.locator(".public-data-state--empty").first).to_be_visible()
        state["mode"] = "error"
        page.goto(BASE + path)
        expect(page.get_by_role("button", name="Try again", exact=True)).to_be_visible()
        state["mode"] = "empty"
        page.get_by_role("button", name="Try again", exact=True).click()
        expect(page.locator(".public-data-state--empty").first).to_be_visible()
    page.goto(BASE + "/contact")
    for name, value in [("Full name", "QA Test"), ("Email address", "qa@example.invalid"), ("Phone number", "1234567890"), ("Subject", "Local QA only"), ("Your message", "Intercepted in the browser; never sent to the club.")]:
        page.get_by_label(name, exact=True).fill(value)
    page.get_by_role("button", name="Send Message").click()
    expect(page.get_by_role("status")).to_have_text("QA enquiry accepted")
    expect(page.get_by_label("Full name", exact=True)).to_have_value("")
    state["contact"] = "error"
    for name, value in [("Full name", "QA Test"), ("Email address", "qa@example.invalid"), ("Phone number", "1234567890"), ("Subject", "Local QA only"), ("Your message", "Intercepted in the browser.")]: page.get_by_label(name, exact=True).fill(value)
    page.get_by_role("button", name="Send Message").click()
    expect(page.get_by_role("alert")).to_have_text("QA enquiry failed")
    expect(page.get_by_label("Full name", exact=True)).to_have_value("QA Test")
    # A 200% layout zoom check at desktop viewport, with readable reflow.
    page.goto(BASE)
    page.evaluate("document.documentElement.style.zoom = '2'")
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), "Zoom overflow"
    page.evaluate("document.documentElement.style.zoom = ''")
    for role, label in [("player", "My Profile"), ("admin", "Dashboard")]:
        state["role"] = role
        page.goto(BASE)
        expect(page.get_by_role("link", name=label, exact=True)).to_be_visible()
    state["role"] = "guest"
    page.goto(BASE + "/player/login")
    assert page.locator("main.public-site").count() == 0
    page.goto(BASE + "/admin/login")
    assert page.locator(".public-nav").count() == 0
    assert not errors, errors
    (OUTPUT / "results.json").write_text(json.dumps({"measurements": measurements, "runtime_errors": errors, "status": "passed", "fixtures": True}, indent=2))
    print(json.dumps({"status": "passed", "viewport_route_checks": len(measurements), "screenshots": str(OUTPUT), "runtime_errors": errors}))
    browser.close()
