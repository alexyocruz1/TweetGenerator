# ⚽ ADN Futbolero Generador

## 🧠 Overview

ADN Futbolero Generador is a lightweight web application designed to quickly create football prediction content for social media.

The system allows users to:
- Create multiple match predictions
- Generate formatted tweets automatically
- Generate downloadable 9:16 images for TikTok
- Preview everything before exporting

The focus is **speed, simplicity, and great UX**. No backend or database is required.

---

## 🚀 Core Features

### 1. Multi-Match Input System

Users can dynamically create multiple prediction blocks.

Each block contains:
- Home Team (text)
- Away Team (text)
- Competition (dropdown with emoji + name)
- Bet (text)
- Odds (text/number)
- Prediction Description (textarea)

#### Block Actions
- Add new block
- Delete block
- Duplicate block

---

### 2. Tweet Generation

A global **"Generate"** button creates one tweet per block.

#### Tweet Structure

⚽ TIPS DEL DÍA | ADN Futbolero X/N

[competition_emoji]HomeTeam vs AwayTeam
🏆CompetitionName
🎯Bet @ Odds
💡PredictionDescription

#Hashtag1 #Hashtag2

---

### 🧮 Rules & Logic

#### Numbering
- X = current index (starting at 1)
- N = total number of matches
- Order = order of creation

---

#### Hashtag Generation

Function rules:

1. If team name has **1 word**:
   → `#TeamName`

2. If team name has **2 words AND both have ≥4 letters**:
   → `#Word1Word2`
   - Example: Real Madrid → `#RealMadrid`

3. Otherwise:
   → Use the most relevant word with ≥3 letters (prefer longest word)
   - Example: FSC Hallway → `#Hallway`

---

#### Competition

- Must be selected from a dropdown (not free text)
- Includes:
  - Emoji (flag or icon)
  - Competition name

Example options:
- 🇨🇴 Primera A
- 🇪🇸 La Liga
- 🇺🇪 Champions League

---

### 3. Image Generation (TikTok Format)

Each match generates a downloadable image.

#### Specs:
- Aspect ratio: 9:16
- Resolution: 1080x1920
- Format: PNG or JPG

#### Content Layout:

HomeTeam vs AwayTeam

Competition

Prediction Description

#### Style Guidelines:
- Centered layout
- High contrast
- Large readable typography
- Clean sports-card style
- Vertical spacing optimized for mobile viewing

#### Features:
- Theme selector (dark/light)
- Download button per image

---

## 🎨 UI / UX Requirements

### Layout Structure

Header (App Name)

Match Blocks List
	•	Add Match Button

Generate Button

Results Section:
	•	Tweet Preview
	•	Copy Button
	•	Image Preview
	•	Download Button

---

### Match Block UI (Card)

Each block should be visually separated:

| Home Team                |
| Away Team                |
| Competition (dropdown)   |
| Bet                      |
| Odds                     |
| Description              |
|                           |
| [Duplicate] [Delete]     |

---

### UX Guidelines

- Fast input (minimal validation)
- Mobile-first design
- Auto-scroll on new block
- Smooth interactions (optional animations)
- Instant feedback after generation
- Clean and uncluttered UI

---

## 🧠 Business Logic

### Tweet Generator (Pseudo Code)

for each match in matches:
index = current position (1-based)
total = matches.length

tweet = `
⚽ TIPS DEL DÍA | ADN Futbolero ${index}/${total}

${emoji}${home} vs ${away}
🏆${competition}
🎯${bet} @ ${odds}
💡${description}

${hashtags}
`---

### Hashtag Function

function generateHashtag(teamName):
words = split(teamName)

if words.length == 1:
return “#” + words[0]

if words.length == 2 AND both words.length >= 4:
return “#” + words[0] + words[1]

else:
return “#” + longestWordWithMinLength(3)

---

### Image Generation

Recommended approach:
- Render hidden HTML template
- Convert to image using canvas

Suggested library:
- html2canvas

Steps:
1. Render styled card
2. Capture as canvas
3. Convert to image
4. Trigger download

---

## 🛠 Tech Stack (Recommended)

- Framework: Next.js (React)
- Styling: Tailwind CSS
- State: React useState
- Image generation: html2canvas

---

## 📦 Out of Scope

- Backend
- Database
- Authentication
- History or saved presets
- External APIs

---

## 🧪 Example

### Input

- Home: Independiente Medellin
- Away: America de Cali
- Competition: 🇨🇴 Primera A
- Bet: Victoria o Empate de Cali
- Odds: 1.77
- Description: Medellin es favorito, pero...

---

### Output

⚽ TIPS DEL DÍA | ADN Futbolero 1/1

🇨🇴Independiente Medellin vs America de Cali
🏆Primera A
🎯Victoria o Empate de Cali @ 1.77
💡Medellin es favorito, pero…

#Medellin #Cali

---

## 🎯 Goal

Build a tool that feels:
- Fast ⚡
- Simple 🧼
- Repeatable 🔁
- Content-ready 📱

---

## 🔜 Next Steps

1. Build UI components
2. Implement state management
3. Add tweet generation logic
4. Implement image generation
5. Polish UX

---