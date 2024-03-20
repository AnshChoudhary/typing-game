import time
import pyautogui
import pytesseract

# Function to perform OCR on the game window
def get_words_to_type():
    # Capture a screenshot of the game window
    screen_width, screen_height = pyautogui.size()  # Get the screen resolution

    x = 0  # Leftmost position
    y = 300  # Start capturing from 500 pixels down
    width = screen_width  # Full width of the screen
    height = screen_height - y  # Height from y to the bottom of the screen

    webpage_region = (x, y, width, height)

    screenshot = pyautogui.screenshot(region=webpage_region)

    # Perform OCR on the screenshot to extract the words

    words = pytesseract.image_to_string(screenshot)

    # Split the extracted text into individual words
    words = words.split()

    # Filter out non-alphabetic characters and short words
    words = [word.lower() for word in words if word.isalpha() and len(word) > 2]

    return words

# Delay to allow time to switch to the game window
time.sleep(5)

# Main game loop
while True:
    # Get the words to type from the game window
    words_to_type = get_words_to_type()

    # Type the words
    for word in words_to_type:
        pyautogui.typewrite(word)
        pyautogui.press('enter')  # Press Enter to submit the typed word

        # Wait for the next word to appear
        time.sleep(0.8)  # Adjust delay as needed
