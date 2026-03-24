from playwright.sync_api import sync_playwright
import os

def take_screenshots():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # Home
        print("Taking home screenshot...")
        page.goto('http://localhost:5174/')
        page.wait_for_timeout(3000)
        page.screenshot(path='public/screenshots/home.png')

        # Quiz
        print("Taking quiz screenshot...")
        page.click('text=Commencer la partie')
        page.wait_for_selector('h2', state='visible', timeout=10000)
        page.wait_for_timeout(1000)
        page.screenshot(path='public/screenshots/quiz.png')

        # History (empty but with headers)
        print("Taking history screenshot...")
        page.goto('http://localhost:5174/history')
        page.wait_for_timeout(1000)
        page.screenshot(path='public/screenshots/history.png')

        # Leaderboard (empty but with headers)
        print("Taking leaderboard screenshot...")
        page.goto('http://localhost:5174/leaderboard')
        page.wait_for_timeout(1000)
        page.screenshot(path='public/screenshots/leaderboard.png')

        browser.close()

if __name__ == '__main__':
    take_screenshots()
