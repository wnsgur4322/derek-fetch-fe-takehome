# Derek's Fetch Doggo Finder

This is a take-home assignment for the Fetch Rewards Frontend role. The application allows users to search for dogs by various filters, add them to a favorites list, and find their best match. 

---

## Table of Contents
1. Tech Stack
2. Features
3. Setup Instructions
4. Usage
5. Issue
6. Screenshots

---

## Tech Stack
- **React**: Component-based UI library
- **Next.js**: Full-stack framework for server-side rendering and routing
- **TypeScript**: main written language
- **Tailwind CSS**: Utility first CSS framework

---

## Features
- **Login Page**: Authenticate users using Fetch Rewards API.
- **Search Page**: 
  - Filter dogs by breed, location, and age.
  - Sort results by name, breed, or age (ascending/descending).
  - Paginated search results.
  - Add dogs to a favorites list.
- **Matching Functionality**: Find a match from the favorites list and display details on the match page.

---

## Usage
Log in using the Login Page.
Use the Search Page to filter and sort dogs.
Add dogs to your favorites list.
Click "Find Match" to view your best match on the Match Page.

---

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo-url
   ```
2. **Install Dependencies**:
   ```bash
   cd derek-fetch-fe-takehome
   npm install
   ```
3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

---

## Issue
When making a GET request to the /dogs/search API:

A single zip code works correctly:
```bash
https://frontend-take-home-service.fetch.com/dogs/search?size=25&from=0&sort=name:asc&zipCodes=33190
```
However, multiple zip codes result in no matching dog IDs:
```bash
https://frontend-take-home-service.fetch.com/dogs/search?size=25&from=0&sort=name:asc&zipCodes=90001,33190
```
or
```bash
https://frontend-take-home-service.fetch.com/dogs/search?size=25&from=0&sort=name:asc&zipCodes=[90001,33190]
```
This may be caused by a parsing issue with array-type query parameters in the API. I thiink switching to a `POST` request and sending `zipCodes` in the request body resolves the issue.

---
## Screenshots

### Login page
<img width="1415" alt="image" src="https://github.com/user-attachments/assets/278f23ef-32bf-46d5-9020-7d7f135b2c18" />

### Search page
<img width="1398" alt="image" src="https://github.com/user-attachments/assets/ae40f8ae-bb59-41df-b67e-3fc94b43c3f4" />
<img width="1406" alt="image" src="https://github.com/user-attachments/assets/f21c8a16-cc67-4969-bd5e-30d1e6609514" />
<img width="830" alt="image" src="https://github.com/user-attachments/assets/97e8855a-6749-4c6d-a66f-2b9706f71686" />


### Match page
<img width="1388" alt="image" src="https://github.com/user-attachments/assets/fdd1e4aa-4d5b-4cc8-8ef6-487fed667647" />

