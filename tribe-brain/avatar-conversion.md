# Avatar Conversion — BVM

This document describes the BVM avatar conversion flow.

---

## Overview

When a user uploads a photo for their BVM (Best Version of Me), the app converts it into an illustrated avatar that matches the visual style of the other advisor avatars.

The goal is for the BVM avatar to visually belong with the tribe — same framing, illustration style, and overall polish.

---

## Flow

1. User opens BVM Settings from the main page
2. User uploads a photo (any standard image format)
3. App shows a staged loading sequence:
   - "Uploading photo..."
   - "Analyzing your features..."
   - "Converting your photo into your personal avatar..."
   - "Finalizing your avatar..."
4. Generated avatar is shown as a preview
5. User confirms with "Use This Avatar", or uploads a different photo
6. Confirmed avatar is saved and used in the BVM identity block on the main page

---

## Avatar Style Target

The generated BVM avatar should aim to match the other advisor avatars:

- Illustrated portrait style
- Framing: head and shoulders, centered
- Clean, modern illustration with defined outlines
- Soft studio lighting
- Neutral or warm background
- Consistent circular crop at 72px display size

Reference: see assets/avatars/avtar prompt.txt for the full avatar style spec.

---

## Storage

The confirmed BVM avatar is stored in localStorage under the key tribe_bvm:

{
  "name": "Best Version of Me",
  "avatar": "data:image/...base64..."
}

The uploaded source photo is not stored separately. Only the converted avatar is persisted.

---

## Empty State

If no avatar has been uploaded yet:
- The BVM identity block shows an initial-letter placeholder (styled in the app's blue)
- A hint link is shown: "Upload a photo to personalize your BVM avatar"
- Clicking the hint opens BVM Settings

The feature remains fully accessible even without an uploaded photo.

---

## Notes

- The uploaded photo is NOT shown directly as the final in-app avatar
- The conversion step produces an illustrated avatar that matches the visual style of the tribe
- No backend assessment or scoring is required to access BVM
- BVM display name and avatar are managed in BVM Settings, not in Profile Settings
