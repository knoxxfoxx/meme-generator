# Testing Guide - Meme Generator

## 🚀 Getting Started

### Step 1: Install Node.js

If you haven't already:
1. Download from https://nodejs.org/ (LTS version)
2. Install and restart your terminal
3. Verify installation:
```powershell
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### Step 2: Install Dependencies

```powershell
cd C:\Apps\L-Cursor
npm install
```

This will install all required packages:
- Next.js 14
- React 18
- InstantDB
- TypeScript
- Tailwind CSS

**Expected output:** You'll see package installation progress. This may take 2-3 minutes.

### Step 3: Start Development Server

```powershell
npm run dev
```

**Expected output:**
```
> meme-generator@0.1.0 dev
> next dev

  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

### Step 4: Open the App

Open your browser and go to:
- **http://localhost:3000**

The app should automatically redirect you to the feed page.

---

## 🧪 Testing Checklist

### 1. Navigation & Pages

- [ ] Homepage redirects to `/feed`
- [ ] Navigation bar appears at top
- [ ] Can click "Feed" to see feed page
- [ ] Can click "Create" to see meme creator
- [ ] "My Memes" only appears when signed in

### 2. Authentication (Magic Link)

**Test Sign In:**
1. Click any action that requires auth (like "Save Meme")
2. You'll see the auth form
3. Enter your email address
4. Click "Send Verification Code"
5. **Check your email** for the 6-digit code
6. Enter the code in the verification form
7. Click "Verify Code"

**Expected:** You should be signed in immediately

**Test the auth form:**
- [ ] Email input only accepts valid email format
- [ ] "Send Verification Code" button is disabled until email is entered
- [ ] After sending code, you see the verification code input
- [ ] Code input only accepts 6 digits
- [ ] "Verify Code" button is disabled until 6 digits entered
- [ ] Can click "Resend Code" to get a new code
- [ ] Can click "Back to Email" to restart the process

**Test Sign Out:**
- [ ] Click "Sign Out" in navigation
- [ ] "My Memes" link disappears
- [ ] Navigation shows "Sign in to create memes"

### 3. Meme Creation (on `/create` page)

**Test Image Selection:**
- [ ] Left sidebar shows "Templates" header
- [ ] Template gallery loads and displays images
- [ ] Can click a template to load it on canvas
- [ ] Template gets green border when selected
- [ ] Click "Upload Image" button
- [ ] Select an image file from your computer
- [ ] Image appears on canvas

**Test Text Overlays:**
- [ ] Type in "Top Text" input field
- [ ] Text appears at top of meme in white with black outline
- [ ] Type in "Bottom Text" input field
- [ ] Text appears at bottom of meme
- [ ] Text updates in real-time as you type

**Test Font Controls:**
- [ ] Move "Size" slider from 20 to 240
- [ ] Text size changes dynamically
- [ ] Size value displays next to slider
- [ ] Click color picker
- [ ] Select different colors
- [ ] Text color changes (black outline remains)

**Test Download:**
- [ ] Click "Download" button (with or without auth)
- [ ] Browser downloads a PNG file named "meme.png"
- [ ] Downloaded image contains your meme with text

**Test Save (requires auth):**
- [ ] Click "Save Meme" button
- [ ] If not signed in, auth form appears
- [ ] After signing in, meme is saved
- [ ] You see "Meme saved successfully!" alert
- [ ] You're redirected to feed page
- [ ] Your meme appears in the feed

### 4. Feed Page (`/feed`)

**Test Viewing Memes:**
- [ ] Page title shows "Meme Feed"
- [ ] All memes display in a grid
- [ ] Newest memes appear first
- [ ] Each meme shows:
  - The meme image
  - Upvote button with count
  - Creation date

**Test Upvoting (requires auth):**
- [ ] Click upvote button on a meme
- [ ] If not signed in, auth form appears
- [ ] After signing in, upvote registers
- [ ] Button changes appearance (highlighted)
- [ ] Count increases by 1
- [ ] Click upvote button again to unvote
- [ ] Button returns to normal appearance
- [ ] Count decreases by 1

**Test Real-time Updates:**
- [ ] Open the app in a second browser window/tab
- [ ] Create and save a meme in one window
- [ ] The new meme appears in the feed in the other window **without refreshing**
- [ ] Upvote a meme in one window
- [ ] Count updates in the other window **without refreshing**

### 5. My Memes Page (`/my-memes`)

**Test Access Control:**
- [ ] Sign out and try to access `/my-memes`
- [ ] You see "Please sign in to view your memes"
- [ ] Sign in
- [ ] Navigate to "My Memes"
- [ ] Only YOUR memes appear (not others' memes)

**Test Meme Management:**
- [ ] Each of your memes shows Edit and Delete buttons
- [ ] Memes show "Updated:" timestamp
- [ ] Most recently updated memes appear first

**Test Edit:**
- [ ] Click "Edit" button on a meme
- [ ] You're taken to `/create?id={memeId}`
- [ ] Canvas loads with the existing meme
- [ ] Text inputs populate with existing text
- [ ] Font size and color match the saved meme
- [ ] Make changes to text/size/color
- [ ] Click "Save Meme"
- [ ] See "Meme updated successfully!" alert
- [ ] Return to feed or my-memes
- [ ] Changes are visible

**Test Delete:**
- [ ] Click "Delete" button on a meme
- [ ] You see confirmation dialog: "Are you sure you want to delete this meme?"
- [ ] Click "Cancel" - nothing happens
- [ ] Click "Delete" button again
- [ ] Click "OK" on confirmation
- [ ] Meme disappears from your collection
- [ ] Meme also disappears from feed

### 6. Responsive Design

**Test on Different Screen Sizes:**

**Desktop (> 1024px):**
- [ ] Sidebar is 280px wide
- [ ] Canvas is centered in main area
- [ ] Toolbar is at bottom with all controls visible

**Tablet (768px - 1024px):**
- [ ] Sidebar is 240px wide
- [ ] Layout adjusts proportionally
- [ ] All features remain accessible

**Mobile (< 768px):**
- [ ] Sidebar becomes narrower (200px)
- [ ] Toolbar stacks vertically
- [ ] Template gallery shows single column
- [ ] Meme grid shows single column

### 7. Permissions & Security

**Test Permission Enforcement:**
- [ ] Sign in as User A
- [ ] Create a meme
- [ ] Note the meme ID
- [ ] Sign out
- [ ] Sign in as User B (different email)
- [ ] Try to access `/create?id={User A's meme ID}`
- [ ] User B cannot load User A's meme for editing
- [ ] User B can view the meme in feed but cannot edit/delete it

**Test Unauthenticated Actions:**
- [ ] Sign out
- [ ] Can view feed ✓
- [ ] Can view memes ✓
- [ ] Cannot upvote (prompts for auth) ✓
- [ ] Cannot save memes (prompts for auth) ✓
- [ ] Cannot access "My Memes" page (prompts for auth) ✓

### 8. Edge Cases & Error Handling

**Test Empty States:**
- [ ] Sign in with a new email (no memes yet)
- [ ] Go to "My Memes"
- [ ] See message: "You haven't created any memes yet"
- [ ] Create the first meme - verify it appears

**Test Invalid Actions:**
- [ ] Try to download without selecting an image
- [ ] See alert: "Please select an image first!"
- [ ] Try to save without selecting an image
- [ ] See alert: "Please select an image first!"

**Test Image Loading Errors:**
- [ ] If a template fails to load
- [ ] Template item is hidden automatically
- [ ] Other templates continue to work

**Test Long Text:**
- [ ] Type 50 characters in top text (max length)
- [ ] Input stops accepting more characters
- [ ] Same for bottom text

**Test Authentication Errors:**
- [ ] Enter invalid email format
- [ ] Submit button remains disabled
- [ ] Enter valid email
- [ ] Submit button becomes enabled
- [ ] Request code
- [ ] Enter wrong code
- [ ] See error message: "Invalid verification code"
- [ ] Code input clears
- [ ] Can try again

---

## 🐛 Common Issues & Solutions

### Issue: "npm: command not found"
**Solution:** Install Node.js from nodejs.org and restart terminal

### Issue: "Port 3000 is already in use"
**Solution:** 
```powershell
# Option 1: Stop the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Use a different port
npm run dev -- -p 3001
```

### Issue: Templates not loading
**Solution:** 
- Check that files exist in `public/assets/`
- Check that `templates.json` lists correct filenames
- Verify file extensions match (case-sensitive)

### Issue: "Module not found" errors
**Solution:**
```powershell
# Clean install
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

### Issue: Authentication not working
**Solution:**
- Check your email spam folder for the verification code
- Verify InstantDB app ID is correct in `lib/db.ts`
- Check browser console for any errors (F12)

### Issue: Images not saving/displaying
**Solution:**
- Canvas images are stored as base64 data URLs
- Very large images may cause issues
- Try with smaller images (< 2MB recommended)

---

## 📊 Performance Testing

### Test Real-time Updates Speed
1. Open app in 2 browser windows
2. Create meme in Window 1
3. Measure time until it appears in Window 2's feed
4. **Expected:** < 1 second

### Test Canvas Performance
1. Select a large image
2. Type text while moving font size slider
3. Canvas should redraw smoothly without lag
4. **Expected:** No noticeable delay

### Test Feed Loading
1. Go to feed with many memes
2. Scroll through the grid
3. Images should load progressively (lazy loading)
4. **Expected:** Smooth scrolling

---

## ✅ Success Criteria

**The app is working correctly if:**
- ✅ All pages load without errors
- ✅ Authentication flow completes successfully
- ✅ Memes can be created, saved, and displayed
- ✅ Upvoting works and updates in real-time
- ✅ Edit/delete functionality works for own memes
- ✅ Permissions are enforced (can't edit others' memes)
- ✅ Real-time updates work across multiple browser windows
- ✅ No console errors (check browser DevTools)

---

## 🎯 Quick Test Script

For a rapid test of core functionality:

1. **Start server:** `npm run dev`
2. **Open:** http://localhost:3000
3. **Navigate to Create page**
4. **Select a template**
5. **Add text:** "TEST MEME" / "PLEASE IGNORE"
6. **Click Save Meme**
7. **Sign in** with email
8. **Enter code** from email
9. **Verify:** Meme appears in feed
10. **Go to My Memes**
11. **Click Edit** on your meme
12. **Change text**
13. **Save again**
14. **Verify:** Changes appear
15. **Click Upvote** on any meme
16. **Verify:** Count increases
17. **Click Delete** on your test meme
18. **Confirm deletion**
19. **Verify:** Meme removed from feed

**Time estimate:** 5-10 minutes for complete flow

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________
Browser: ___________
Node Version: ___________

[ ] App starts successfully
[ ] Authentication works
[ ] Meme creation works
[ ] Meme editing works
[ ] Meme deletion works
[ ] Upvoting works
[ ] Real-time updates work
[ ] Permissions enforced
[ ] Mobile responsive
[ ] No console errors

Issues Found:
1. _______________
2. _______________
3. _______________

Notes:
_______________
_______________
```

---

Happy Testing! 🎉
